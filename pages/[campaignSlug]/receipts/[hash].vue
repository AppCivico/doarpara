<!-- eslint-disable vue/block-lang -->
<script setup>
import { useReciboStore } from '@/store/receipt.js';
import { storeToRefs } from 'pinia';
import facebook from '../../assets/images/icon-facebook.svg';
import instagram from '../../assets/images/icon-instagram.svg';
import linkedin from '../../assets/images/icon-linkedin.svg';
import twitter from '../../assets/images/icon-twitter.svg';
import doarPara from '../../assets/images/logo-gray.svg';
import logo from '../../assets/images/logo-receipt.svg';
import ondas from '../../assets/images/wave.png';

const runtimeConfig = useRuntimeConfig();

definePageMeta({
  layout: 'receipt',
  name: 'receipt',
  title: 'Doar para',
  path: `/:campaignSlug/${process.env.CUSTOM_SEGMENTS_RECEIPTS || 'receipts'}/:hash`,
});

const route = useRoute();

const reciboStore = useReciboStore();
const { responseData: lista } = storeToRefs(reciboStore);

reciboStore.fetchData(route.params.campaignSlug, route.params.hash);
</script>

<template>
  <section class="recibo">
    <header>
      <nav>
        <a href="doarpara.com.br">
          <img :src="logo" alt="Logo doarPara">
        </a>
        <img :src="lista?.donation.candidate.avatar" alt="Pré candidato">
      </nav>
    </header>
    <div>
      <h1 style="color: #313337">
        Recibo
      </h1>
      <h3 class="blue">
        Essa doação foi realizada para {{ lista?.donation.donor_name }},
        pré-candidato(a) a Prefeito, por <span>{{ lista?.donation.candidate.party.acronym }}</span>.
      </h3>
      <p>
        As doações eleitorais são muito importantes para construção de projetos políticos,
        porém é fundamental que as plataformas de financiamento coletivo, sociedade e o próprio
        TSE tenham garantias de que as informações ofereçam integridade e confiabilidade de maneira
        descentralizada para garantir controle social.
        Por isso, {{ lista?.donation.donor_name }} está registrando todas suas doações
        financeiras para comprovar a integridade e honestidade no seu processo
        de captação de recursos.
      </p>
    </div>
    <div>
      <h2>informações de doação</h2>
      <div>
        <ul>
          <li>Pré-candidato(a): {{ lista?.donation.candidate.popular_name }}</li>
          <li>CNPJ: {{ lista?.donation.candidate.cnpj }}</li>
          <li>CPF: {{ lista?.donation.candidate.cpf }}</li>
          <li>Partido: {{ lista?.donation.candidate.party.acronym }}</li>
          <li>Cargo: {{ lista?.donation.candidate.office.name }}</li>
          <li>Nome do doador: {{ lista?.donation.donor_name }}</li>
          <li>Nome na Receita Federal: {{ lista?.donation.name_receita }}</li>
          <li>CPF do doador: {{ lista?.donation.donor_cpf }}</li>
          <li>Data: {{ lista?.donation.captured_at_human }}</li>
          <li>Valor: {{ lista?.donation.amount }}</li>
          <li>Forma de pagamento: {{ lista?.donation.payment_method_human }}</li>
        </ul>
      </div>
      <div>
        <h2>Informações sobre o registro na blockchain</h2>
        <p>
          Para que sua doação tenha garantias, usamos o Blockchain, uma ferramenta
          que garantirá que todo histórico de doações ficará online e ninguém poderá alterá-lo,
          de maneira descentralizada.
        </p>
        <p>
          Comprovante decred:
          <a class="blue" style="word-break: break-all" :href="lista?.donation.decred_transaction_url">
            {{ lista?.donation.decred_transaction_url }}
          </a>
        </p>
      </div>
      <div>
        <h2>Informações sobre o código utilizado para essa doação</h2>
        <p>
          Para transparência eleitoral, além dos dados de doação, também é fundamental que
          a tecnologia utilizado para processar essa doação seja aberto. Por isso,
          nosso código fonte é aberto e também registramos a versão utilizada por nossos
          servidores junto com os dados de doação na blockchain.
        </p>
        <p>
          Versão do site:
          <a class="blue" :href="lista?.donation.git_url">
            {{ lista?.donation.git_url }}
          </a>
        </p>
      </div>
      <h2>Compartilhe</h2>
      <p>
        Faça parte desse movimento contra a corrupção eleitoral e fortaleça a nossa rede.
      </p>
      <div>
        <nav class="social">
          <a href=""><img :src="linkedin" alt="linkedin"></a>
          <a href=""><img :src="twitter" alt="twitter"></a>
          <a href=""><img :src="instagram" alt="instagram"></a>
          <a href=""><img :src="facebook" alt="facebook"></a>
        </nav>
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
        <a class="blue" href="">contato</a>
      </p>
    </footer>
  </section>
  <img class="ondas" :src="ondas" alt="Ondas">
</template>

<style scoped>
body {
  padding: 60px 0 108px;

  font-family: Outfit, sans-serif;

  background-color: #ebebeb;
}

h1,
h2,
h3,
p,
ul {
  color: #58616a;

  opacity: 1;
}

h2,
h3 {
  margin: 0 0 18px;

  font-size: 20px;
  font-weight: 600;
  color: #313337;
}

ul {
  padding-left: 20px;
}

nav {
  display: flex;

  flex-direction: column;

  align-items: flex-start;
}

nav > img {
  padding: 25px 0 40px;
  margin: auto;
}

footer {
  padding-top: 70px;

  border-top: 1px solid #ebebeb;
}

.blue {
  font-weight: 600;
  color: #2667ff
}

.recibo {
  max-width: 600px;
  padding: 50px 60px;
  margin: auto;

  background: #ffffff;
  border-radius: 20px 20px 0 0;
}

.recibo div {
  padding-bottom: 30px;
}

.social {
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

.ondas {
  display: block;

  margin: 0 auto;
}
</style>
