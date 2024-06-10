<template>
  <div>
    <div v-if="pending">
      Carregando...
    </div>
    <div class="depositions-page-content">
      <article v-if="depositions?.candidate_reviews.length">
        <h1>
          Conheça o motivo pelo qual algumas pessoas apoiam {{ campaign?.name }}
        </h1>

        <div
          v-for="review in depositions?.candidate_reviews"
          :key="review.id"
        >
          <div class="depositions-item">
            <blockquote><p>{{ review.content }}</p></blockquote>
            <cite>{{ review.first_name }} {{ review.family_name }}</cite>
            <div v-if="review.reply" class="depositions-reply">
              <p>{{ review.reply }}</p>
              <img
                class="colophon__creator-avatar"
                :src="campaign?.fundraiser.avatar.url"
                alt="Pré candidato"
              >
            </div>
          </div>
        </div>
      </article>
      <article>
        <div>
          <h1 class="depositions-page-title">
            Deixe seu depoimento
          </h1>
          <form
            enctype="multipart/form-data"
            @submit.prevent="submitTestimonies"
          >
            <fieldset class="flexible-fieldset">
              <p data-field-size="50">
                <label for="email" class="label--of-required">
                  {{ $t('testimoniesForm.email') }}
                </label>
                <input
                  id="email"
                  v-model="donor.email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  required
                >
              </p>

              <p data-field-size="50">
                <label for="first_name" class="label--of-required">
                  {{ $t('testimoniesForm.name') }}
                </label>
                <input
                  id="first-name"
                  v-model="donor.first_name"
                  v-focus
                  type="text"
                  name="first_name"
                  autocomplete="given-name"
                  required
                >
              </p>

              <p data-field-size="50">
                <label for="family_name" class="label--of-required">
                  {{ $t('testimoniesForm.family_name') }}
                </label>
                <input
                  id="family_name"
                  v-model="donor.last_name"
                  type="text"
                  name="family_name"
                  autocomplete="family_name"
                  required
                >
              </p>

              <p data-field-size="100">
                <label for="phone_number">
                  {{ $t('testimoniesForm.phone_number') }}
                </label>
                <input
                  id="phone"
                  v-model="donor.phone_number"
                  v-maska
                  data-maska="['(##) ####-####', '(##) #####-####']"
                  type="tel"
                  name="phone"
                  autocomplete="tel-national"
                  inputmode="numeric"
                  placeholder="(00) 00000-0000"
                  minlength="14"
                />
              </p>
            </fieldset>

            <fieldset class="depositions-page-form">
              <p data-field-size="50">
                <label for="content" class="label--of-required">
                  {{ $t('testimoniesForm.content') }}
                </label>
                <textarea
                  id="content"
                  v-model="content"
                  type="text"
                  name="content"
                  rows="4"
                  maxlength="220"
                  required
                  @input="updateCounter"
                />
              </p>
              <span>Faltam {{ count }} caracteres</span>
            </fieldset>

            <fieldset>
              <div v-if="submissionSuccess" class="request-message-depositions">
                Depoimento enviado com sucesso, aguardando aprovação!
              </div>
              <button type="submit">
                Enviar
              </button>
            </fieldset>
          </form>
        </div>
      </article>
    </div>
  </div>
</template>
<!-- eslint-disable-next-line vue/block-lang -->
<script setup>
import { useCampaignStore } from '@/store/campaign.ts';
import { useDonateStore } from '@/store/donate.ts';

definePageMeta({
  name: 'testimonies',
  path: '/:campaignSlug/depoimentos',
});

const campaignStore = useCampaignStore();
const donateStore = useDonateStore();

const { campaign } = storeToRefs(campaignStore);
const { donor } = storeToRefs(donateStore);

const runtimeConfig = useRuntimeConfig();

const submissionSuccess = ref(false);
const count = ref(220);
const content = ref('');

const updateCounter = () => {
  count.value = 220 - content.value.length;
};

const url = `${runtimeConfig.public.privateApiBase}/api2/candidate-review`;

const {
  data: depositions,
  pending,
} = await useFetch(`${url}?candidate_id=${campaign.value.id}`);

const submitTestimonies = async (event) => {
  try {
    const formData = new FormData(event.target);
    formData.append('candidate_id', campaign.value.id);
    const { status, error: err } = await useFetch(url, {
      method: 'POST',
      body: formData,
    });
    if (status.value === 'success') {
      submissionSuccess.value = true;
      setTimeout(() => {
        content.value = '';
        count.value = 220;
        submissionSuccess.value = false;
      }, 2000);
    } else {
      setErrorMessage(`Erro do servidor: ${err.message || 'Erro desconhecido'}`);
    }
  } catch (err) {
    throw new Error('Erro ao enviar depoimento');
  }
};

</script>

<style lang="scss">
  .depositions-item {
    padding: 3rem 0;
    border-bottom: 1px solid #B2BDC566;
  }

  .depositions-item blockquote {
    font-weight: normal;
    margin: 0
  }

  .depositions-item cite {
    font-weight: 600;
    @include my.themed-color('color', ('brand', 'primary'));

    @include my.themed-declaration ('orange') {
      color: my.palette('orange-theme', 'brand', 'quaternary');
    }
  }

  .depositions-item::before {
    content: '';
    display: block;
    width: 1.875rem;
    height: 1.25rem;
    margin-bottom: 0.625rem;
    background-image: url('../../assets/images/icons/quotation-marks.svg')
  }

  .depositions-reply{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 2rem;
  }

  .depositions-reply p{
    width: fit-content;
    padding: 1.25rem;
    background-color: #F5F8F9;
    border-radius: 1.25rem;
    margin: 0
  }

  .depositions-reply img{
    position: relative;
    top: -10px;
    margin-right: 2rem;
  }

  .depositions-page-title{
    text-transform: uppercase;
    @include my.themed-color('color', ('brand', 'primary'));

    @include my.themed-declaration ('orange') {
      color: my.palette('orange-theme', 'brand', 'quaternary');
    }
  }

  .depositions-page-form textarea{
    height: 100%;
  }

  .depositions-page-form span{
    font-size: 0.75rem;
    float: right;
    color: my.palette('text', 'faded');
  }

  .depositions-page-content {
    @media screen and (min-width: my.breakpoint('toggle-sidebar-position')) {
      display: grid;
      grid-template-columns: minmax(my.$cover-max-width, 1fr) 1fr;
      gap: my.$gutter * 2;
    }
  }

  .request-message-depositions {
    background-color: hsl(198, 95%, 52%);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 4000;
    padding: 1.25rem;
    color: hsl(0, 0%, 100%);
    text-align: center;
  }
</style>
