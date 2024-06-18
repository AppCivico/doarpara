<!-- eslint-disable vue/block-lang -->
<script setup>
import doarPara from '../../assets/images/logo-gray.svg';
import logo from '../../assets/images/logo-receipt.svg';

definePageMeta({
  layout: 'receipt',
  name: 'receipt',
  title: 'Doar para',
  // TO-DO: localize routes.
  // Currently, `localePath()` and `NuxtLinkLocale` do not support complex roue objects
  path: '/recibo/:hash',
  alias: [
    '/recibos/:hash',
  ],
});

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { hash } = route.params;

const {
  data: receipt,
  error,
  pending,
} = await useLazyFetch(`${runtimeConfig.public.publicApiBase}/donation/digest/${hash}`);
</script>
<template>
  <div v-if="pending">
    Carregando
  </div>
  <div v-else-if="error">
    Erro ao buscar dados da API - {{ error.message }}
  </div>
  <div v-else class="receipts-page">
    <header>
      <a href="https://blog.doarpara.com.br/">
        <img :src="logo" alt="Logo doarPara">
      </a>

      <div class="receipts-page__candidate-avatar-wrapper">
        <img
          class="receipts-page__candidate-avatar"
          :src="receipt?.donation.candidate.avatar"
          :alt="`fotografia de ${receipt?.donation.candidate.popular_name}`"
        >
      </div>

      <h1>
        Recibo
      </h1>

    <h2
      v-if="receipt?.donation.refunded_at_human"
      class="receipts-page__refunded-at"
    >
      Recibo cancelado
    </h2>

      <h3 class="receipts-page-title">
        Essa doação foi realizada para <strong>{{ receipt?.donation.candidate.popular_name }}</strong>,
        <span v-if="receipt?.donation.candidate.campaign_donation_type === 'pre-campaign'">
          {{ $t('electionCampaign.preRunningForOffice', { gender: receipt?.donation.candidate.gender }) }}
        </span>
        <span v-else>
          {{ $t('electionCampaign.runningForOffice', { gender: receipt?.donation.candidate.gender }) }}
        </span> {{ $t(`governmentOffices.${receipt?.donation.candidate.office.code}`, { gender: receipt?.donation.candidate.gender }) }}
        por
        <span v-if="receipt?.donation.candidate.party">
          {{ receipt?.donation.candidate.party.acronym }} -
          {{ receipt?.donation.candidate.party.name }}.
        </span>
      </h3>
    </header>

    <section>
      <p>
        As doações eleitorais são muito importantes para construção de projetos políticos,
        porém é fundamental que as plataformas de financiamento coletivo, sociedade e o próprio
        TSE tenham garantias de que as informações ofereçam integridade e confiabilidade de maneira
        descentralizada para garantir controle social.
      </p>
      <p>
        Por isso, <span>{{ receipt?.donation.candidate.popular_name }}</span> está registrando
        todas suas doações financeiras para comprovar a integridade e honestidade no seu processo
        de captação de recursos.
      </p>
    </section>
    <section>
      <h2 v-if="receipt?.donation.candidate.campaign_donation_type === 'pre-campaign'">
        {{ $t('electionCampaign.preRunningForName', { gender: receipt?.donation.candidate.gender }) }}
      </h2>
      <h2 v-else>
        {{ $t('electionCampaign.preRunningForName', { gender: receipt?.donation.candidate.gender }) }}
      </h2>

      <dl class="receipt-data">
        <div
          class="receipt-data__item"
          v-if="receipt?.donation.candidate.campaign_donation_type === 'pre-campaign'"
        >
          <dt class="receipt-data__term">{{ $t('electionCampaign.preRunningForName', { gender: receipt?.donation.candidate.gender }) }}</dt>
          <dd class="receipt-data__description">{{ receipt?.donation.candidate.name || '-' }}</dd>
        </div>
        <div
          class="receipt-data__item"
          v-else
        >
          <dt class="receipt-data__term">{{ $t('electionCampaign.preRunningForName', { gender: receipt?.donation.candidate.gender }) }}</dt>
          <dd class="receipt-data__description">
            {{ receipt?.donation.candidate.name || '-' }}
          </dd>
        </div>
        <div
          class="receipt-data__item"
          v-if="receipt?.donation.candidate.cnpj"
        >
          <dt class="receipt-data__term">CNPJ</dt>
          <dd class="receipt-data__description">
            {{ formatCNPJ(receipt?.donation.candidate.cnpj) }}
          </dd>
        </div>
        <div class="receipt-data__item">
          <dt class="receipt-data__term">CPF</dt>
          <dd class="receipt-data__description">
            {{ formatCPF(receipt?.donation.candidate.cpf) || '-' }}
          </dd>
        </div>
        <div class="receipt-data__item">
          <dt class="receipt-data__term">Partido</dt>
          <dd class="receipt-data__description">
            {{ receipt?.donation.candidate.party.acronym || '-' }}
          </dd>
        </div>
        <div
          class="receipt-data__item"
          v-if="receipt?.donation.candidate.office.code"
        >
          <dt class="receipt-data__term">Cargo</dt>
          <dd class="receipt-data__description">
            {{ $t(`governmentOffices.${receipt?.donation.candidate.office.code}`, {
              gender: receipt?.donation.candidate.gender
            }) }}
          </dd>
        </div>
      </dl>
    </section>
    <section>
      <h2>Doação</h2>

      <dl class="receipt-data">
        <div class="receipt-data__item" v-if="receipt?.donation.is_irregular">
          <dt class="receipt-data__term">Irregular / em análise</dt>
          <dd
            class="receipt-data__description signage__text--danger"
          >
            {{ receipt?.donation.irregular_reason || 'Doação irregular' }}
          </dd>
        </div>
        <div class="receipt-data__item">
          <dt class="receipt-data__term">Nome do doador</dt>
          <dd class="receipt-data__description">
            {{ receipt?.donation.donor_name || '-' }}
          </dd>
        </div>
        <div v-if="receipt?.donation.name_receita">
          <dt class="receipt-data__term">Nome na Receita Federal</dt>
          <dd class="receipt-data__description">
            {{ receipt?.donation.name_receita }}
          </dd>
        </div>
        <div class="receipt-data__item">
          <dt class="receipt-data__term">CPF do doador</dt>
          <dd class="receipt-data__description">
            {{ formatCPF(receipt?.donation.donor_cpf) || '-' }}
          </dd>
          </div>
        <div class="receipt-data__item">
          <dt class="receipt-data__term">Data da doação</dt>
          <dd class="receipt-data__description">
            {{ $d(new Date(receipt?.donation.captured_at_human), 'medium') }}
          </dd>
          </div>
        <div class="receipt-data__item">
          <dt class="receipt-data__term">Valor</dt>
          <dd class="receipt-data__description">
            {{ $n(receipt?.donation.amount / 100, 'currency', { maximumFractionDigits: 2 }) || '-' }}
          </dd>
        </div>
        <div class="receipt-data__item">
          <dt class="receipt-data__term">Forma de pagamento</dt>
          <dd class="receipt-data__description">
            {{ receipt?.donation.payment_method_human || '-' }}
          </dd>
        </div>
      </dl>
    </section>
    <section>
      <h2>Entidade arrecadadora</h2>
      <dl class="receipt-data">
        <div class="receipt-data__item">
          <dt class="receipt-data__term">Razão social</dt>
          <dd class="receipt-data__description">AppCivico Consultoria Ltda.</dd>
        </div>
        <div class="receipt-data__item">
          <dt class="receipt-data__term">CNPJ</dt>
          <dd class="receipt-data__description">
            08.746.641/0001-00
          </dd>
        </div>
      </dl>
    </section>
    <section>
      <h2>Informações sobre o registro na blockchain</h2>
      <p>
        Para que sua doação tenha garantias, usamos o Blockchain, uma ferramenta
        que garantirá que todo histórico de doações ficará online e ninguém poderá alterá-lo,
        de maneira descentralizada.
      </p>
      <p v-if="receipt?.donation.decred_transaction_url">
        Comprovante decred:
        <a
          class="blue"
          target="_blank"
          rel="noopener noreferrer"
          style="word-break: break-all"
          :href="receipt?.donation.decred_transaction_url"
        >
          <strong>{{ receipt?.donation.decred_transaction_url }}</strong>
        </a>
      </p>
    </section>
    <footer class="receipts-page__footer">
      <img :src="doarPara" alt="logo">
      <p>
        <strong>DoarPara</strong> é uma plataforma de financiamento coletivo eleitoral
        homologada pelo TSE sob a razão social AppCivico Consultoria LTDA,
        CNPJ: 08.746.641/0001-00. Todas as doações são registradas na blockchain
        da Decred com objetivo de garantir a autenticidade das transações,
        promovendo a confiabilidade no processo de doação eleitoral.
      </p>
      <p>
        © 2016-2024 DoarPara • Uma iniciativa AppCívico - Tecnologias Cívicas •
        <a
          class="receipts-page-blueColor"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.appcivico.com/fale-conosco"
        >
          contato
        </a>
      </p>
    </footer>
  </div>
</template>
<style lang="scss">
@use 'sass:color';

@use '@/assets/scss/abstracts/constants/font-stacks' as fs;

.background-page-receipt {
  background: #ebebeb;
}

.receipts-page {
  position: relative;

  max-width: my.$max-width--receipt;
  padding-top: my.$gutter * 2;
  padding-right: my.$gutter;
  padding-bottom: my.$gutter * 2;
  padding-left: my.$gutter;
  margin: auto;

  background: #ffffff;
  border-radius: 20px 20px 0 0;

  &::after {
    position: absolute;
    right: 0;
    bottom: -31px;
    left: 0;

    display: block;

    width: 100%;
    height: 31px;

    content: '';

    background-image: my.image('receipts/wave.png');
    background-repeat: repeat-x;
  }

  @media screen and (min-width: my.breakpoint('phone__landscape')) {
    padding-right: my.$gutter * 2;
    padding-left: my.$gutter * 2;
  }

  @media screen and (min-width: my.breakpoint('tablet__portrait')) {
    padding-right: my.$gutter * 3;
    padding-left: my.$gutter * 3;
  }
}

.receipts-page__refunded-at {
  position: absolute;
  top: my.$gutter;
  right: my.$gutter;
  z-index: my.layer('default');

  width: max-content;
  padding-top: my.$gutter * 0.5;
  padding-right: 1em;
  padding-bottom: my.$gutter * 0.5;
  padding-left: 1em;

  font-family: fs.$IMPACT-FONT-STACK;
  font-size: ms-step(1);
  color: my.text-contrast(my.palette('neutral', 'white'), my.palette('signage', 'danger'));
  text-align: center;
  text-transform: uppercase;

  pointer-events: none;

  border: 3px dashed currentColor;
  border-radius: 12px;
  opacity: 0.85;

  transform: translateX(25%) translateY(50%) rotate(45deg);
}

.receipt-data {}

.receipt-data__item {
  display: list-item;

  list-style-type: disc;
}

.receipt-data__term {
  display: inline;

  &::after {
    content: ': ';
  }
}

.receipt-data__description {
  display: inline;
}

.receipts-page__candidate-avatar-wrapper {
  position: relative;

  &::before,
  &::after {
    position: absolute;
    top: 50%;

    content: '';

    background-size: contain;

    transform: translateY(-50%);
  }

  &::before {
    left: 0;

    width: 50%;
    max-width: 9.1875rem;
    height: 6.0625rem;
    min-height: 97px;

    background-image: my.image('receipts/left.svg');
    background-position: 100% 50%;
  }

  &::after {
    right: 0;

    width: 50%;
    max-width: 12.5rem;
    height: 6.75rem;
    min-height: 108px;

    background-image: my.image('receipts/right.svg');
    background-position: 0% 50%
  }
}

.receipts-page__candidate-avatar {
  z-index: my.layer('default');

  display: block;

  width: 14rem;
  max-width: 100%;
  aspect-ratio: 1 / 1;
  margin: auto;
  margin-top: my.$gutter;
  margin-right: auto;
  margin-bottom: my.$gutter;
  margin-left: auto;

  object-fit: cover;
  border-radius: 999em;
  box-shadow: 0 60px 24px -36px my.palette('effects', 'shadow'), 0 48px 24px -48px color.adjust(my.palette('brand', 'tertiary'), $alpha: -0.6);

  @include my.themed-declaration ('green') {
    box-shadow: 0 60px 24px -36px my.palette('green-theme', 'effects', 'shadow'), 0 48px 24px -48px color.adjust(my.palette('green-theme', 'brand', 'tertiary'), $alpha: -0.6);
  }

  @include my.themed-declaration ('orange') {
    box-shadow: 0 60px 24px -36px my.palette('orange-theme', 'effects', 'shadow'), 0 48px 24px -48px color.adjust(my.palette('orange-theme', 'brand', 'tertiary'), $alpha: -0.6);
  }

  @include my.themed-declaration ('red') {
    box-shadow: 0 60px 24px -36px my.palette('red-theme', 'effects', 'shadow'), 0 48px 24px -48px color.adjust(my.palette('red-theme', 'brand', 'tertiary'), $alpha: -0.6);
  }

  @media screen and (min-width: my.$max-width--receipt) {
    z-index: auto;
  }
}

.receipts-page footer {}

.receipts-page-blueColor {
  color: #2667ff
}

.receipts-page-title {
  font-weight: normal;
  color: #2667ff;
}

.receipts-page section {
  padding-bottom: my.$gutter;
}

.receipts-page .social {
  flex-direction: row;

  column-gap: my.$gutter;

  padding-top: my.$gutter * 2;
}

.social img {
  padding-bottom: 0;
}

.receipts-page__footer {
  padding-top: my.$gutter * 2;
  margin: 0 auto;

  border-top: 1px solid #ebebeb;
}
</style>
