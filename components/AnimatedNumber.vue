<template>
  <component :is="as" ref="element">
    {{ formattedNumber }}
  </component>
</template>
<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';

const props = defineProps({
  as: {
    type: String,
    default: 'span',
    validator(value: string) { return isValidHtmlTag(value); },
  },
  value: {
    type: Number,
    default: 0,
  },
  slowness: {
    // smaller is faster
    type: [
      Number,
      String,
    ],
    default: 5,
    validator(value) { return Number(value) !== 0; },
  },
  formatter: {
    type: Function,
    default: (n: number) => n,
    validator(value) { return typeof value === 'function'; },
  },
});

let interval: ReturnType<typeof setInterval> | null = null;

const displayNumber = ref<number>(0);
const element = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const formattedNumber = computed(() => props.formatter(displayNumber.value));

const updateDisplayNumber = (newVal: number) => {
  if (interval) {
    clearInterval(interval);
  }

  if (newVal === displayNumber.value) {
    return;
  }

  interval = setInterval(() => {
    if (Math.floor(displayNumber.value) !== Math.floor(newVal)) {
      let change = (newVal - displayNumber.value) / Number(props.slowness) || 5;
      change = change >= 0
        ? Math.ceil(change)
        : Math.floor(change);
      displayNumber.value += change;
    } else {
      displayNumber.value = newVal;
      if (interval) {
        clearInterval(interval);
      }
    }
  }, 20);
};

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible.value = entry.isIntersecting;
      if (isVisible.value) {
        updateDisplayNumber(props.value);
      }
    });
  });

  if (element.value) {
    observer.observe(element.value);
  }

  onBeforeUnmount(() => {
    if (element.value) {
      observer.unobserve(element.value);
    }
  });
});

watch(() => props.value, (newVal: number) => {
  if (isVisible.value) {
    updateDisplayNumber(newVal);
  }
}, { immediate: true });
</script>
