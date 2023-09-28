import { createI18n } from 'vue-i18n';
import datetimeFormats from '../datetime-formats/pt-BR.ts';
import ptBR from '../locales/pt-BR.json';
import numberFormats from '../number-formats/pt-BR.ts';

type MessageSchema = typeof ptBR;

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n<[MessageSchema], 'pt-BR'>({
    legacy: false,
    globalInjection: true,
    locale: 'pt-BR',
    messages: {
      'pt-BR': ptBR,
    },
    numberFormats: {
      'pt-BR': numberFormats,
    },
    datetimeFormats: {
      'pt-BR': datetimeFormats,
    },
  });

  vueApp.use(i18n);
});
