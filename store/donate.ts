import type { ApiError, CreatedDonation, DonationMessage } from '@/doar-para.d.ts';
import type { CreditCard, PaymentToken } from '@/iugu.d.ts';
import randomString from '@/utils/randomString.ts';
import removeAccented from '@/utils/removeAccented.js';
import getDonationFP from '@/vendor/donationFp.js';
import type { FetchError } from 'ofetch';
import { useCampaignStore } from './campaign.ts';

declare const VotolegalFP: any;
declare const Iugu: any;

type DonationResponse = {
  donation: CreatedDonation;
  ui: {
    messages: DonationMessage[]
  }
  errors?: FetchError | ApiError | null;
};

type DonorData = {
  email: string;
  cpf: string;
  name: string;
  referral_code: string | undefined;
  address_zipcode: string;
  address_state: string;
  address_city: string;
  address_street: string;
  address_district: string;
  address_house_number: string;
  address_complement: string;
  phone: string;
  birthdate: string;
  billing_address_zipcode: string;
  billing_address_state: string;
  billing_address_city: string;
  billing_address_street: string;
  billing_address_district: string;
  billing_address_house_number: string;
  billing_address_complement: string;
};

type PostalServiceQueryResult = {
  state: string;
  cep: string;
  district: string;
  city: string;
  street: string;
};

type ReferralCodes = {
  [key: string]: string;
};

type CreditCardError = {
  expiration?: string,
  number?: string,
  first_name?: string,
  last_name?: string,
  verification_value?: string,
};

type StateErrors = {
  gettingAddress: FetchError | ApiError | null ;
  validatingDevice: FetchError | ApiError | null ;
  creatingDonation: FetchError | ApiError | null ;
  validatingCreditCard: CreditCardError | null ;
  payingDonation: FetchError | ApiError | null ;
};

type ValidatedCard = {
  cc_hash: string;
  id: string;
};

export const useDonateStore = defineStore('toDonate', {
  persist: {
    debug: !!import.meta.dev,
    // be careful to what you add here! Do not persist sensitive information!
    paths: [
      'deviceAuthorizationToken',
      'referral',
      'donor',
      'donorAddress',
    ],
  },
  state: () => ({
    deviceAuthorizationToken: '',
    referral: <ReferralCodes> {},

    donor: {
      first_name: '',
      last_name: '',
      email: '',

      birthdate: '',
      phone_number: '',
      cpf: '', // TODO: rename to natural_person_identification
    },

    donorAddress: {
      zip_code: '',

      state: '',
      city: '',
      district: '',
      street: '',
      number: '',

      complement: '',
    },

    pending: {
      gettingAddress: false,
      validatingDevice: false,
      creatingDonation: false,
      validatingCreditCard: false,
      payingDonation: false,
    },
    errors: <StateErrors> {
      gettingAddress: null,
      validatingDevice: null,
      creatingDonation: null,
      validatingCreditCard: null,
      payingDonation: null,
    },
  }),
  actions: {
    async fillAddressFromPostalCode(postalCode: string): Promise<void> {
      this.pending.gettingAddress = true;
      this.errors.gettingAddress = null;

      return $fetch<PostalServiceQueryResult>(
        `${useRuntimeConfig().public.postalService.queryUrl}${postalCode}`,
      ).then((response) => {
        const {
          street, city, state, district,
        } = response;
        // not using `$patch()` to keep reactivity of sibling properties under `address.`
        this.donorAddress.street = street;
        this.donorAddress.city = city;
        this.donorAddress.state = state;
        this.donorAddress.district = district;
      }).catch((err) => {
        this.errors.gettingAddress = err;
      }).finally(() => {
        this.pending.gettingAddress = false;
      });
    },

    async getDeviceAuthorizationToken(params = {}) {
      this.pending.validatingDevice = true;
      this.errors.validatingDevice = null;

      const runtimeConfig = useRuntimeConfig();

      try {
        const response:{ device_authorization_token_id: string } = await $fetch(
          `${runtimeConfig.public.privateApiBase}/api2/device-authentication`,
          {
            method: 'POST',
            ...params,
          },
        );
        this.pending.validatingDevice = false;

        if (response?.device_authorization_token_id) {
          this.deviceAuthorizationToken = response.device_authorization_token_id;
        }

        return response?.device_authorization_token_id;
      } catch (err) {
        this.errors.validatingDevice = err as FetchError;
        this.pending.validatingDevice = false;
        throw err;
      }
    },

    async createDonationOnBackEnd(amount: number, paymentMethod: string) {
      if (typeof VotolegalFP !== 'function') {
        throw new Error('VotolegalFP is not loaded yet');
      }

      this.pending.creatingDonation = true;
      this.errors.creatingDonation = null;

      try {
        const runtimeConfig = useRuntimeConfig();

        const payload = this.payloadForCreationOfDonationOnBackEnd;
        const { email, cpf = '' } = payload;

        const deviceAuthorizationToken = this.deviceAuthorizationToken
        || String(await this.getDeviceAuthorizationToken());

        const nonce = randomString(13);
        const str = `${nonce}${Number.parseInt(cpf.replace(/[^0-9]+/g, ''), 10) * -1}/\u00A0${amount}${email.toUpperCase()}`;
        // generating nonce end hash here to avoid constant updates on getters
        const fp = new VotolegalFP({
          excludeUserAgent: true,
          dontUseFakeFontInCanvas: true,
        });
        const hash = fp.x64hash128(str);
        const donationFp = await getDonationFP();
        const campaignStore = useCampaignStore();
        const response:DonationResponse = await $fetch(`${runtimeConfig.public.privateApiBase}/api2/donations`, {
          method: 'POST',
          body: {
            ...payload,
            payment_method: paymentMethod,
            amount,
            candidate_id: campaignStore.campaign?.id || 0,
            donation_fp: donationFp,
            nc: nonce,
            sv: hash,
            device_authorization_token_id: deviceAuthorizationToken,
          },
        });

        this.pending.creatingDonation = false;
        return { data: response };
      } catch (err) {
        this.errors.creatingDonation = err as FetchError;

        this.pending.creatingDonation = false;

        throw err;
      }
    },

    async validateCard(card: CreditCard): Promise<ValidatedCard> {
      this.pending.validatingCreditCard = true;
      this.errors.validatingCreditCard = null;
      const { donor } = this;
      const [validityMonth, validityYear] = card.expiration.split('/');

      const cc = Iugu.CreditCard(
        card.number,
        validityMonth,
        validityYear,
        removeAccented(donor.first_name),
        removeAccented(donor.last_name),
        card.verification_value,
      );

      return new Promise((resolve, reject) => {
        Iugu.createPaymentToken(cc, (response: PaymentToken) => {
          if (response.errors) {
            this.errors.validatingCreditCard = response.errors as CreditCardError;
            reject(response.errors);
          } else {
            const payload = {
              cc_hash: new VotolegalFP({
                excludeUserAgent: true,
                dontUseFakeFontInCanvas: true,
              }).x64hash128(cc.number, 31),
              id: response.id,
            };

            resolve(payload);
          }
          this.pending.validatingCreditCard = false;
        });
      });
    },

    async payCreditCardDonation(donationId: string | number, payload: ValidatedCard):
    Promise<DonationResponse> {
      this.pending.payingDonation = true;
      this.errors.payingDonation = null;

      try {
        const runtimeConfig = useRuntimeConfig();

        const { deviceAuthorizationToken: token } = this;

        const response = await $fetch<DonationResponse>(`${runtimeConfig.public.privateApiBase}/api2/donations/${donationId}`, {
          method: 'POST',
          body: {
            device_authorization_token_id: token,
            credit_card_token: payload.id,
            cc_hash: payload.cc_hash,
          },
        });

        this.pending.payingDonation = false;

        return response;
      } catch (err) {
        this.errors.payingDonation = (err as FetchError);
        this.pending.payingDonation = false;
        throw err;
      }
    },
  },
  getters: {
    combinedPending: ({ pending }) => Object.values(pending).some((value) => value === true),

    combinedErrors: ({ errors }) => Object.values(errors).filter((value) => !!value).map((x) => JSON.stringify(x)),

    pendingMessage: ({ pending }) => Object.keys(pending)
      .find((x) => pending[x as keyof typeof pending] !== false),

    payloadForCreationOfDonationOnBackEnd: (state): DonorData => {
      const campaignStore = useCampaignStore();

      return {
        email: state.donor.email,
        cpf: state.donor.cpf ? state.donor.cpf.replace(/[^0-9]/g, '') : '',
        name: `${state.donor.first_name} ${state.donor.last_name}`,
        referral_code: campaignStore.campaign?.id
          ? state.referral[campaignStore.campaign?.id as keyof typeof state.referral]
          : undefined,
        address_zipcode: state.donorAddress.zip_code,
        address_state: state.donorAddress.state,
        address_city: state.donorAddress.city,
        address_street: state.donorAddress.street,
        address_district: state.donorAddress.district,
        address_house_number: state.donorAddress.number,
        address_complement: state.donorAddress.complement,
        phone: state.donor.phone_number
          ? state.donor.phone_number.replace(/[^0-9]+/g, '')
          : '',
        birthdate: state.donor.birthdate,
        billing_address_zipcode: state.donorAddress.zip_code,
        billing_address_state: state.donorAddress.state,
        billing_address_city: state.donorAddress.city,
        billing_address_street: state.donorAddress.street,
        billing_address_district: state.donorAddress.district,
        billing_address_house_number: state.donorAddress.number,
        billing_address_complement: state.donorAddress.complement,
      };
    },
  },
});
