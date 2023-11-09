type Taxes = {
  [key: string]: {
    [key: string]: {
      [key: string]: string | number
    }
  };
};

const taxes: Taxes = {
  taxes: {
    credit_card: {
      label: 'cartão de crédito',
      text: '5,5%',
      percent: 5.5,
      tax: 0,
    },
    boleto: {
      label: 'boleto pago',
      text: '3,5% + R$ 3,90',
      percent: 3.5,
      tax: 390,
    },
    pix: {
      label: 'PIX',
      text: '2,99%',
      percent: 2.99,
      tax: 0,
    },
  },
};

export default taxes;
