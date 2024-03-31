import randomString from '@/utils/randomString.ts';
import removeAccented from '@/utils/removeAccented.js';
import getDonationFP from '@/vendor/donationFp.js';
import type { CreatedDonation, DonationMessage } from '~/doar-para.d.ts';
import type { CreditCard, PaymentToken } from '~/iugu.d.ts';
import { useCampaignStore } from './campaign.ts';

declare const VotolegalFP: any;
declare const Iugu: any;

type DonationResponse = {
  donation: CreatedDonation;
  ui: {
    messages: DonationMessage[]
  }
  errors?: unknown;
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

type StateErrors = {
  gettingAddress: unknown,
  validatingDevice: unknown,
  creatingDonation: unknown,
  validatingCreditCard: unknown,
  payingDonation: unknown,
};

type ValidatedCard = {
  cc_hash: string;
  id: string;
};

export const useDonateStore = defineStore('toDonate', {
  persist: {
    storage: persistedState.cookiesWithOptions({
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    }),
  },
  state: () => ({
    deviceAuthorizationTokenId: '',
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
    error: <StateErrors> {
      gettingAddress: null,
      validatingDevice: null,
      creatingDonation: null,
      validatingCreditCard: null,
      payingDonation: null,
    },
  }),
  actions: {
    async fillAddressFromPostalCode(postalCode:string) {
      this.pending.gettingAddress = true;
      this.error.gettingAddress = null;

      const {
        data, error,
      } = await useFetch<PostalServiceQueryResult>(`${useRuntimeConfig().public.postalService.queryUrl}${postalCode}`);

      this.pending.gettingAddress = false;

      if (data.value) {
        const {
          street, city, state, district,
        } = data.value;

        // not using `$patch()` to keep reactivity of sibling properties under `address.`
        this.donorAddress.street = street;
        this.donorAddress.city = city;
        this.donorAddress.state = state;
        this.donorAddress.district = district;
      }

      if (error.value) {
        this.error.gettingAddress = error.value;
      }
    },

    async getDeviceAuthorizationToken() {
      this.pending.validatingDevice = true;
      this.error.validatingDevice = null;

      const runtimeConfig = useRuntimeConfig();

      const {
        data, error,
      } = await useFetch<{ device_authorization_token_id: string }>(`${runtimeConfig.public.privateApiBase}/api2/device-authentication`, { method: 'POST' });

      this.pending.validatingDevice = false;

      if (data.value?.device_authorization_token_id) {
        this.deviceAuthorizationTokenId = data.value?.device_authorization_token_id;
      }

      if (error.value) {
        this.error.validatingDevice = error.value;
      }

      return data.value?.device_authorization_token_id;
    },

    async createDonationOnBackEnd(amount: number, paymentMethod:string) {
      if (typeof VotolegalFP !== 'function') {
        throw new Error('VotolegalFP is not loaded yet');
      }

      this.pending.creatingDonation = true;
      this.error.creatingDonation = null;

      const runtimeConfig = useRuntimeConfig();

      const payload = this.payloadForCreationOfDonationOnBackEnd;
      const { email, cpf = '' } = payload;

      const deviceAuthorizationTokenId = this.deviceAuthorizationTokenId
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

      const {
        data, error,
      } = await useFetch< DonationResponse >(`${runtimeConfig.public.privateApiBase}/api2/donations`, {
        method: 'POST',
        body: {
          ...payload,
          payment_method: paymentMethod,
          amount,
          candidate_id: campaignStore.campaign?.id || 0,
          donation_fp: donationFp,
          nc: nonce,
          sv: hash,
          device_authorization_token_id: deviceAuthorizationTokenId,
        },
      });

      this.pending.creatingDonation = false;

      if (error.value) {
        this.error.creatingDonation = error.value;
      }

      return { data: data.value, error: error.value };
    },

    async validateCard(card: CreditCard): Promise<ValidatedCard> {
      this.pending.validatingCreditCard = true;
      this.error.validatingCreditCard = null;
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
          if ('errors' in response) {
            this.error.validatingCreditCard = response.errors;
            reject(new Error(`Error creating payment token: ${response.errors}`));
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

    async payCreditCardDonation(donationId: string | number, payload: ValidatedCard) {
      this.pending.payingDonation = true;
      this.error.payingDonation = null;

      const runtimeConfig = useRuntimeConfig();

      const { deviceAuthorizationTokenId: token } = this;

      const {
        data, error,
      } = await useFetch< DonationResponse >(`${runtimeConfig.public.privateApiBase}/api2/donations/${donationId}`, {
        method: 'POST',
        query: {
          device_authorization_token_id: token,
          credit_card_token: payload.id,
          cc_hash: payload.cc_hash,
        },
      });

      this.pending.payingDonation = false;

      if (error.value) {
        this.error.payingDonation = error.value;
      }

      return { data: data.value, error: error.value };
    },
  },
  getters: {
    consolidatedPending: (({ pending }) => Object.values(pending).some((value) => value === true)),

    pendingMessage: (({ pending }) => Object.keys(pending)
      .find((x) => pending[x as keyof typeof pending] !== false)),

    payloadForCreationOfDonationOnBackEnd: ((state): DonorData => {
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
