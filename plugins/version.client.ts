export default defineNuxtPlugin(() => {
  const { version, title } = useRuntimeConfig().public;
  console.log(`${title} v${version}`);
});
