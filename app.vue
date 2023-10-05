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
      <section class="intro">
        <div class="container">
          <figure class="intro__cover">
            <img
              alt=""
              class="intro__image"
              width="780"
              height="440"
              srcset="
                /assets/img/Mask%20Group%201.png,
                /assets/img/Mask%20Group%201@2x.png 2x
              "
              src="/assets/img/Mask%20Group%201.png"
            />
            <button
              class="intro__figure-switcher"
              type="button"
              :aria-label="$t('loadVideo')"
            >
              <img
                src="~/assets/images/icon-play.svg"
                alt=""
                width="24"
                height="24"
                aria-hidden="true"
              />
            </button>
          </figure>

          <div class="intro__preamble-and-progress-and-call-to-action">
            <div class="intro__campaign-preamble">
              <p>
                Ajude-nos a criar lavandarias escolares gratuitas para que as
                crianças que vivem em situação de vulnerabilidade, possam ter
                acesso a roupas limpas através do Espuma nas Escolas.
              </p>
            </div>

            <div class="intro__progress-and-call-to-action">
              <campaignProgress class="intro__campaign-progress" />
              <div class="call-to-action-values">
                <div class="call-to-action-values__intro">
                  {{ $t('donateWithoutReward') }}
                </div>

                <span
                  title="Something small enough to escape casual notice."
                  class="tooltip call-to-action-values__campaign-type"
                >
                  Campanha flexível
                </span>

                <!--<details
                  class="tooltip call-to-action-values__campaign-type"
                >
                  <summary aria-describedby="tooltip-campaign-type">
                    Campanha flexível
                  </summary>
                  <div id="tooltip-campaign-type" role="tooltip">
                    Something small enough to escape casual notice.
                  </div>
                </details>-->

                <ul class="donation-values__list">
                  <li class="donation-values__item">
                    <a
                      href="#doar?valor=20"
                      class="donation-values__value like-a__button"
                    >
                      {{ $n(20, 'currency', { maximumFractionDigits: 0 }) }}
                    </a>
                  </li>
                  <li class="donation-values__item">
                    <a
                      href="#doar?valor=50"
                      class="donation-values__value like-a__button"
                    >
                      {{ $n(50, 'currency', { maximumFractionDigits: 0 }) }}
                    </a>
                  </li>
                  <li class="donation-values__item">
                    <a
                      href="#doar?valor=100"
                      class="donation-values__value like-a__button"
                    >
                      {{ $n(100, 'currency', { maximumFractionDigits: 0 }) }}
                    </a>
                  </li>
                  <!-- lala -->

                  <li class="donation-values__item">
                    <a
                      href="#doar?valor=200"
                      class="donation-values__value like-a__button"
                    >
                      {{ $n(200, 'currency', { maximumFractionDigits: 0 }) }}
                    </a>
                  </li>
                  <li class="donation-values__item">
                    <a
                      href="#doar?valor=500"
                      class="donation-values__value like-a__button"
                    >
                      {{ $n(500, 'currency', { maximumFractionDigits: 0 }) }}
                    </a>
                  </li>
                  <li class="donation-values__item">
                    <a
                      href="#doar?valor=1064"
                      class="donation-values__value like-a__button"
                    >
                      {{ $n(1064, 'currency', { maximumFractionDigits: 0 }) }}
                    </a>
                  </li>

                  <!-- lala -->
                  <li class="donation-values__item">
                    <a
                      href="#doar-outro-valor"
                      class="donation-values__value like-a__button"
                    >
                      Outro valor
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="text-body">
        <div class="container">
          <nav role="tablist" aria-label="Seções dessa campanha">
            <a href="#campanha" aria-controls="campanha" role="tab">
              {{ $t('nav.campaign') }}
            </a>
            <a href="#transparencia" aria-controls="transparencia" role="tab">
              {{ $t('nav.transparency') }}
            </a>
            <a href="#testemunhos" aria-controls="testemunhos" role="tab">
              {{ $t('nav.testimony', 0) }}
            </a>
            <a href="#faq" aria-controls="testemunhos" role="tab">
              <abbr title="Perguntas Frequentes">FAQ</abbr>
            </a>
          </nav>
          <section aria-live="polite" role="region">
            <article id="campanha" role="tabpanel">
              <h2>
                Vamos falar sobre crianças vulneráveis e como VOCÊ pode ajudar
                crianças em idade escolar presas nela...
              </h2>

              <p>
                Imagine não poder pagar o básico para se manter limpo; isso é
                pobreza higiénica e tem um efeito doloroso nos nossos filhos. Na
                verdade, 66% dos professores afirmam ter testemunhado o bullying
                de uma criança devido ao fraco acesso à higiene. Como somos uma
                marca de produtos de limpeza, sabíamos que poderíamos fazer algo
                para ajudar… então iniciamos o Projeto Espuma nas Escolas.
              </p>

              <p>
                A idéia é criar mini-lavandarias gratuitas nas escolas de todo o
                Brasil, fornecendo uma máquina de lavar/secar roupa e todo o
                detergente necessário para garantir que nenhuma criança sob os
                seus cuidados sofra a vergonha, o bullying e a exclusão de não
                ter roupas e uniformes limpos. Todos merecem sentir-se limpos. A
                pobreza higiénica afecta mais de 3 milhões de nós aqui no
                Brasil, mas passa despercebida porque existe um estigma em não
                conseguirmos manter-nos limpos e, como nação, simplesmente não
                discutimos isso.
              </p>

              <p>
                Tudo isto resulta num impacto extremamente negativo na saúde
                mental das crianças – mais de 72% sofrem de baixa auto-estima,
                questionam por que não podem convidar os amigos e o seu
                desempenho escolar é prejudicado. Oito em cada dez professores
                do ensino primário afirmam ter testemunhado um aumento no número
                de crianças que frequentam a escola sem lavar ou usar uniformes
                sujos nos últimos 5 anos e têm intervindo a um ritmo crescente
                (um terço dos professores compra regularmente produtos de
                higiene essenciais para os seus alunos).
              </p>

              <h2>Ações que pretendemos colocar em prática</h2>
              <p>
                A idéia é criar mini-lavandarias gratuitas nas escolas de todo o
                Brasil, fornecendo uma máquina de lavar/secar roupa e todo o
                detergente necessário para garantir que nenhuma criança sob os
                seus cuidados sofra a vergonha, o bullying e a exclusão de não
                ter roupas e uniformes limpos. Todos merecem sentir-se limpos. A
                pobreza higiénica afecta mais de 3 milhões de nós aqui no
                Brasil, mas passa despercebida porque existe um estigma em não
                conseguirmos manter-nos limpos e, como nação, simplesmente não
                discutimos isso.
              </p>

              <p>
                Tudo isto resulta num impacto extremamente negativo na saúde
                mental das crianças – mais de 72% sofrem de baixa auto-estima,
                questionam por que não podem convidar os amigos e o seu
                desempenho escolar é prejudicado. Oito em cada dez professores
                do ensino primário afirmam testemunhado um aumento no número de
                crianças que frequentam a escola sem lavar ou usar uniformes
                sujos nos últimos 5 anos e têm intervindo a um ritmo crescente
                (um terço dos professores compra regularmente produtos de
                higiene essenciais para os seus alunos).
              </p>

              <p>
                Imagine não poder pagar o básico para se manter limpo; isso é
                pobreza higiénica e tem um efeito doloroso nos nossos filhos. Na
                verdade, 66% dos professores afirmam ter testemunhado o bullying
                de uma criança devido ao fraco acesso à higiene. Como somos uma
                marca de produtos de limpeza, sabíamos que poderíamos fazer algo
                para ajudar… então iniciamos o Projeto Espuma nas Escolas.
              </p>
            </article>
            <article id="transparencia" role="tabpanel">
              <p>If you click this tab then your life will be better</p>
            </article>
            <article id="testemunhos" role="tabpanel">
              <p>Know your roles</p>
            </article>
            <article id="faq" role="tabpanel">
              <p>Know your roles</p>
            </article>

            <footer class="call-to-faq">
              <p>
                Dúvidas sobre esse projeto?
                <a href="#faq">Confira as respostas às perguntas Frequentes</a>
              </p>
            </footer>
          </section>

          <section class="rewards">
            <h2>Recompensas</h2>
            <p>
              Este projeto oferece recompensas em troca do seu apoio. Selecione
              uma recompensa abaixo.
            </p>
            <dl class="rewards__list">
              <div class="rewards__item">
                <dd class="rewards__value">
                  {{ $t('minimumRewardOrMore', 10) }}
                </dd>
                <dt class="rewards__title">Kit de brindes Espuma</dt>
                <dd class="rewards__picture">
                  <img src="" alt="" width="300" height="150" />
                </dd>
                <dd class="rewards__description">
                  <p>
                    Como agradecimento pela sua incrível doação, você receberá
                    um kit de brindes Espuma para guardar ou presentear um amigo
                    ou familiar. Além disso, você...
                  </p>

                  <p class="rewards__call-to-action-wrapper">
                    <a
                      href="#doar?recompensa=123"
                      class="rewards__call-to-action"
                    >
                      {{ $t('chooseThisReward') }}
                    </a>
                  </p>
                </dd>
                <dd class="rewards__donors">{{ $t('nSupporters', 215) }}</dd>
              </div>

              <div class="rewards__item">
                <dd class="rewards__value">
                  {{ $t('minimumRewardOrMore', 60) }}
                </dd>
                <dt class="rewards__title">Kit banho + guloseimas</dt>
                <dd class="rewards__picture">
                  <img src="" alt="" width="300" height="150" />
                </dd>
                <dd class="rewards__description">
                  <p>
                    Muito obrigado! Pela sua doação, você será incluído em nosso
                    muro da fama de Espuma em nosso site, ganhe um pano de prato
                    edição limitada e uma...
                  </p>

                  <p class="rewards__call-to-action-wrapper">
                    <a
                      href="#doar?recompensa=123"
                      class="rewards__call-to-action"
                    >
                      {{ $t('chooseThisReward') }}
                    </a>
                  </p>
                </dd>
                <dd class="rewards__donors">{{ $t('nSupporters', 48) }}</dd>
              </div>

              <div class="rewards__item">
                <dd class="rewards__value">
                  {{ $t('minimumRewardOrMore', 110) }}
                </dd>
                <dt class="rewards__title">Toalha de banho bordada</dt>
                <dd class="rewards__picture">
                  <img src="" alt="" width="300" height="150" />
                </dd>
                <dd class="rewards__description">
                  <p>
                    UAU, obrigado! Você receberá uma toalha de banho impressa
                    com a marca da campanha (edição limitada) com sua doação,
                    além de se tornar...
                  </p>

                  <p class="rewards__call-to-action-wrapper">
                    <a
                      href="#doar?recompensa=123"
                      class="rewards__call-to-action"
                    >
                      {{ $t('chooseThisReward') }}
                    </a>
                  </p>
                </dd>
                <dd class="rewards__donors">{{ $t('nSupporters', 48) }}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </article>

    <footer class="main-footer">
      <div class="container">
        <nav
          class="footer-nav"
          aria-label="Menu da campanha, termos de uso e política de privacidade"
        >
          <ul class="footer-nav__list">
            <li class="footer-nav__item">
              <a href="#campanha">{{ $t('nav.campaign') }}</a>
            </li>
            <li class="footer-nav__item">
              <a href="#transparência">{{ $t('nav.transparency') }}</a>
            </li>
            <li class="footer-nav__item">
              <a href="#testemunhos">{{ $t('nav.testimony', 0) }}</a>
            </li>
            <li class="footer-nav__item">
              <a href="#faq">{{ $t('nav.faq') }}</a>
            </li>
            <li class="footer-nav__item">
              <a href="/termos-de-uso">{{ $t('useTerms') }}</a>
            </li>
            <li class="footer-nav__item">
              <a href="/politica-de-privacidade">{{ $t('privacyPolicy') }}</a>
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
      <div class="container">
        <div class="juridical-person-identification">
          {{ $t('credits.juridicalPersonLabel') }}: Comunidade Solidária Ltda.
          {{ $t('juridicalPersonIdentification') }}: 08.746.641/0001-00
        </div>
      </div>
    </footer>
  </div>
</template>
