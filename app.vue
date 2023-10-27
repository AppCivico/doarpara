<template>
  <!-- required by NUXT page transitions -->
  <div class="page-wrapper">
    <header class="main-header">
      <div class="container">
        <div class="title-and-colophon">
          <h1 class="campaign-title">
            {{ campaign.name }}
          </h1>

          <div class="colophon">
            <img
              v-if="campaign.fundraiser.logotype"
              class="colophon__creator-avatar"
              :width="typeof campaign.fundraiser.logotype === 'object'
                ? campaign.fundraiser.logotype.width
                : undefined"
              :height="typeof campaign.fundraiser.logotype === 'object'
                ? campaign.fundraiser.logotype.height
                : undefined"
              :src="typeof campaign.fundraiser.logotype === 'object'
                ? campaign.fundraiser.logotype.url
                : campaign.fundraiser.logotype"
              alt=""
            />

            <dl v-if="campaign.is_election_campaign" class="colophon__campaign">
              <div class="colophon__campaign-creator">
                <dt>
                  {{ $t('electionCampaign.runningForOffice', { gender: campaign.fundraiser.gender }) }}
                </dt>
                <dd>
                  {{ $t(`governmentOffices.${campaign.fundraiser.office}`, { gender: campaign.fundraiser.gender }) }}
                </dd>
              </div>

              <div v-if="campaign.fundraiser.political_party" class="colophon__campaign-party">
                <dt>
                  {{ $t('electionCampaign.politicalParty') }}
                </dt>
                <dd>
                  <abbr :title="campaign.fundraiser.political_party.name">
                    {{ campaign.fundraiser.political_party.abbreviation }}
                  </abbr>
                </dd>
              </div>

              <div v-if="campaign.fundraiser.ballot_number" class="colophon__campaign-ballot-number">
                <dt>
                  {{ $t('electionCampaign.ballotNumber') }}
                </dt>
                <dd>
                  {{ campaign.fundraiser.ballot_number }}
                </dd>
              </div>

              <div
                v-if="campaign.fundraiser.city && campaign.fundraiser.state"
                class="colophon__campaign-location colophon__campaign-location--election"
              >
                <dt>
                  {{ $t('electionCampaign.runningForLocation') }}
                </dt>
                <dd>
                  <template v-if="campaign.fundraiser.city">
                    <span class="colophon__campaign-location-city">
                      {{ campaign.fundraiser.city }}
                    </span>
                    <abbr class="colophon__campaign-location-state" :title="campaign.fundraiser.state.name">
                      {{ campaign.fundraiser.state.abbr }}
                    </abbr>
                  </template>
                  <span v-else class="colophon__campaign-location-state">
                    {{ campaign.fundraiser.state.name }}
                  </span>
                </dd>
              </div>
            </dl>

            <div v-else class="colophon__campaign">
              <div class="colophon__campaign-creator">
                {{ $t('campaignBy') }}
                <a
                  v-if="campaign.fundraiser.slug"
                  :href="campaign.fundraiser.slug"
                >
                  {{ campaign.fundraiser.name }}
                </a>
                <template v-else>
                  {{ campaign.fundraiser.name }}
                </template>
              </div>

              <div
                v-if="campaign.fundraiser.city || campaign.fundraiser.state"
                class="colophon__campaign-location"
              >
                <template v-if="campaign.fundraiser.city">
                  <span class="colophon__campaign-location-city">
                    {{ campaign.fundraiser.city }}
                  </span>
                  <abbr class="colophon__campaign-location-state" :title="campaign.fundraiser.state.name">
                    {{ campaign.fundraiser.state.abbr }}
                  </abbr>
                </template>
                <span v-else class="colophon__campaign-location-state">
                  {{ campaign.fundraiser.state.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <socialNetworks :contact-methods="campaign.contact_methods" />
      </div>
    </header>

    <article role="main">
      <campaignIntro :campaign="campaign" />
      <div class="text-body">
        <div class="container text-body__container">
          <nav
            role="tablist"
            class="tab-navigation text-body__tab-navigation"
            :aria-label="$t('navigationLabel')"
          >
            <ul class="tab-navigation__list">
              <li
                v-for="tab, i in campaign.campaign_section_list"
                :key="i"
                class="tab-navigation__item"
              >
                <a
                  class="tab-navigation__link"
                  :href="`#${tab}`"
                  :aria-controls="`#${tab}`"
                  role="tab"
                  @click.prevent="changeTab($event)"
                >
                  {{ $t(`nav.${tab}`) }}
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
                :aria-selected="tab.id === currentTab.id"
                v-html="tab.content"
              />

              <footer class="text-body__call-to-faq">
                <p>
                  Dúvidas sobre esse projeto?
                  <a href="#faq">Confira as respostas às perguntas Frequentes</a>
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
          :aria-label="$t('footerMenuLabel')"
        >
          <ul class="footer-nav__list">
            <li
              v-for="tab, i in campaign.campaign_section_list"
              :key="i"
              class="footer-nav__item"
            >
              <a
                class="footer-nav__link"
                :href="`#${tab}`"
                :aria-controls="`#${tab}`"
                role="tab"
                @click.prevent="changeTab($event)"
              >
                {{ $t(`nav.${tab}`) }}
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

        <socialNetworks :contact-methods="campaign.contact_methods" />

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
          {{ $t('credits.fundraiserLabel') }}: {{ campaign.fundraiser.name }}

          <template v-if="campaign.fundraiser.legal_entities_id">
            {{ $t('legalEntityIdentification') }}:
            {{ campaign.fundraiser.legal_entities_id }}
          </template>
          <template v-else-if="campaign.fundraiser.natural_person_id">
            {{ $t('naturalPersonIdentification') }}:
            {{ campaign.fundraiser.natural_person_id }}
          </template>
        </div>
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { ref, Ref } from 'vue';
import type { Campaign } from './doar-para.d.ts';
import campaign from './mocks/campaign.ts';
import rewards from './mocks/rewards.ts';

const currentTab: Ref<{ id: string; content: string }> = ref({
  id: '',
  content: '',
});

currentTab.value.id = 'description';
currentTab.value.content = campaign.description;

const tabs = campaign.campaign_section_list
  .reduce((acc, cur) => {
    if (campaign[cur as keyof Campaign]) {
      acc.push({ id: cur, content: campaign[cur as keyof Campaign] });
    }
    return acc;
  }, [] as { id: string, content: any }[]);

function changeTab(event: Event): void {
  const { target } = event as MouseEvent;

  if (target instanceof HTMLElement && target.hasAttribute('href')) {
    const href = target.getAttribute('href');

    if (href) {
      const hash = href.split('#')[1];

      if (hash) {
        event.preventDefault();
        currentTab.value.id = hash;

        if (campaign[hash as keyof Campaign]) {
          currentTab.value.content = String(campaign[hash as keyof Campaign] || '');
        }

        if (window.history) {
          window.history.pushState({}, '', href);
        }
      }
    }
  }
}
</script>
