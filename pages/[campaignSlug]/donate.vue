<template>
  <div class="donation-form-and-messages">
    <form v-if="!isDonationConcluded" action="" class="donation-form" @submit.prevent="submitDonation">
      <fieldset v-debug>
        <label for="">
          campo para testes! Será removido posteriormente
          <input v-model.number="amount" type="number" step="0.01">
        </label>
      </fieldset>

      <fieldset class="flexible-fieldset" :disabled="combinedPending">
        <p data-field-size="50">
          <label for="first-name">
            {{ $t('donationForm.name') }}
          </label>
          <input
            id="first-name"
            v-model.trim="donor.first_name"
            v-focus
            type="text"
            name="first_name"
            autocomplete="given-name"
            required
          >
        </p>

        <p data-field-size="50">
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

        <p data-field-size="50">
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

          <small>
            {{ $t('donationForm.naturalPersonIdentificationAgreement') }}
          </small>
        </p>

        <p data-field-size="50">
          <label for="birthdate">
            {{ $t('donationForm.birthDate') }}
          </label>
          <input
            id="birthdate"
            v-model.trim="donor.birthdate"
            type="date"
            name="birthdate"
            autocomplete="bday"
            required
            inputmode="numeric"
          />
        </p>

        <p data-field-size="50">
          <label for="email">
            {{ $t('donationForm.email') }}
          </label>
          <input
            id="email"
            v-model.trim="donor.email"
            type="email"
            name="email"
            autocomplete="email"
            required
          >
        </p>

        <p data-field-size="50">
          <label for="phone">
            {{ $t('donationForm.phoneNumber') }}
          </label>
          <input
            id="phone"
            v-model.trim="donor.phone_number"
            v-maska
            data-maska="['(##) ####-####', '(##) #####-####']"
            type="tel"
            name="phone"
            autocomplete="tel-national"
            placeholder="(00) 00000-0000"
            minlength="14"
            required
          />
        </p>
      </fieldset>

      <pre v-debug>donor:{{ donor }}</pre>

      <fieldset class="flexible-fieldset" :disabled="combinedPending || pending.gettingAddress">
        <p data-field-size="50">
          <label for="postal-code">
            {{ $t('donationForm.postalCode') }}
            <small>
              <NuxtLink
                v-if="runtimeConfig.public.postalService.helperWebsiteUrl"
                :href="runtimeConfig.public.postalService.helperWebsiteUrl"
                class="like-a__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                ({{ $t('donationForm.iDoNotKnowMyPostalCode').toLowerCase() }})
              </NuxtLink>

            </small>
          </label>
          <input
            id="postal-code"
            v-model.trim="donorAddress.zip_code"
            v-maska
            name="zip_code"
            type="text"
            aria-live="assertive"
            required
            data-maska="#####-###"
            :aria-busy="pending.gettingAddress"
            :class="{
              'field--error': errors.gettingAddress,
            }"
            @blur="fillAddress"
          />
          <small v-if="errors.gettingAddress" class="field__error">
            {{ errors.gettingAddress?.data?.error || errors.gettingAddress }}
          </small>
        </p>

        <p data-field-size="75">
          <label for="street">
            {{ $t('donationForm.street') }}
          </label>
          <input
            id="street"
            v-model.trim="donorAddress.street"
            aria-live="assertive"
            type="text"
            required
            :aria-busy="pending.gettingAddress"
            disabled
            :class="{
            }"
          />
        </p>

        <p data-field-size="25">
          <label for="number">
            {{ $t('donationForm.number') }}
          </label>
          <input
            id="number"
            v-model.trim="donorAddress.number"
            type="text"
            required
          />
        </p>

        <p data-field-size="40">
          <label for="extended-address">
            {{ $t('donationForm.extendedAddress') }}
          </label>
          <input
            id="extended-address"
            v-model.trim="donorAddress.complement"
            type="text"
            name="extended-address"
            autocomplete="address-level4"
          />
        </p>

        <p data-field-size="45">
          <label for="city">
            {{ $t('donationForm.city') }}
          </label>
          <input
            id="city"
            v-model.trim="donorAddress.city"
            type="text"
            disabled
            required
            :aria-busy="pending.gettingAddress"
          />
        </p>

        <p data-field-size="15">
          <label for="state">
            {{ $t('donationForm.state') }}
          </label>

          <select
            id="state"
            v-model.trim="donorAddress.state"
            name="state"
            disabled
            required
            :aria-busy="pending.gettingAddress"
          >
            <option value="" />
            <option
              v-for="state in states"
              :key="state.abbr"
              :value="state.abbr"
              :title="state.name"
            >
              {{ state.abbr }}
            </option>
          </select>
        </p>
      </fieldset>

      <pre v-debug>donorAddress: {{ donorAddress }}</pre>

      <fieldset class="flexible-fieldset" :disabled="combinedPending">
        <legend>{{ $t('paymentMethod') }}</legend>
        <ul
          v-if="Array.isArray(campaign?.payment_method_list)
            && campaign?.payment_method_list.length"
          class="list-of-options"
        >
          <li
            v-for="method in campaign?.payment_method_list"
            :key="method"
            class="list-of-options__item"
          >
            <input
              :id="`method__${method}`"
              v-model.trim="paymentMethod"
              required
              type="radio"
              name="paymentMethod"
              :value="method"
            />
            <label :for="`method__${method}`">
              {{ $t(`paymentMethods.${method}`) }}
            </label>
          </li>
        </ul>

        <template v-if="mappedPaymentMethod === 'credit_card'">
          <p data-field-size="50">
            <label for="full-name">
              {{ $t('creditCard.fullName') }}
            </label>

            <input
              id="full-name"
              v-model.trim="creditCard.full_name"
              type="text"
              name="full_name"
              autocomplete="cc-name"
              :required="mappedPaymentMethod === 'credit_card'"
            />
            <small v-if="errors.validatingCreditCard?.first_name" class="field__error">
              {{ $t(`errors.${errors.validatingCreditCard.first_name}`) }}
            </small>
            <small v-else-if="errors.validatingCreditCard?.last_name" class="field__error">
              {{ $t(`errors.${errors.validatingCreditCard.last_name}`) }}
            </small>
          </p>

          <p data-field-size="50">
            <label for="credit-card-number">
              {{ $t('creditCard.number') }}
            </label>
            <input
              id="credit-card-number"
              v-model.trim="creditCard.number"
              v-maska
              data-maska="['#### #### #### ####', '#### #### #### ##']"
              type="text"
              inputmode="numeric"
              name="credit_card_number"
              autocomplete="cc-number"
              :required="mappedPaymentMethod === 'credit_card'"
            />
            <small v-if="errors.validatingCreditCard?.number" class="field__error">
              {{ $t(`errors.${errors.validatingCreditCard.number}`) }}
            </small>
          </p>

          <p data-field-size="25">
            <label for="credit-card-expiration-date">
              {{ $t('creditCard.expirationDate') }}
            </label>

            <input
              id="credit-card-expiration-date"
              v-model.trim="creditCard.expiration"
              v-maska
              data-maska="['##/##', '##/####']"
              type="text"
              name="credit_card_expiration_date"
              inputmode="numeric"
              autocomplete="cc-exp"
              placeholder="MM/YY"
              :required="mappedPaymentMethod === 'credit_card'"
            >
            <small v-if="errors.validatingCreditCard?.expiration" class="field__error">
              {{ $t(`errors.${errors.validatingCreditCard.expiration}`) }}
            </small>
          </p>

          <p data-field-size="25">
            <label for="credit-card-validation">
              {{ $t('creditCard.validationCode') }}
            </label>

            <input
              id="credit-card-validation"
              v-model.trim="creditCard.verification_value"
              v-maska
              class="credit-card-validation-field"
              data-maska="['###', '####']"
              type="text"
              inputmode="numeric"
              name="credit_card_validation"
              autocomplete="cc-csc"
              maxlength="4"
              minlength="3"
              :required="mappedPaymentMethod === 'credit_card'"
            >
            <small v-if="errors.validatingCreditCard?.verification_value" class="field__error">
              {{ $t(`errors.${errors.validatingCreditCard.verification_value}`) }}
            </small>
          </p>
        </template>
      </fieldset>

      <fieldset class="flexible-fieldset" :disabled="combinedPending">
        <legend>{{ $t('donationForm.donationPaymentSummary') }}</legend>

        <div class="donation-summary">
          <div class="donation-summary__item donation-summary__item--final-amount">
            <label class="donation-summary__term" for="donation-gross-value">
              {{ $t('donationForm.donationExpenses.grossAmount') }}
            </label>
            <div class="donation-summary__intermediate-control">
              <a href="#">{{ $t('donationForm.editValue') }}</a>
            </div>
            <output id="donation-gross-value" class="donation-summary__description">
              {{ $n(grossValue, 'currency', { maximumFractionDigits: 2 }) }}
            </output>
          </div>
        </div>

        <template v-if="!maxDonation || amountDonatingTaxes <= maxDonation / 100">
          <MDC
            :value="$t(
              'donationForm.donationExpenses.message',
              { campaignName: campaign?.name },
            )"
          />

          <div class="list-of-options__item">
            <input
              id="include-donation-taxes"
              v-model="toDonateTaxes"
              type="checkbox"
              name="include-donation-taxes"
              class="donation-summary__input"
            />
            <label for="include-donation-taxes" class="donation-summary__label">
              {{ $t('donationForm.donationExpenses.label') }}
              <small>
                (<template v-if="currentTaxes.percent">
                  {{ $n(currentTaxes.percent / 100, 'percent', { maximumFractionDigits: 2 }) }}
                </template>
                <template v-if="currentTaxes.percent && currentTaxes.tax">
                  +
                </template>
                <template v-if="currentTaxes.tax">
                  {{ $n(currentTaxes.tax / 100, 'currency', { maximumFractionDigits: 2 }) }}
                </template>)
              </small>
            </label>
          </div>
        </template>

        <div class="donation-summary">
          <div class="donation-summary__item">
            <label class="donation-summary__term" for="donation-total-taxes">
              {{ $t('donationForm.donationExpenses.expenses') }}
            </label>
            <output
              id="donation-total-taxes"
              class="donation-summary__description"
            >
              {{ $n(totalTaxes, 'currency', { maximumFractionDigits: 2 }) }}
            </output>
          </div>

          <div class="donation-summary__item">
            <label class="donation-summary__term" for="donation-net-value">
              {{ $t('donationForm.donationExpenses.netAmount', {
                campaignName:
                  campaign?.name,
              }) }}
            </label>
            <output id="donation-net-value" class="donation-summary__description">
              {{ $n(netValue, 'currency', { maximumFractionDigits: 2 }) }}
            </output>
          </div>
        </div>
      </fieldset>

      <pre v-debug>currentTaxes: {{ currentTaxes }}</pre>
      <pre v-debug>amount: {{ amount }}</pre>
      <pre v-debug>amountDonatingTaxes: {{ amountDonatingTaxes }}</pre>

      <MDC :value="$t('donationForm.declaration')" tag="fieldset" />

      <fieldset v-if="messages.length">
        <legend>Messages</legend>
        <p>A serem revisadas com o backend.</p>
        <template v-for="message, i in messages">
          <p v-if="message.type === 'link'" :key="`message__${i}--link`">
            <NuxtLink :to="message.href">
              {{ message.text }}
            </NuxtLink>
          </p>
          <div
            v-else-if="message.type === 'msg'"
            :key="`message__${i}--text`"
            v-html="message.text"
          />
        </template>
      </fieldset>

      <fieldset>
        <p v-if="pendingMessage" class="pending-request-message">
          {{ $t(`donationForm.pendingMessages.${pendingMessage}`) }}
        </p>
        <pre v-debug>
Here, sobral! Hydration attribute mismatch on `grossValue` or `combinedPending`:
- rendered on server: (not rendered)
- expected on client: disabled="true"
</pre>

        <button
          type="submit"
          :disabled="!grossValue || combinedPending"
          class="donation-form__submit"
          :aria-busy="combinedPending"
        >
          <img
            src="~/assets/images/icons/lock-closed.svg"
            alt=""
            width="20"
            height="20"
            aria-hidden="true"
          />
          {{ $t('donationForm.submit', { amount: $n(grossValue, 'currency', { maximumFractionDigits: 2 }) }) }}
        </button>

        <p class="safe-transaction">
          {{ $t('donationForm.safeTransaction') }}
        </p>
      </fieldset>
    </form>

    <div v-else>
      <template v-for="message, i in messages">
        <p v-if="message.type === 'link'" :key="`message__${i}--link`">
          <NuxtLink :to="message.href">
            {{ message.text }}
          </NuxtLink>
        </p>

        <template v-else-if="message.type === 'msg'">
          <template v-if="instantPaymentPlatformKey">
            <div v-if="isClipboardInaccessible" :key="i + '--copy-field'" class="input-wrapper field-for-copy__wrapper">
              <label class="field-for-copy__label" :for="`to-copy--${i}`">
                Selecione e copie
              </label>
              <input
                :id="`to-copy--${i}`"
                v-focus.select
                class="field-for-copy"
                type="text"
                readonly
                :value="instantPaymentPlatformKey"
                @click="($e) => { selectContent($e.target) }"
              />
            </div>
            <div
              v-else
              :key="`message__${i}--text`"
              @click="delegation($event)"
              @keydown="delegation($event)"
              v-html="message.text"
            />
          </template>
          <div v-else :key="`message__${i}--text`" v-html="message.text" />
        </template>
      </template>
    </div>
    <div v-debug>
      <pre>errors:{{ errors }}</pre>
      <hr />
      <pre>messages: {{ messages }}</pre>
      <hr />
      <pre>createdDonation: {{ createdDonation }}</pre>
      <hr />
      <pre>deviceAuthorizationTokenId: {{ donateStore.deviceAuthorizationTokenId }}</pre>
      <pre>pending: {{ pending }}</pre>
      <pre>combinedPending: {{ combinedPending }}</pre>
    </div>
  </div>
</template>
<script setup lang="ts">
import states from '@/data/states.json';
import taxes from '@/data/taxes.ts';
import { useCampaignStore } from '@/store/campaign.ts';
import { useDonateStore } from '@/store/donate.ts';
import type { CreatedDonation, DonationMessage } from '~/doar-para.d.ts';

declare const Iugu: any;
// const { Iugu } = (window || {} as any);

definePageMeta({
  layout: 'like-a-dialog',
  name: 'donate',
});

const appConfig = useAppConfig();
const { $i18n } = useNuxtApp();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const campaignStore = useCampaignStore();
const donateStore = useDonateStore();

const { campaign } = storeToRefs(campaignStore);

const amount = ref(0);
const creditCard = ref({
  full_name: 'Lorem Ipsum',
  number: '4111 1111 1111 1111',
  expiration: '12/30',
  verification_value: '123',
});

const createdDonation: Ref<CreatedDonation> = ref(null);
const isClipboardInaccessible = ref(true);
const messages: Ref<DonationMessage[]> = ref([]);
const paymentMethod = ref('');
const toDonateTaxes = ref(false);

const {
  combinedPending, donor, donorAddress, errors, pending, pendingMessage,
} = storeToRefs(donateStore);

// TODO: remove dumb mapping. It was a bad decision.
const mappedPaymentMethod = computed(() => {
  switch (paymentMethod.value) {
    case 'instant_payment_platform':
      return 'pix';

    case 'pro_forma_invoice':
      return 'boleto';

    default:
      return paymentMethod.value;
  }
});

const currentTaxes = computed(() => (taxes[mappedPaymentMethod.value]
  ? taxes[mappedPaymentMethod.value]
  : {
    percent: 0,
    tax: 0,
  }));

const amountDonatingTaxes = computed(() => ((typeof currentTaxes.value?.percent === 'number'
  && typeof currentTaxes.value?.tax === 'number')
  ? (amount.value + currentTaxes.value.tax / 100) / (1 - currentTaxes.value.percent / 100)
  : 0));

const isDonationConcluded = computed(() => createdDonation.value?.state !== undefined && createdDonation.value.state !== 'credit_card_form');

const instantPaymentPlatformKey = computed(() => {
  let key = '';

  messages.value.every((x) => {
    const found = x.text?.match(/(?:data-pix='(.+)')/i);
    if (found?.[1]) {
      [key] = found.slice(1, 2);
      return false;
    }
    return true;
  });

  return key;
});

const grossValue = computed(() => ((toDonateTaxes.value
  ? amountDonatingTaxes.value
  : amount.value)
  || 0
));

const maxDonation = computed(() => campaign.value?.max_donation_value || 0);

const totalTaxes = computed(() => ((typeof currentTaxes.value?.percent === 'number'
  && typeof currentTaxes.value?.tax === 'number')
  ? grossValue.value * (currentTaxes.value.percent / 100) + (currentTaxes.value.tax / 100)
  : 0));

const netValue = computed(() => grossValue.value - totalTaxes.value);

watch(amount, () => {
  toDonateTaxes.value = false;
});

watch(paymentMethod, () => {
  if (maxDonation.value && amountDonatingTaxes.value > maxDonation.value / 100) {
    toDonateTaxes.value = false;
  }
});

function addMessages(messageOrMessages: DonationMessage[] | DonationMessage) {
  if (Array.isArray(messageOrMessages)) {
    messages.value = messages.value.concat(messageOrMessages);
  } else {
    messages.value.push(messageOrMessages);
  }
}

function delegation(event: Event) {
  const target = event.target as HTMLElement;

  if (target && target.hasAttribute('data-pix')) {
    const textToCopy = target.getAttribute('data-pix');

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert('Chave PIX copiada');
        }).catch((err) => {
          isClipboardInaccessible.value = true;
          throw err;
        });
    }
  }
}

function selectContent(el: HTMLInputElement | EventTarget | null) {
  if (el instanceof HTMLInputElement) {
    el.select();
  }
}

function fillAddress(event: Event) {
  const { target: el } = event;
  const cleanPostalCode = (el as HTMLInputElement).value.replace(/\D/g, '');

  if (cleanPostalCode.length === 8) {
    donateStore.fillAddressFromPostalCode(cleanPostalCode)
      .catch(() => {
        console.debug('deu erro');
        if (el) {
          (el as HTMLInputElement).focus();
          selectContent(el as HTMLInputElement);
        }
      });
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
      .replace(/(?:^[a-z]*\$\s*)|(?:(?:\s*[a-z])*$)/gi, '');
    amount.value = (localeParseFloat(amountFromUrl, $i18n?.locale.value) || 0);
  }
}

async function submitDonation() {
  const { data: donationData, error: donationError } = await donateStore
    .createDonationOnBackEnd(grossValue.value * 100, mappedPaymentMethod.value);

  if (donationData) {
    if (donationData.donation) {
      createdDonation.value = donationData.donation;
    }

    if (donationData.ui) {
      const [iugu] = donationData.ui.messages.slice(1, 2);
      if (iugu) {
        Iugu.setAccountID(iugu.account_id);
        Iugu.setTestMode(iugu.is_testing === 1);
      }

      if (paymentMethod.value !== 'credit_card') {
        if (donationData.ui.messages) {
          addMessages(donationData.ui.messages);
        }
      }
    }
  }

  if (donationError) {
    console.debug('donationError', donationError);
    throw new Error(donationError.message);
  }

  if (mappedPaymentMethod.value !== 'credit_card') {
    return;
  }

  const validCreditCard = await donateStore.validateCard(creditCard.value);
  if (!createdDonation.value?.id) {
    throw new Error('Property `id` is missing');
  }

  const { data: paymentData, error: paymentError = null } = await donateStore
    .payCreditCardDonation(createdDonation.value.id, validCreditCard);

  if (paymentData) {
    if (paymentData?.donation) {
      createdDonation.value = paymentData.donation;
    }

    if (paymentData?.ui?.messages) {
      addMessages(paymentData?.ui?.messages);
    }
  }

  if (paymentError) {
    console.debug('paymentError', paymentError);
    throw new Error(JSON.stringify(paymentError));
  }
}

if (import.meta.client) {
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
    isClipboardInaccessible.value = !navigator.clipboard;

    if (!donateStore.deviceAuthorizationTokenId) {
      donateStore.getDeviceAuthorizationToken({
        lazy: true,
        server: false,
      });
    }

    getDonationAmount();

    paymentMethod.value = 'instant_payment_platform';

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
<style lang="scss">
.donation-form {}

.safe-transaction {
  margin-top: my.$gutter;

  color: my.palette('neutral');
  text-align: center;
}

.credit-card-validation-field {
  background-image: my.image('icons/back-of-card.svg');
  background-position: right my.$gutter * 0.5 top 50%;
}

.donation-form__submit {
  img {
    filter: invert(1);
  }
}
</style>
<style lang="scss" scoped>
@use 'sass:color';

.donation-summary {
  flex-basis: 100%;

  overflow: hidden;

  border: my.$stroke solid my.palette('border');
  border-radius: my.$rounded-corner;
}

.donation-summary__item {
  display: flex;

  flex-wrap: wrap;

  gap: my.$gutter * 0.75;

  padding: my.$gutter * 0.75;

  border-radius: 0;

  & + & {
    border-top: my.$stroke solid my.palette('border');
  }
}

.donation-summary__item--final-amount {
  background-color: my.palette('neutral', 'x-light');
}

.donation-summary__term {
  flex-basis: 50%;
  flex-grow: 1;

  margin-right: auto;
  margin-left: 0;

  font-weight: my.font-weight('text');
  text-align: left;

  border-radius: 0;
}

.donation-summary__intermediate-control {
  text-align: right;

  border-radius: 0;
}

.donation-summary__description {
  margin-right: 0;
  margin-left: auto;
  // flex-basis: 50%;

  font-weight: my.font-weight('bold');
  text-align: right;

  border-radius: 0;
}

.donation-summary__label {
  font-weight: inherit;
  color: inherit;
}

.donation-summary__input {}

.pending-request-message {
  @include my.pulsing-outline;

  position: sticky;
  bottom: my.$gutter;

  width: max-content;
  max-width: 100%;
  padding: my.$gutter;
  margin-right: auto;
  margin-bottom: my.$gutter;
  margin-left: auto;

  background-color: my.palette('neutral', 'white');
}
</style>
