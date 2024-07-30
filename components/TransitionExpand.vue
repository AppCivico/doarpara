<template>
  <transition
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>
<!--
  eslint-disable no-param-reassign
  eslint-disable-next-line vue/block-lang
-->
<script lang="js">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TransitionExpand',
  methods: {
    enter(element) {
      const { width } = getComputedStyle(element);

      element.style.width = width;
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';
      element.style.height = 'auto';

      const { height } = getComputedStyle(element);

      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = 0;

      // Force repaint to make sure the
      // animation is triggered correctly.
      // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
      getComputedStyle(element).height;

      // Trigger the animation.
      // We use `requestAnimationFrame` because we need
      // to make sure the browser has finished
      // painting after setting the `height`
      // to `0` in the line above.
      requestAnimationFrame(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = 'auto';
    },
    leave(element) {
      const { height } = getComputedStyle(element);

      element.style.height = height;

      // Force repaint to make sure the
      // animation is triggered correctly.
      // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
      getComputedStyle(element).height;

      requestAnimationFrame(() => {
        element.style.height = 0;
      });
    },
  },
});
</script>
<style scoped>
* {
  transform: translateZ(0);
  perspective: 1000px;
  will-change: height min-height padding-top padding-bottom;
  backface-visibility: hidden;
}

.expand-enter-active,
.expand-leave-active {
  overflow: hidden;

  transition: height padding-top padding-bottom 300ms ease-in-out;
}

.expand-enter,
.expand-leave-to {
  /* stylelint-disable-next-line declaration-no-important */
  height: 0 !important;
  /* stylelint-disable-next-line declaration-no-important */
  min-height: 0 !important;
  /* stylelint-disable-next-line declaration-no-important */
  padding-top: 0 !important;
  /* stylelint-disable-next-line declaration-no-important */
  padding-bottom: 0 !important;
}
</style>
