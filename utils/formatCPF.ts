export default (value: string | null = '') => {
  const v = (value || '').trim();
  return /^\d{11}$/.test(v)
    ? v.replace(/[^0-9]/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/g, '$1.$2.$3-$4')
    : v;
};
