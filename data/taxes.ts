type Taxes = {
  [key: string]: {
    percent: number;
    // The tax field is used to store the fixed tax amount in cents, which is
    // added to the percentage-based tax. This allows for more accurate
    // calculations, especially for small donations where the percentage-based
    // tax might be negligible.
    tax: number;
    [key: string]: number;
  };
};

const taxes: Taxes = {
  credit_card: {
    percent: 5.9,
    tax: 100,
  },
  boleto: {
    percent: 3.5,
    tax: 390,
  },
  pix: {
    percent: 2.99,
    tax: 0,
  },
};

export default taxes;
