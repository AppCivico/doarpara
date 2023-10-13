<template>
  <!-- required by NUXT page transitions -->
  <div class="page-wrapper">
    <header class="main-header">
      <div class="container">
        <div class="title-and-colophon">
          <h1 class="campaign-title">Projeto Espuma nas Escolas</h1>

          <div class="colophon">
            <img
              class="colophon__creator-avatar"
              width="40"
              height="40"
              src="/assets/img/logo-placeholder.svg"
              alt=""
            />

            <div class="colophon__campaign">
              <div class="colophon__campaign-creator">
                {{ $t('campaignBy') }}
                <a href="/arrecadadoras/XYZ">Comunidade Solidária</a>
              </div>

              <div class="colophon__campaign-location">
                <span class="colophon__campaign-location-city">Curitiba</span>
                <abbr class="colophon__campaign-location-state" title="Paraná">
                  PR
                </abbr>
              </div>
            </div>

            <a href="/XYZ/links" class="links-central">Central de links</a>
          </div>
        </div>

        <socialNetworks />
      </div>
    </header>

    <article role="main">
      <campaignIntro />
      <div class="text-body">
        <div class="container text-body__container">
          <nav
            role="tablist"
            class="tab-navigation text-body__tab-navigation"
            aria-label="Seções dessa campanha"
          >
            <ul class="tab-navigation__list">
              <li class="tab-navigation__item">
                <a
                  class="tab-navigation__link"
                  href="#campanha"
                  aria-controls="campanha"
                  role="tab"
                >
                  {{ $t('nav.campaign') }}
                </a>
              </li>
              <li class="tab-navigation__item">
                <a
                  class="tab-navigation__link"
                  href="#transparencia"
                  aria-controls="transparencia"
                  role="tab"
                >
                  {{ $t('nav.transparency') }}
                </a>
              </li>
              <li class="tab-navigation__item">
                <a
                  class="tab-navigation__link"
                  href="#testemunhos"
                  aria-controls="testemunhos"
                  role="tab"
                >
                  {{ $t('nav.testimony', 0) }}
                </a>
              </li>
              <li class="tab-navigation__item">
                <a
                  class="tab-navigation__link"
                  href="#faq"
                  aria-controls="testemunhos"
                  role="tab"
                >
                  <abbr title="Perguntas Frequentes">FAQ</abbr>
                </a>
              </li>
            </ul>
          </nav>

          <div class="text-body__tabs-and-rewards">
            <section
              aria-live="polite"
              role="region"
              class="tab-list text-body__tab-list"
            >
              <article id="campanha" role="tabpanel" class="tab-list__item">
                <h2>
                  Vamos falar sobre crianças vulneráveis e como VOCÊ pode ajudar
                  crianças em idade escolar presas nela...
                </h2>

                <p>
                  Imagine não poder pagar o básico para se manter limpo; isso é
                  pobreza higiénica e tem um efeito doloroso nos nossos filhos.
                  Na verdade, 66% dos professores afirmam ter testemunhado o
                  bullying de uma criança devido ao fraco acesso à higiene. Como
                  somos uma marca de produtos de limpeza, sabíamos que
                  poderíamos fazer algo para ajudar… então iniciamos o Projeto
                  Espuma nas Escolas.
                </p>

                <p>
                  A idéia é criar mini-lavandarias gratuitas nas escolas de todo
                  o Brasil, fornecendo uma máquina de lavar/secar roupa e todo o
                  detergente necessário para garantir que nenhuma criança sob os
                  seus cuidados sofra a vergonha, o bullying e a exclusão de não
                  ter roupas e uniformes limpos. Todos merecem sentir-se limpos.
                  A pobreza higiénica afecta mais de 3 milhões de nós aqui no
                  Brasil, mas passa despercebida porque existe um estigma em não
                  conseguirmos manter-nos limpos e, como nação, simplesmente não
                  discutimos isso.
                </p>

                <p>
                  Tudo isto resulta num impacto extremamente negativo na saúde
                  mental das crianças – mais de 72% sofrem de baixa auto-estima,
                  questionam por que não podem convidar os amigos e o seu
                  desempenho escolar é prejudicado. Oito em cada dez professores
                  do ensino primário afirmam ter testemunhado um aumento no
                  número de crianças que frequentam a escola sem lavar ou usar
                  uniformes sujos nos últimos 5 anos e têm intervindo a um ritmo
                  crescente (um terço dos professores compra regularmente
                  produtos de higiene essenciais para os seus alunos).
                </p>

                <h2>Ações que pretendemos colocar em prática</h2>
                <p>
                  A idéia é criar mini-lavandarias gratuitas nas escolas de todo
                  o Brasil, fornecendo uma máquina de lavar/secar roupa e todo o
                  detergente necessário para garantir que nenhuma criança sob os
                  seus cuidados sofra a vergonha, o bullying e a exclusão de não
                  ter roupas e uniformes limpos. Todos merecem sentir-se limpos.
                  A pobreza higiénica afecta mais de 3 milhões de nós aqui no
                  Brasil, mas passa despercebida porque existe um estigma em não
                  conseguirmos manter-nos limpos e, como nação, simplesmente não
                  discutimos isso.
                </p>

                <p>
                  Tudo isto resulta num impacto extremamente negativo na saúde
                  mental das crianças – mais de 72% sofrem de baixa auto-estima,
                  questionam por que não podem convidar os amigos e o seu
                  desempenho escolar é prejudicado. Oito em cada dez professores
                  do ensino primário afirmam testemunhado um aumento no número
                  de crianças que frequentam a escola sem lavar ou usar
                  uniformes sujos nos últimos 5 anos e têm intervindo a um ritmo
                  crescente (um terço dos professores compra regularmente
                  produtos de higiene essenciais para os seus alunos).
                </p>

                <p>
                  Imagine não poder pagar o básico para se manter limpo; isso é
                  pobreza higiénica e tem um efeito doloroso nos nossos filhos.
                  Na verdade, 66% dos professores afirmam ter testemunhado o
                  bullying de uma criança devido ao fraco acesso à higiene. Como
                  somos uma marca de produtos de limpeza, sabíamos que
                  poderíamos fazer algo para ajudar… então iniciamos o Projeto
                  Espuma nas Escolas.
                </p>
              </article>
              <article
                id="transparencia"
                role="tabpanel"
                class="tab-list__item"
              >
                <p>If you click this tab then your life will be better</p>
              </article>
              <article id="testemunhos" role="tabpanel" class="tab-list__item">
                <p>Know your roles</p>
              </article>
              <article id="faq" role="tabpanel" class="tab-list__item">
                <p>Know your roles</p>
              </article>

              <footer class="text-body__call-to-faq">
                <p>
                  Dúvidas sobre esse projeto?
                  <a href="#faq"
                    >Confira as respostas às perguntas Frequentes</a
                  >
                </p>
              </footer>
            </section>

            <section class="rewards text-body__rewards">
              <h2>Recompensas</h2>
              <p>
                Este projeto oferece recompensas em troca do seu apoio.
                Selecione uma recompensa abaixo.
              </p>
              <rewardsList :rewards="rewards" />
            </section>
          </div>
        </div>
      </div>
    </article>

    <footer class="main-footer">
      <div class="container main-footer__navigation-social-and-credits">
        <nav
          class="footer-nav"
          aria-label="Menu da campanha, termos de uso e política de privacidade"
        >
          <ul class="footer-nav__list">
            <li class="footer-nav__item">
              <a class="footer-nav__link" href="#campanha">
                {{ $t('nav.campaign') }}
              </a>
            </li>
            <li class="footer-nav__item">
              <a class="footer-nav__link" href="#transparência">
                {{ $t('nav.transparency') }}
              </a>
            </li>
            <li class="footer-nav__item">
              <a class="footer-nav__link" href="#testemunhos">
                {{ $t('nav.testimony', 0) }}
              </a>
            </li>
            <li class="footer-nav__item">
              <a class="footer-nav__link" href="#faq">
                {{ $t('nav.faq') }}
              </a>
            </li>
            <li class="footer-nav__item">
              <a class="footer-nav__link" href="/termos-de-uso">
                {{ $t('useTerms') }}
              </a>
            </li>
            <li class="footer-nav__item">
              <a class="footer-nav__link" href="/politica-de-privacidade">
                {{ $t('privacyPolicy') }}
              </a>
            </li>
          </ul>
        </nav>

        <socialNetworks />

        <div class="powered-by">
          {{ $t('credits.poweredBy') }}
          <img
            title="DoarPara"
            alt=""
            width="180"
            height="43"
            src="~/assets/images/logo-doarpara-rodape.svg"
          />
        </div>
      </div>
      <div class="container main-footer__juridical-data">
        <div class="juridical-person-identification">
          {{ $t('credits.juridicalPersonLabel') }}: Comunidade Solidária Ltda.
          {{ $t('juridicalPersonIdentification') }}: 08.746.641/0001-00
        </div>
      </div>
    </footer>
  </div>
</template>
<script setup>
import rewards from '@/mocks/rewards.js';
</script>
