type Taxes = {
  [key: string]: {
    percent: number;
    tax: number;
    [key: string]: number;
  };
};

const taxes: Taxes = {
  credit_card: {
    percent: 5.9,
    tax: 0,
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
