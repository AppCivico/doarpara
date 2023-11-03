export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', {
    mounted: async (el:HTMLElement, binding) => {
      const { modifiers, value } = binding;

      if (!!value || value === undefined) {
        el.focus();
        if (modifiers.select && el instanceof HTMLInputElement) {
          el.select();
        }
      }
    },
  });
});
