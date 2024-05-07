import { defineStore } from 'pinia';

export const useReciboStore = defineStore('useReciboStore', {
  id: 'api',
  state: () => ({
    responseData: null,
    loading: false,
  }),
  actions: {
    async fetchData() {
      try {
        this.loading = true;
        const response = await fetch(`https://api-vl.appcivico.com/public-api/candidate/marinasilva/donation/digest/a7331788f8120ba32145cafb4b1ec652a88322c86e060658acafad3147c85c5d
        `);
        if (!response.ok) {
          throw new Error('Erro ao buscar dados da API');
        }
        const data = await response.json();
        this.responseData = data;
      } catch (error) {
        console.error('Erro ao fazer a solicitação:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
