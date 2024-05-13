export default (value:string) => (/^\d{11}$/.test(value.trim())
  ? value.trim().replace(/[^0-9]/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/g, '$1.$2.$3-$4')
  : value);
