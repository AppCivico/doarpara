<template>
  <ul class="social-networks">
    <li v-for="method in contactMethodsArray" :key="method.name" class="social-networks__item">
      <a
        class="social-networks__link"
        :class="`social-networks__link--${method.name}`"
        :href="method.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ method.name }}
      </a>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { ContactMethods } from '../doar-para.d.ts';

const props = defineProps<{
  contactMethods: ContactMethods;
}>();

const contactMethodsArray = computed(() => Object.entries(props.contactMethods)
  .filter(([, link]) => link)
  .map(([method, link]) => ({ name: method, link })));
</script>
