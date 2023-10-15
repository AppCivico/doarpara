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
              <li
                v-for="tab in tabs"
                :key="tab.id"
                class="tab-navigation__item"
              >
                <a
                  class="tab-navigation__link"
                  :href="`#${tab.id}`"
                  :aria-controls="`#${tab.id}`"
                  role="tab"
                  @click.prevent="changeTab($event)"
                >
                  {{ tab.title }}
                </a>
              </li>
            </ul>
          </nav>

          <div class="text-body__tabs-and-rewards" role="tabpanel">
            <section
              aria-live="polite"
              role="region"
              class="tab-list text-body__tab-list"
            >
              <article
                v-for="tab in tabs"
                :id="tab.id"
                :key="tab.id"
                role="tab"
                class="tab-list__item"
                :aria-selected="tab.id === currentTab"
                v-html="tab.content"
              ></article>

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
<script setup lang="ts">
import rewards from './mocks/rewards.ts';
import tabs from './mocks/tabs.ts';

const currentTab = ref('');

currentTab.value = tabs[0]?.id;

function changeTab(event: Event): void {
  const { target } = event as MouseEvent;

  if (target instanceof HTMLElement && target.hasAttribute('href')) {
    const href = target.getAttribute('href');

    if (href) {
      const hash = href.split('#')[1];

      if (hash) {
        event.preventDefault();
        currentTab.value = hash;
        if (window.history) {
          window.history.pushState({}, '', href);
        }
      }
    }
  }
}
</script>
