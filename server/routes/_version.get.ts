export default defineEventHandler(() => ({
  version: useRuntimeConfig().public.version,
}));
