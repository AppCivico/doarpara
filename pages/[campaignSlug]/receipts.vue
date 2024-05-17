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
  path: '/:campaignSlug/recibos/:hash',
});

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { hash } = route.params;

const {
  data: donation,
  error,
  pending,
} = await useLazyFetch(`${runtimeConfig.public.publicApiBase}/donation/digest/${hash}`);

const candidateDocument = (documento) => {
  if (!documento) {
    return '';
  }
  // eslint-disable-next-line no-param-reassign
  documento = documento.replace(/\D/g, '');
  if (documento.length === 11) {
    return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } if (documento.length === 14) {
    return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return documento;
};

const dateHour = (data) => {
  if (!data) {
    return '';
  }
  const dataObj = new Date(data);
  return dataObj.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};
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
      <nav>
        <a href="doarpara.com.br">
          <img :src="logo" alt="Logo doarPara">
        </a>
        <img :src="donation?.donation.candidate.avatar" alt="Pré candidato">
      </nav>
    </header>
    <div>
      <h1 style="color: #313337">
        Recibo
      </h1>
      <h3 class="blue">
        <!-- eslint-disable-next-line vue/max-len -->
        Essa doação foi realizada para <strong>{{ donation?.donation.donor_name }}</strong>, pré-candidato(a)
        a Prefeito, por <span>{{ donation?.donation.candidate.party.acronym }}</span>.
      </h3>
      <p>
        As doações eleitorais são muito importantes para construção de projetos políticos,
        porém é fundamental que as plataformas de financiamento coletivo, sociedade e o próprio
        TSE tenham garantias de que as informações ofereçam integridade e confiabilidade de maneira
        descentralizada para garantir controle social.
      </p>
      <p>
        Por isso, <span>{{ donation?.donation.donor_name }}</span> está registrando
        todas suas doações financeiras para comprovar a integridade e honestidade no seu processo
        de captação de recursos.
      </p>
    </div>
    <div>
      <h2>
        <strong>informações de doação</strong>
      </h2>
      <div>
        <ul class="receipt-donation-list">
          <li>Pré-candidato(a): {{ donation?.donation.candidate.popular_name || '-' }}</li>
          <!-- <li>CNPJ: {{ candidateDocument(donation?.donation.candidate.cnpj) || '-'}}</li> -->
          <li>CPF: {{ candidateDocument(donation?.donation.candidate.cpf) || '-'}}</li>
          <li>Partido: {{ donation?.donation.candidate.party.acronym || '-'}}</li>
          <li>Cargo: {{ donation?.donation.candidate.office.name || '-' }}</li>
          <li>Nome do doador: {{ donation?.donation.donor_name || '-'}}</li>
          <li>Nome na Receita Federal: {{ donation?.donation.name_receita || '-' }}</li>
          <li>CPF do doador: {{ candidateDocument(donation?.donation.donor_cpf) || '-' }}</li>
          <li>Data da doação: {{ dateHour(donation?.donation.captured_at_human) }}</li>
          <li>Valor:{{ $n(donation?.donation.amount / 100, 'currency', { maximumFractionDigits: 2 }) || '-'}}</li>
          <li>Forma de pagamento: {{ donation?.donation.payment_method_human || '-' }}</li>
        </ul>
      </div>
      <div>
        <h2>
          <strong>Informações sobre o registro na blockchain</strong>
        </h2>
        <p>
          Para que sua doação tenha garantias, usamos o Blockchain, uma ferramenta
          que garantirá que todo histórico de doações ficará online e ninguém poderá alterá-lo,
          de maneira descentralizada.
        </p>
        <p>
          Comprovante decred:
          <a
            class="blue"
            target="_blank"
            rel="noopener noreferrer"
            style="word-break: break-all"
            :href="donation?.donation.decred_transaction_url"
          >
            <strong>{{ donation?.donation.decred_transaction_url || '-' }}</strong>
          </a>
        </p>
      </div>
      <div>
        <h2>
          <strong>Informações sobre o código utilizado para essa doação</strong>
        </h2>
        <p>
          Para transparência eleitoral, além dos dados de doação, também é fundamental que
          a tecnologia utilizado para processar essa doação seja aberto. Por isso,
          nosso código fonte é aberto e também registramos a versão utilizada por nossos
          servidores junto com os dados de doação na blockchain.
        </p>
        <p>
          Versão do site:
          <a
            class="blue"
            target="_blank"
            rel="noopener noreferrer"
            :href="donation?.donation.git_url"
          >
            <strong>{{ donation?.donation.git_url || '-' }}</strong>
          </a>
        </p>
      </div>
    </div>
    <footer class="footer">
      <img :src="doarPara" alt="logo">
      <p>
        <strong>DoarPara</strong> é uma plataforma de software livre homologada
        pelo TSE e opera sob o CNPJ "30.217.474/0001-50", razão social "Pague Junto -
        Tecnologia de Intermediação LTDA". Todas as doações são registradas na blockchain
        da Decred com objetivo de garantir a autenticidade das transações, promovendo a
        confiabilidade no processo de doação eleitoral.
      </p>
      <p>
        © 2016-2024 DoarPara • Uma iniciativa AppCívico - Tecnologias Cívicas •
        <a
          class="blue"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.appcivico.com/fale-conosco">
          contato
        </a>
      </p>
    </footer>
  </section>
  <img v-if="!pending" class="waves" :src="waves" alt="Ondas">
</template>

<style>
.background-page-receipt {
  background: #EBEBEB ;
}

.receipts-page a{
  text-decoration: none;
}

.receipts-page h2, h3 {
  margin: 0 0 18px;
  font-size: 20px;
  color: #313337;
  font-weight: normal;
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
  padding: 25px 0 40px;
  margin: auto;
}

.receipts-page footer {
  padding-top: 70px;
  border-top: 1px solid #ebebeb;
}

.receipts-page .blue {
  color: #2667ff
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

.receipts-page .waves {
  display: block;
  margin: 0 auto;
}
</style>
