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
    percent: 3.38,
    tax: 60, // in cents
  },
  boleto: {
    percent: 0,
    tax: 290, // in cents
  },
  pix: {
    percent: 1.99,
    tax: 0, // in cents
  },
};

export default taxes;
