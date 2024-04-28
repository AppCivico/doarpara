export default defineAppConfig({
  title: 'DoarPara',
  creditCardExpirationDate: {
    mask: "['##/##', '##/####']",
    placeholder: 'MM/YY ou MM/YYYY',
  },
  creditCardExpirationCscMask: "['###', '####']",
  creditCardNumberMask: "['#### #### #### ####', '#### #### #### ##']",
  queryStringSpecialParameters: {
    amount: 'valor',
    referrer: 'ref',
  },
  zipCodeMask: '#####-###',
});
