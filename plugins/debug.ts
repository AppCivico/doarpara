export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('debug', {
    beforeMount: (el, binding) => {
      el.classList.add('debug');
      el.setAttribute('hidden', '');
      let shiftEnabled = false;

      if (binding.value) {
        el.setAttribute('data-debug', binding.value);
      }
      window.addEventListener('keydown', (event) => {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        if (event.getModifierState('Control')) {
          if (event.key === 'Shift') {
            if (shiftEnabled) {
              if (el.hasAttribute('hidden')) {
                el.removeAttribute('hidden');
              } else {
                el.setAttribute('hidden', '');
              }
              shiftEnabled = false;
            } else {
              shiftEnabled = true;
              setTimeout(() => {
                shiftEnabled = false;
              }, 300);
            }
          } else if (shiftEnabled) {
            shiftEnabled = false;
          }
        }
      });
    },
  });
});
