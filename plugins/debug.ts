export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('debug', {
    beforeMount: (el, binding) => {
      const primaryKey = 'Control';
      const secondaryKey = 'CapsLock';

      el.classList.add('debug');
      el.setAttribute('hidden', '');
      let isSecondaryKeyPressed = false;

      if (binding.value) {
        el.setAttribute('data-debug', binding.value);
      }
      window.addEventListener('keydown', (event) => {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        if (event.getModifierState && event.getModifierState(primaryKey)) {
          if (event.key === secondaryKey) {
            if (isSecondaryKeyPressed) {
              if (el.hasAttribute('hidden')) {
                el.removeAttribute('hidden');
              } else {
                el.setAttribute('hidden', '');
              }
              isSecondaryKeyPressed = false;
            } else {
              isSecondaryKeyPressed = true;
              setTimeout(() => {
                isSecondaryKeyPressed = false;
              }, 300);
            }
          } else if (isSecondaryKeyPressed) {
            isSecondaryKeyPressed = false;
          }
        }
      });
    },
  });
});
