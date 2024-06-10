<!-- eslint-disable vue/block-lang -->
<script setup>
import doarPara from '../../assets/images/logo-gray.svg';
import logo from '../../assets/images/logo-receipt.svg';
import waves from '../../assets/images/wave.png';

definePageMeta({
  layout: 'receipt',
  name: 'receipt',
  title: 'Doar para',
  // TO-DO: localize routes.
  // Currently, `localePath()` and `NuxtLinkLocale` do not support complex roue objects
  path: '/recibo/:hash',
  alias: [
    '/recibos/:hash',
    '/:campaignSlug/recibos/:hash',
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
  <section v-else class="receipts-page">
    <header>
      <a href="https://blog.doarpara.com.br/">
        <img :src="logo" alt="Logo doarPara">
      </a>

      <img
        class="receipts-page__candidate-avatar"
        :src="receipt?.donation.candidate.avatar"
        :alt="`fotografia de ${receipt?.donation.candidate.popular_name}`"
      >

      <h1 style="color: #313337">
        Recibo
      </h1>
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
    <div>
      <section>
        <h2 v-if="receipt?.donation.candidate.campaign_donation_type === 'pre-campaign'">
          {{ $t('electionCampaign.preRunningForName', { gender: receipt?.donation.candidate.gender }) }}
        </h2>
        <h2 v-else>
          {{ $t('electionCampaign.preRunningForName', { gender: receipt?.donation.candidate.gender }) }}
        </h2>
        <ul class="receipt-donation-list">
          <li v-if="receipt?.donation.candidate.campaign_donation_type === 'pre-campaign'">
            {{ $t('electionCampaign.preRunningForName', { gender: receipt?.donation.candidate.gender }) }}:
            {{ receipt?.donation.candidate.name || '-' }}
          </li>
          <li v-else>
            {{ $t('electionCampaign.preRunningForName', { gender: receipt?.donation.candidate.gender }) }}:
            {{ receipt?.donation.candidate.name || '-' }}
          </li>
          <li v-if="receipt?.donation.candidate.cnpj">
            CNPJ: {{ formatCNPJ(receipt?.donation.candidate.cnpj) }}
          </li>
          <li>CPF: {{ formatCPF(receipt?.donation.candidate.cpf) || '-' }}</li>
          <li>Partido: {{ receipt?.donation.candidate.party.acronym || '-' }}</li>
          <li v-if="receipt?.donation.candidate.office.code">
            Cargo: {{ $t(`governmentOffices.${receipt?.donation.candidate.office.code}`, { gender: receipt?.donation.candidate.gender }) }}
          </li>
        </ul>
      </section>
      <section>
        <h2>Doação</h2>
        <ul class="receipt-donation-list">
          <li>Nome do doador: {{ receipt?.donation.donor_name || '-' }}</li>
          <li v-if="receipt?.donation.name_receita">
            Nome na Receita Federal: {{ receipt?.donation.name_receita }}
          </li>
          <li>CPF do doador: {{ formatCPF(receipt?.donation.donor_cpf) || '-' }}</li>
          <li>Data da doação: {{ $d(new
            Date(receipt?.donation.captured_at_human), 'medium') }}</li>
          <li>Valor:{{ $n(receipt?.donation.amount / 100, 'currency', { maximumFractionDigits: 2 }) || '-' }}</li>
          <li>Forma de pagamento: {{ receipt?.donation.payment_method_human || '-' }}</li>
        </ul>
      </section>
      <section>
        <h2>Entidade arrecadadora</h2>
        <ul class="receipt-donation-list">
          <li>Razão social: AppCivico Consultoria Ltda.</li>
          <li>CNPJ: 08.746.641/0001-00 </li>
        </ul>
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
    </div>
    <footer class="footer">
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
  </section>
  <img v-if="!pending && !error" class="waves-footer" :src="waves" alt="Ondas">
</template>
<style lang="scss">

.background-page-receipt {
  background: #ebebeb;
}

.receipts-page {
  max-width: my.$max-width--dialog;
  padding-top: my.$gutter * 2;
  padding-right: my.$gutter * 3;
  padding-bottom: my.$gutter * 2;
  padding-left: my.$gutter * 3;
  margin: auto;

  background: #ffffff;
  border-radius: 20px 20px 0 0;
}

.receipts-page a {
  text-decoration: none;
}

.receipts-page h2 {
  margin: 0 0 18px;

  font-size: 20px;
  color: #313337;
}

.receipts-page h3 {
  margin: 0 0 18px;

  font-size: 20px;
}

.receipts-page .receipt-donation-list {
  padding-left: 20px;
}

.receipts-page__candidate-avatar {
  display: block;

  width: 200px;
  max-width: 100%;
  margin: auto;
  margin-top: my.$gutter;
    margin-right: auto;
    margin-bottom: my.$gutter;
    margin-left: auto;

  border-radius: 999em;
}

.receipts-page footer {
  padding-top: 40px;

  border-top: 1px solid #ebebeb;
}

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

.footer img {
  padding-bottom: my.$gutter * 2;
  margin: 0;
}

.receipts-page .waves-footer {
  display: block;

  margin: 0 auto;
}
</style>
