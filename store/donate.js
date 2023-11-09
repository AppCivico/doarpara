import randomString from '@/utils/randomString.ts';
import removeAccented from '@/utils/removeAccented.js';
import getDonationFP from '@/vendor/donationFp.js';

export const useDonateStore = defineStore('toDonate', {
  state: () => ({
    deviceAuthorizationTokenId: '',
    amount: 0,
    referral: '',
    paymentMethod: '',

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
    donation: null,

    createdDonation: null,
    concludedDonation: null,

    creditCard: {
      number: '',
      verification_value: '',
      expiration: '',
      full_name: '',
    },

    iugu: {},
    messages: [],

    pending: {
      gettingAddress: false,
      validatingDevice: false,
      creatingDonation: false,
      validatingCreditCard: false,
      concludingDonation: false,
    },
    error: {
      gettingAddress: null,
      validatingDevice: null,
      creatingDonation: null,
      validatingCreditCard: null,
      concludingDonation: null,
    },

    /// /////////////////////////////////////////////////////////////////////////

    candidateId: 1020, // TODO: change to id of the campaign and set it!
  }),
  actions: {
    async fillAddressFromPostalCode(postalCode) {
      this.pending.gettingAddress = true;
      this.error.gettingAddress = null;

      const {
        data, error,
      } = await useFetch(`${useRuntimeConfig().public.postalService.queryUrl}${postalCode}`);

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
      } = await useFetch(`${runtimeConfig.public.privateApiBase}/api2/device-authentication`, { method: 'POST' });

      this.pending.validatingDevice = false;

      // console.debug('data.value@getDeviceAuthorizationToken', data.value);

      if (data.value?.device_authorization_token_id) {
        this.deviceAuthorizationTokenId = data.value?.device_authorization_token_id;
      }

      if (error.value) {
        this.error.validatingDevice = error.value;
      }

      return data.value?.device_authorization_token_id;
    },

    async createBackEndDonation() {
      if (typeof VotolegalFP !== 'function') {
        throw new Error('VotolegalFP is not loaded yet');
      }

      this.pending.creatingDonation = true;
      this.error.creatingDonation = null;

      const runtimeConfig = useRuntimeConfig();

      const payload = this.payloadForCreationOfDonationOnBackEnd;
      const { amount, email, cpf = '' } = payload;
      if (!this.deviceAuthorizationTokenId) {
        await this.getDeviceAuthorizationToken();
      }

      const nonce = randomString(13);
      const str = `${nonce}${Number.parseInt(cpf.replace(/[^0-9]+/g, ''), 10) * -1}/\u00A0${amount}${email.toUpperCase()}`;
      // generating nonce end hash here to avoid constant updates on getters
      const fp = new VotolegalFP({
        excludeUserAgent: true,
        dontUseFakeFontInCanvas: true,
      });
      const hash = fp.x64hash128(str);
      const donationFp = await getDonationFP();

      const {
        data, error,
      } = await useFetch(`${runtimeConfig.public.privateApiBase}/api2/donations`, {
        method: 'POST',
        body: {
          ...payload,
          donation_fp: donationFp,
          nc: nonce,
          sv: hash,
          device_authorization_token_id: this.deviceAuthorizationTokenId,
        },
      });

      this.pending.creatingDonation = false;

      if (data.value) {
        this.createdDonation = data.value.donation;

        if (data.value.ui) {
          [this.iugu] = data.value.ui.messages.slice(1, 2);
          this.messages = data.value.ui.messages;

          if (this.iugu) {
            Iugu.setAccountID(this.iugu.account_id);
            Iugu.setTestMode(this.iugu.is_testing === 1);
          }
        }
      }

      if (error.value) {
        this.error.creatingDonation = error.value;
      }
    },

    async validateCard() {
      this.pending.validatingCreditCard = true;
      this.error.validatingCreditCard = null;
      const { creditCard: card, donor, iugu } = this;
      const [validityMonth, validityYear] = card.expiration.split('/');

      Iugu.setAccountID(iugu?.account_id);
      Iugu.setTestMode(!!iugu?.is_testing);

      const cc = Iugu.CreditCard(
        card.number,
        validityMonth,
        validityYear,
        removeAccented(donor.first_name),
        removeAccented(donor.last_name),
        card.verification_value,
      );

      return new Promise((resolve, reject) => {
        Iugu.createPaymentToken(cc, (response) => {
          console.debug('response', response);

          if (response.errors) {
            console.debug('response.errors', response.errors);
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

            // console.debug('payload', payload);

            resolve(payload);
          }
          this.pending.validatingCreditCard = false;
        });
      });
    },

    async concludeDonation(payload) {
      this.pending.concludingDonation = true;
      this.error.concludingDonation = null;

      const runtimeConfig = useRuntimeConfig();

      const { createdDonation: donation, deviceAuthorizationTokenId: token } = this;

      const {
        data, error,
      } = await useFetch(`${runtimeConfig.public.privateApiBase}/api2/donations/${donation.id}?device_authorization_token_id=${token}&credit_card_token=${payload.id}&cc_hash=${payload.cc_hash}`, { method: 'POST' });

      this.pending.concludingDonation = false;

      if (data.value) {
        this.concludedDonation = data.value;
      }

      if (error.value) {
        this.error.concludingDonation = error.value;
      }
    },
  },
  getters: {
    paymentData: ((state) => ({
      payment_method: state.paymentMethod,
      email: state.donor.email,
      cpf: state.donor.cpf ? state.donor.cpf.replace(/[^0-9]/g, '') : '',
      name: `${state.donor.first_name} ${state.donor.last_name}`,
      amount: state.amount * 100,
      candidate_id: state.candidateId,
      referral_code: state.referral,
    })),
    // not arrow function, so we can access `this`
    payloadForCreationOfDonationOnBackEnd(state) {
      return {
        ...this.paymentData,
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

    consolidatedPending: (({ pending }) => Object.values(pending).some((value) => value === true)),
  },
});
