import type { RouterConfig } from '@nuxt/schema';

let _preservedScrollY: number | null = null;

export function setPreservedScrollY(y: number) {
  _preservedScrollY = y;
}

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (_preservedScrollY !== null) {
      const y = _preservedScrollY;

      _preservedScrollY = null;
      return { top: y };
    }

    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash };
    return { top: 0 };
  },
};
