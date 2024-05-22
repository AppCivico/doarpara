export default (value:string) => (/^\d{14}$/.test(value.trim())
  ? value.trim().replace(/[^0-9]/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/g, '$1.$2.$3/$4-$5')
  : value);
