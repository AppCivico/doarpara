import datetimeFormats from '@/datetime-formats/pt-BR.ts';
import ptBR from '@/locales/pt-BR.ts';
import numberFormats from '@/number-formats/pt-BR.ts';

export default defineI18nConfig(() => ({
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
}));
