<!-- eslint-disable vue/block-lang -->
<script setup>
// import { useCampaignStore } from '@/store/campaign.ts';
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
// const campaignStore = useCampaignStore();
// const {campaign} = storeToRefs(campaignStore);

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { hash } = route.params;

const {
  data: donation,
  error,
  pending,
} = await useLazyFetch(`${runtimeConfig.public.publicApiBase}/donation/digest/${hash}`);

// if (donation?.donation.candidate.id) {
//   await useAsyncData('campaign', async () => campaignStore.fetchCampaignAndRewards(
//     String(donation?.donation.candidate.id),
//   ).then(() => true));
// }
</script>

<template>
  <!-- <pre>{{donation?.donation.candidate.id}}</pre> -->
  <div v-if="pending">
    Carregando
  </div>
  <div v-else-if="error">
    Erro ao buscar dados da API - {{ error.message }}
  </div>
  <section v-else class="receipts-page">
    <header>
      <nav>
        <a href="https://blog.doarpara.com.br/">
          <img :src="logo" alt="Logo doarPara">
        </a>
        <img :src="donation?.donation.candidate.avatar" alt="Pré candidato">
      </nav>
    </header>
    <div>
      <h1 style="color: #313337">
        Recibo
      </h1>
      <h3 class="receipts-page-title">
        Essa doação foi realizada para
        <strong>{{ donation?.donation.candidate.popular_name }}</strong>,
        pré-candidata(o) a Prefeito, por
        <span v-if="donation?.donation.candidate.party">
          {{ donation?.donation.candidate.party.acronym }} -
          {{ donation?.donation.candidate.party.name }}.
        </span>
      </h3>
      <p>
        As doações eleitorais são muito importantes para construção de projetos políticos,
        porém é fundamental que as plataformas de financiamento coletivo, sociedade e o próprio
        TSE tenham garantias de que as informações ofereçam integridade e confiabilidade de maneira
        descentralizada para garantir controle social.
      </p>
      <p>
        Por isso, <span>{{ donation?.donation.candidate.popular_name }}</span> está registrando
        todas suas doações financeiras para comprovar a integridade e honestidade no seu processo
        de captação de recursos.
      </p>
    </div>
    <div>
      <div>
        <h2>Pré-candidata(o)</h2>
        <ul class="receipt-donation-list">
          <li>Pré-candidato(a): {{ donation?.donation.candidate.name || '-' }}</li>
          <li v-if="donation?.donation.candidate.cnpj">
            CNPJ: {{ formatCNPJ(donation?.donation.candidate.cnpj) }}
          </li>
          <li>CPF: {{ formatCPF(donation?.donation.candidate.cpf) || '-' }}</li>
          <li>Partido: {{ donation?.donation.candidate.party.acronym || '-' }}</li>
          <li v-if="donation?.donation.candidate.office.name">
            Cargo: {{ donation?.donation.candidate.office.name }}
          </li>
        </ul>
      </div>
      <div>
        <h2>Doação</h2>
        <ul class="receipt-donation-list">
          <li>Nome do doador: {{ donation?.donation.donor_name || '-' }}</li>
          <li v-if="donation?.donation.name_receita">
            Nome na Receita Federal: {{ donation?.donation.name_receita }}
          </li>
          <li>CPF do doador: {{ formatCPF(donation?.donation.donor_cpf) || '-' }}</li>
          <li>Data da doação: {{ $d(new Date(donation?.donation.captured_at_human), 'medium')}}</li>
          <li>Valor:{{ $n(donation?.donation.amount / 100, 'currency', { maximumFractionDigits: 2 }) || '-' }}</li>
          <li>Forma de pagamento: {{ donation?.donation.payment_method_human || '-' }}</li>
        </ul>
      </div>
      <div>
        <h2>Entidade arrecadadora</h2>
        <ul class="receipt-donation-list">
          <li>Razão social: AppCivico Consultoria Ltda.</li>
          <li>CNPJ: 08.746.641/0001-00 </li>
        </ul>
      </div>
      <div>
        <h2>Informações sobre o registro na blockchain</h2>
        <p>
          Para que sua doação tenha garantias, usamos o Blockchain, uma ferramenta
          que garantirá que todo histórico de doações ficará online e ninguém poderá alterá-lo,
          de maneira descentralizada.
        </p>
        <p v-if="donation?.donation.decred_transaction_url">
          Comprovante decred:
          <a
            class="blue"
            target="_blank"
            rel="noopener noreferrer"
            style="word-break: break-all"
            :href="donation?.donation.decred_transaction_url"
          >
            <strong>{{ donation?.donation.decred_transaction_url }}</strong>
          </a>
        </p>
      </div>
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

<style>
.background-page-receipt {
  background: #ebebeb;
}

.receipts-page a {
  text-decoration: none;
}

.receipts-page h2{
  margin: 0 0 18px;

  font-size: 20px;
  color: #313337;
}

.receipts-page h3{
  margin: 0 0 18px;

  font-size: 20px;
}

.receipts-page .receipt-donation-list {
  padding-left: 20px;
}

.receipts-page nav {
  display: flex;

  flex-direction: column;

  align-items: flex-start;
}

.receipts-page nav > img {
  max-width: 200px;
  padding: 25px 0 40px;
  margin: auto;

  border-radius: 100%;
}

.receipts-page footer {
  padding-top: 40px;

  border-top: 1px solid #ebebeb;
}

.receipts-page-blueColor {
  color: #2667ff
}

.receipts-page-title{
  color: #2667ff;
  font-weight: normal;
}

.receipts-page {
  max-width: 619px;
  padding: 50px 60px;
  margin: auto;

  background: #ffffff;
  border-radius: 20px 20px 0 0;
}

.receipts-page div {
  padding-bottom: 30px;
}

.receipts-page .social {
  flex-direction: row;

  column-gap: 30px;

  padding-top: 40px;
}

.social img {
  padding-bottom: 0;
}

.footer img {
  padding-bottom: 40px;
  margin: 0;
}

.receipts-page .waves-footer {
  display: block;

  margin: 0 auto;
}
</style>
