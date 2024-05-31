<template>{{ formattedNumber }}</template>
<script setup lang="ts">
// https://stackoverflow.com/a/76539913/15425845
import { ref, watch } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
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
const formattedNumber = computed(() => props.formatter(displayNumber.value));

if (import.meta.client) {
  watch(
    () => props.value,
    (newVal: number) => {
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
    },
    { immediate: true },
  );
}
</script>
