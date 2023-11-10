<template>
  <form action="" @submit.prevent="submitDonation">
    <fieldset>
      <legend>{{ campaign?.name }}</legend>

      <input v-model="amount" type="number">

      <p data-size="50">
        <label for="first-name">
          {{ $t('donationForm.name') }}
        </label>
        <input
          id="first-name"
          v-model="donor.first_name"
          type="text"
          name="first_name"
          autocomplete="given-name"
          required
        >
      </p>

      <p data-size="50">
        <label for="last-name">
          {{ $t('donationForm.familyName') }}
        </label>
        <input
          id="last-name"
          v-model="donor.last_name"
          type="text"
          name="last_name"
          autocomplete="family-name"
          required
        >
      </p>

      <p data-size="50">
        <label for="natural-person-identification">
          {{ $t('naturalPersonIdentification') }}
        </label>
        <input
          id="natural-person-identification"
          v-model="donor.cpf"
          v-maska
          type="text"
          data-maska="###.###.###-##"
          inputmode="numeric"
          name="cpf"
          required
        >
      </p>

      <p data-size="50">
        <label for="email">
          {{ $t('donationForm.email') }}
        </label>
        <input
          id="email"
          v-model="donor.email"
          type="email"
          name="email"
          autocomplete="email"
          required
        >
      </p>

      <p data-size="50">
        <label for="birthdate">
          {{ $t('donationForm.birthDate') }}
        </label>
        <input
          id="birthdate"
          v-model="donor.birthdate"
          type="date"
          name="birthdate"
          autocomplete="bday"
          required
          inputmode="numeric"
        />
      </p>

      <p data-size="50">
        <label for="phone">
          {{ $t('donationForm.phoneNumber') }}
        </label>
        <input
          id="phone"
          v-model="donor.phone_number"
          v-maska
          data-maska="['(##) ####-####', '(##) #####-####']"
          type="tel"
          name="phone"
          autocomplete="tel-national"
          placeholder="(00) 00000-0000"
          minlength="14"
          :required="paymentMethod !== 'credit_card'"
        />
      </p>

      <p data-size="50">
        <label for="postal-code">
          {{ $t('donationForm.postalCode') }}
        </label>
        <input
          id="postal-code"
          v-model="donorAddress.zip_code"
          v-maska
          name="zip_code"
          type="text"
          data-maska="#####-###"
          @change="fillAddress"
        />
      </p>

      <p v-if="runtimeConfig.public.postalService.helperWebsiteUrl" data-size="50">
        <NuxtLink
          :href="runtimeConfig.public.postalService.helperWebsiteUrl"
          class="like-a__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('donationForm.iDoNotKnowMyPostalCode') }}
        </NuxtLink>
      </p>

      <p data-size="75">
        <label for="street">
          {{ $t('donationForm.street') }}
        </label>
        <input
          id="street"
          v-model="donorAddress.street"
          type="text"
        />
      </p>

      <p data-size="25">
        <label for="number">
          {{ $t('donationForm.number') }}
        </label>
        <input
          id="number"
          v-model="donorAddress.number"
          type="text"
        />
      </p>

      <p data-size="50">
        <label for="city">
          {{ $t('donationForm.city') }}
        </label>
        <input
          id="city"
          v-model="donorAddress.city"
          type="text"
        />
      </p>

      <p data-size="15">
        <label for="state">
          {{ $t('donationForm.state') }}
        </label>

        <select
          id="state"
          v-model="donorAddress.state"
          name="state"
        >
          <option value="" />
          <option v-for="state in states" :key="state.abbr" :value="state.abbr">
            {{ state.name }}
          </option>
        </select>
      </p>

      <p data-size="35">
        <label for="extended-address">
          {{ $t('donationForm.extendedAddress') }}
        </label>
        <input id="extended-address" v-model="donorAddress.complement" type="text" name="extended-address" autocomplete="address-level4" />
      </p>
    </fieldset>

    <fieldset>
      <ul
        v-if="Array.isArray(campaign?.payment_method_list)
          && campaign?.payment_method_list.length"
      >
        <li v-for="method in campaign?.payment_method_list" :key="method">
          <input
            :id="`method__${method}`"
            v-model="paymentMethod"
            type="radio"
            name="paymentMethod"
            :value="method"
          />
          <label :for="`method__${method}`">
            {{ $t(`paymentMethods.${method}`) }}
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset id="payment__credit-card">
      <p data-size="50">
        <label for="full-name">
          {{ $t('creditCard.fullName') }}
        </label>

        <input id="full-name" v-model="creditCard.full_name" type="text" name="full_name" autocomplete="cc-name" :required="paymentMethod === 'credit_card'" />
      </p>

      <p data-size="50">
        <label for="credit-card-number">
          {{ $t('creditCard.number') }}
        </label>
        <input
          id="credit-card-number"
          v-model="creditCard.number"
          v-maska
          data-maska="['#### #### #### ####', '#### #### #### ##']"
          type="text"
          inputmode="numeric"
          name="credit_card_number"
          autocomplete="cc-number"
          :required="paymentMethod === 'credit_card'"
        />
      </p>

      <p data-size="25">
        <label for="credit-card-expiration-date">
          {{ $t('creditCard.expirationDate') }}
        </label>

        <input
          id="credit-card-expiration-date"
          v-model="creditCard.expiration"
          v-maska
          data-maska="['##/##', '##/####']"
          type="text"
          name="credit_card_expiration_date"
          inputmode="numeric"
          autocomplete="cc-exp"
          placeholder="MM/YY"
          :required="paymentMethod === 'credit_card'"
        >
      </p>

      <p data-size="25">
        <label for="credit-card-validation">
          {{ $t('creditCard.validationCode') }}
        </label>

        <input
          id="credit-card-validation"
          v-model="creditCard.verification_value"
          v-maska
          data-maska="['###', '####']"
          type="text"
          inputmode="numeric"
          name="credit_card_validation"
          autocomplete="cc-csc"
          maxlength="4"
          minlength="3"
          :required="paymentMethod === 'credit_card'"
        >
      </p>
    </fieldset>
    <fieldset v-if="paymentMethod === 'pix'" id="payment__instant-payment-platform">
      <ul class="">
        <li class="">
          <input id="pix-agreement" v-model="instantPaymentPlatformAggrement" type="checkbox" class="" />
          <label for="pix-agreement" class="">
            Estou ciente de que o pagamento desta doação deve ser realizado por
            conta corrente do <strong>mesmo CPF</strong> informado a seguir e
            caso ocorram divergências a doação poderá ser estornada e a
            transação cancelada.
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset>
      <legend>{{ $t('donationForm.donationPaymentSummary') }}</legend>

      <div v-if="amount" class="candidate-amount">
        <p>
          Valor doado
          <output>
            R${{ amount }}
          </output>
        </p>
        <p v-if="paymentMethod" class="helper-text form__disclaimer">
          Taxa de {{ taxes[paymentMethod]?.text }}.
          Esse valor é destinado a taxas de operação financeira, sistemas de
          controle anti-fraude, impostos e infraestrutura.
        </p>
      </div>
    </fieldset>

    <MDC :value="$t('donationForm.declaration')" tag="fieldset" />

    <fieldset v-if="amount">
      <!--      <p v-if="error.paymentGateway || error.firstPartyApi" class="">
        {{ error.paymentGateway || error.firstPartyApi }}
      </p>
-->

      <fieldset>
        <p>{{ $t('donationForm.safeTransaction') }}</p>

        <button type="submit">
          {{ $t('donationForm.submit', { amount: $n(amount, 'currency') }) }}
        </button>
      </fieldset>
    </fieldset>
  </form>
</template>
<script setup lang="ts">
import states from '@/data/states.json';
import { useCampaignStore } from '@/store/campaign.ts';
import { useDonateStore } from '@/store/donate.ts';
import taxes from '~/data/taxes.ts';

declare const Iugu: any;

const appConfig = useAppConfig();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const campaignStore = useCampaignStore();
const donateStore = useDonateStore();

const { campaign } = storeToRefs(campaignStore);

const amount = ref(0);
const creditCard = ref({
  full_name: '',
  number: '',
  expiration: '',
  verification_value: '',
});
const paymentMethod = ref('');

const {
  donor, donorAddress, error,
  pending, referral,
} = storeToRefs(donateStore);

const instantPaymentPlatformAggrement = ref(false);

function fillAddress(event: Event) {
  const { target: el } = event;
  const cleanPostalCode = (el as HTMLInputElement).value.replace(/\D/g, '');

  if (cleanPostalCode.length === 8) {
    donateStore.fillAddressFromPostalCode(cleanPostalCode);
  }
}

function getDonationAmount() {
  let amountFromUrl = route.query[appConfig.queryStringSpecialParameters.amount];

  /*
  accepted formats:
  10
  R$20
  R$30,00
  R$ 30,00
  R$    60,00
  R$  60,0
  $10
  $ 10
  20currency
  r$20
  10,00
  50 currency
  500   currency
  500,00 currency
  1000,00   currency
  */

  if (amountFromUrl) {
    amountFromUrl = String(amountFromUrl)
      .replace(/(?:^[a-z]*\$\s*)|(?:(?:,\d{1,2})*(?:\s*[a-z])*$)/gi, '');

    amount.value = (Number.parseInt(amountFromUrl, 10) || 0);
  }
}

function getReferral() {
  const referralCode = route.query[appConfig.queryStringSpecialParameters.referrer];

  if (referralCode) {
    referral.value = String(referralCode);
  }
}

async function submitDonation() {
  await donateStore.createBackEndDonation(amount.value * 100, paymentMethod.value);

  if (paymentMethod.value === 'credit_card') {
    const payload = await donateStore.validateCard(creditCard.value);
    console.debug('payload@submitDonation', payload);
    donateStore.concludeDonation(payload);
  }
}

if (process.client) {
  useHead({
    script: [
      {
        type: 'text/javascript',
        src: 'https://js.iugu.com/v2',
        tagPosition: 'bodyClose',
      },
      {
        type: 'text/javascript',
        src: '/vendor/votolegalfp.js',
        tagPosition: 'bodyClose',
      },
    ],
  });
  onMounted(() => {
    if (!donateStore.deviceAuthorizationTokenId) {
      donateStore.getDeviceAuthorizationToken();
    }

    getDonationAmount();
    getReferral();

    window.addEventListener('load', () => {
      nextTick(() => {
        if (Iugu.utils.isBlockedByAdBlock()) {
          throw new Error('AdBlocker');
        }
      });
    });
  });
}
</script>
