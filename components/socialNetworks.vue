<template>
  <ul class="social-networks">
    <li class="social-networks__item">
      <a
        class="social-networks__link"
        target="_blank"
        rel="noopener noreferrer"
        @click="share"
        @keydown.enter="share"
      >
        Compartilhar
      </a>
    </li>
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
import type { ContactMethods } from '@/doar-para.d.ts';
import { computed } from 'vue';

const props = defineProps<{
  contactMethods: ContactMethods;
}>();

const contactMethodsArray = computed(() => Object.entries(props.contactMethods)
  .filter(([, link]) => link)
  .map(([method, link]) => ({ name: method, link }))
  .sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  }));

async function share() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Doar para',
        text: 'Doar para',
        url: 'https://doarpara.com.br',
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log('no share api')
  }
}
</script>
