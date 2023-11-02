<template>
  <dl v-if="rewards?.length" class="rewards__list">
    <div
      v-for="reward in rewards"
      :key="reward.id"
      class="rewards__item"
      tabindex="0"
    >
      <dd class="rewards__value">
        {{
          $n(reward.minimum_value / 100, 'currency', { maximumFractionDigits: 0 })
        }}
        {{ $t('minimumRewardOrMore') }}
      </dd>
      <dt class="rewards__title">
        {{ reward.name }}
      </dt>
      <dd class="rewards__picture">
        <img alt="" width="300" height="150" :src="reward.image" />
      </dd>
      <dd class="rewards__description" v-html="reward.description" />
      <dd class="rewards__donors-and-call-to-action">
        <i18n-t
          keypath="nSupporters.plural"
          :plural="reward.total_of_supporters"
          tag="p"
          class="rewards__donors"
        >
          <template #n>
            <data
              :value="reward.total_of_supporters"
              :title="reward.total_of_supporters ? $n(reward.total_of_supporters) : undefined"
            >{{
              $n(reward.total_of_supporters, {
                notation: 'compact',
                maximumFractionDigits: 0,
              })
            }}</data>
          </template>
        </i18n-t>
        <p class="rewards__call-to-action-wrapper">
          <a :href="`#doar?recompensa=${reward.id}`" class="rewards__call-to-action">
            {{ $t('chooseThisReward') }}
          </a>
        </p>
      </dd>
    </div>
  </dl>
</template>
<script setup lang="ts">
import type { Reward } from '@/doar-para.d.ts';

defineProps<{
  rewards: Reward[];
}>();
</script>
<style lang="scss">
@use 'sass:color';

.rewards__list {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(21.25rem * 0.66666, 1fr));
  grid-auto-flow: dense;

  gap: 0 my.$gutter;

  align-items: flex-start;
}

.rewards__item {
  padding: my.$gutter;
  margin-bottom: my.$gutter;

  background-color: my.palette('neutral', 'white');
  border: my.$stroke solid my.palette('border');
  border-radius: 10px;

  &:hover,
  &:focus {
    border-color: my.palette('border', 'focus');
  }

  &:focus {
    grid-row-start: span 99;

    box-shadow: 0 60px 24px -36px my.palette('effects', 'shadow'), 0 48px 24px -48px color.adjust(my.palette('brand', 'tertiary'), $alpha: -0.6);
  }
}

.rewards__value {
  margin: 0;

  line-height: 1em;
}

.rewards__title {
  font-size: my.ms-step(25px);
  font-weight: my.font-weight('bold');
  line-height: 1em;
}

.rewards__picture {
  > img {
    display: block;

    width: 100%;
    margin-top: my.$gutter;
    margin-bottom: my.$gutter;

    border-radius: my.$rounded-corner;
  }
}

.rewards__description {
  @include my.truncate(5);

  position: relative;

  margin-bottom: 0;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;

    padding-top: my.$leading * 2em;
    padding-right: 50%;

    font-weight: my.font-weight('bold');
    color: my.palette('brand', 'secondary');

    content: '+ detalhes';

    background-image: linear-gradient(
      to bottom,
      color.adjust(my.palette('neutral', 'white'), $alpha: -1) 0%,
      my.palette('neutral', 'white') my.$leading * 1em
    );
  }

  :focus > & {
    display: block;

    max-height: none;
    margin-bottom: my.$leading * 1rem;

    &::after {
      content: none;
    }
  }
}

.rewards__donors-and-call-to-action {
  margin-top: my.$leading * -1em;

  :focus > & {
    margin-top: 0;
  }
}

.rewards__call-to-action-wrapper {
}

.rewards__call-to-action,
.rewards__call-to-action:link {
  all: unset;

  display: block;

  padding: my.$gutter * 0.75;

  font-weight: my.font-weight('bold');
  color: my.palette('brand', 'primary');
  text-align: center;

  cursor: pointer;

  border: my.$stroke solid currentColor;
  border-radius: my.$rounded-corner;

  @include my.on-event {
    color: my.palette('text', 'light');

    background-color: my.palette('brand', 'primary');
    border-color: my.palette('brand', 'primary');
  }
}

.rewards__donors {
  position: relative;
  z-index: my.layer('default');

  width: 50%;
  margin-right: 0;
  margin-left: auto;

  text-align: right;
  white-space: nowrap;
}

.rewards__donors data {
  font-weight: my.font-weight('bold');
}
</style>
