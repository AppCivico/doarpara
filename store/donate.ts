import type { ApiError, CreatedDonation, DonationMessage } from '@/doar-para.d.ts';
import type { CreditCard, PaymentToken } from '@/iugu.d.ts';
import randomString from '@/utils/randomString.ts';
import removeAccented from '@/utils/removeAccented.js';
import getDonationFP from '@/vendor/donationFp.js';
import type { FetchError } from 'ofetch';
import { useCampaignStore } from './campaign.ts';
import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';

declare const VotolegalFP: any;
declare const Iugu: any;
type DonationResponse = {
  donation: CreatedDonation;
  ui: { messages: DonationMessage[] };
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
type ReferralCodes = { [key: string]: string; };
type CreditCardError = {
  expiration?: string;
  number?: string;
  first_name?: string;
  last_name?: string;
  verification_value?: string;
};
type StateErrors = {
  gettingAddress: FetchError | ApiError | null;
  validatingDevice: FetchError | ApiError | null;
  creatingDonation: FetchError | ApiError | null;
  validatingCreditCard: CreditCardError | null;
  payingDonation: FetchError | ApiError | null;
};
type ValidatedCard = { cc_hash: string; id: string; };

export const useDonateStore = defineStore('toDonate', () => {
  const deviceAuthorizationToken = ref('');
  const referral = ref<ReferralCodes>({});
  const donor = reactive({
    first_name: '',
    last_name: '',
    email: '',
    birthdate: '',
    phone_number: '',
    cpf: '',
  });
  const donorAddress = reactive({
    zip_code: '',
    state: '',
    city: '',
    district: '',
    street: '',
    number: '',
    complement: '',
  });
  const pending = reactive({
    gettingAddress: false,
    validatingDevice: false,
    creatingDonation: false,
    validatingCreditCard: false,
    payingDonation: false,
  });
  const errors = reactive<StateErrors>({
    gettingAddress: null,
    validatingDevice: null,
    creatingDonation: null,
    validatingCreditCard: null,
    payingDonation: null,
  });

  const combinedPending = computed(() => Object.values(pending).some(value => value === true));
  const combinedErrors = computed(() => Object.values(errors).filter(value => !!value).map(x => JSON.stringify(x)));
  const pendingMessage = computed(() => Object.keys(pending).find(x => pending[x as keyof typeof pending] !== false));
  const payloadForCreationOfDonationOnBackEnd = computed<DonorData>(() => {
    const campaignStore = useCampaignStore();
    return {
      email: donor.email,
      cpf: donor.cpf ? donor.cpf.replace(/[^0-9]/g, '') : '',
      name: `${donor.first_name} ${donor.last_name}`,
      referral_code: campaignStore.campaign?.id ? referral.value[campaignStore.campaign.id] : undefined,
      address_zipcode: donorAddress.zip_code,
      address_state: donorAddress.state,
      address_city: donorAddress.city,
      address_street: donorAddress.street,
      address_district: donorAddress.district,
      address_house_number: donorAddress.number,
      address_complement: donorAddress.complement,
      phone: donor.phone_number ? donor.phone_number.replace(/[^0-9]+/g, '') : '',
      birthdate: donor.birthdate,
      billing_address_zipcode: donorAddress.zip_code,
      billing_address_state: donorAddress.state,
      billing_address_city: donorAddress.city,
      billing_address_street: donorAddress.street,
      billing_address_district: donorAddress.district,
      billing_address_house_number: donorAddress.number,
      billing_address_complement: donorAddress.complement,
    };
  });

  // --- ACTIONS (agora funções) ---
  async function fillAddressFromPostalCode(postalCode: string): Promise<void> {
    pending.gettingAddress = true;
    errors.gettingAddress = null;
    return $fetch<PostalServiceQueryResult>(`${useRuntimeConfig().public.postalService.queryUrl}${postalCode}`)
      .then((response) => {
        const { street, city, state, district } = response;
        donorAddress.street = ['vazio', 'Não consta'].indexOf(street) === -1 ? street : '';
        donorAddress.city = ['vazio', 'Não consta'].indexOf(city) === -1 ? city : '';
        donorAddress.state = ['vazio', 'Não consta'].indexOf(state) === -1 ? state : '';
        donorAddress.district = ['vazio', 'Não consta'].indexOf(district) === -1 ? district : '';
      })
      .catch((err) => {
        donorAddress.street = '';
        donorAddress.city = '';
        donorAddress.state = '';
        donorAddress.district = '';
        errors.gettingAddress = err;
      })
      .finally(() => {
        pending.gettingAddress = false;
      });
  }

  async function getDeviceAuthorizationToken(params = {}): Promise<string | undefined> {
    pending.validatingDevice = true;
    errors.validatingDevice = null;
    const runtimeConfig = useRuntimeConfig();
    try {
      const response: { device_authorization_token_id: string } = await $fetch(
        `${runtimeConfig.public.privateApiBase}/api2/device-authentication`,
        { method: 'POST', ...params },
      );
      pending.validatingDevice = false;
      if (response?.device_authorization_token_id) {
        deviceAuthorizationToken.value = response.device_authorization_token_id;
      }
      return response?.device_authorization_token_id;
    } catch (err) {
      errors.validatingDevice = err as FetchError;
      pending.validatingDevice = false;
      throw createError(err as FetchError);
    }
  }

  async function createDonationOnBackEnd(amount: number, paymentMethod: string): Promise<{ data: DonationResponse }> {
    if (typeof VotolegalFP !== 'function') throw new Error('VotolegalFP is not loaded yet');
    pending.creatingDonation = true;
    errors.creatingDonation = null;
    try {
      const runtimeConfig = useRuntimeConfig();
      const payload = payloadForCreationOfDonationOnBackEnd.value;
      const { email, cpf = '' } = payload;
      const token = deviceAuthorizationToken.value || String(await getDeviceAuthorizationToken());
      const nonce = randomString(13);
      const str = `${nonce}${Number.parseInt(cpf.replace(/[^0-9]+/g, ''), 10) * -1}/\u00A0${amount}${email.toUpperCase()}`;
      const fp = new VotolegalFP({ excludeUserAgent: true, dontUseFakeFontInCanvas: true });
      const hash = fp.x64hash128(str);
      const donationFp = await getDonationFP();
      const campaignStore = useCampaignStore();
      const response: DonationResponse = await $fetch(`${runtimeConfig.public.privateApiBase}/api2/donations`, {
        method: 'POST',
        body: { ...payload, payment_method: paymentMethod, amount, candidate_id: campaignStore.campaign?.id || 0, donation_fp: donationFp, nc: nonce, sv: hash, device_authorization_token_id: token },
      });
      pending.creatingDonation = false;
      return { data: response };
    } catch (err) {
      errors.creatingDonation = err as FetchError;
      pending.creatingDonation = false;
      throw createError(err as FetchError);
    }
  }

  async function validateCard(card: CreditCard): Promise<ValidatedCard> {
    pending.validatingCreditCard = true;
    errors.validatingCreditCard = null;
    const [validityMonth, validityYear] = card.expiration.split('/');
    const cc = Iugu.CreditCard(card.number, validityMonth, validityYear, removeAccented(donor.first_name), removeAccented(donor.last_name), card.verification_value);
    return new Promise<ValidatedCard>((resolve, reject) => {
      Iugu.createPaymentToken(cc, (response: PaymentToken) => {
        if (response.errors) {
          errors.validatingCreditCard = response.errors as CreditCardError;
          reject(response.errors);
        } else {
          const payload: ValidatedCard = {
            cc_hash: new VotolegalFP({ excludeUserAgent: true, dontUseFakeFontInCanvas: true }).x64hash128(cc.number, 31),
            id: response.id,
          };
          resolve(payload);
        }
        pending.validatingCreditCard = false;
      });
    });
  }

  async function payCreditCardDonation(donationId: string | number, payload: ValidatedCard): Promise<DonationResponse> {
    pending.payingDonation = true;
    errors.payingDonation = null;
    try {
      const runtimeConfig = useRuntimeConfig();
      const token = deviceAuthorizationToken.value;
      const response = await $fetch<DonationResponse>(`${runtimeConfig.public.privateApiBase}/api2/donations/${donationId}`, {
        method: 'POST',
        body: { device_authorization_token_id: token, credit_card_token: payload.id, cc_hash: payload.cc_hash },
      });
      pending.payingDonation = false;
      return response;
    } catch (err) {
      errors.payingDonation = (err as FetchError);
      pending.payingDonation = false;
      throw createError(err as FetchError);
    }
  }

  // --- RETORNO ---
  return {
    // State
    deviceAuthorizationToken,
    referral,
    donor,
    donorAddress,
    pending,
    errors,
    // Getters
    combinedPending,
    combinedErrors,
    pendingMessage,
    payloadForCreationOfDonationOnBackEnd,
    // Actions
    fillAddressFromPostalCode,
    getDeviceAuthorizationToken,
    createDonationOnBackEnd,
    validateCard,
    payCreditCardDonation,
  };
}, {
  // A configuração do `persist` funciona perfeitamente aqui.
  persist: {
    debug: !!import.meta.dev,
    pick: ['deviceAuthorizationToken', 'referral', 'donor', 'donorAddress'],
  },
});
