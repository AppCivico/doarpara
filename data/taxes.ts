type PaymentMethod = 'credit_card' | 'boleto' | 'pix';

export type Taxes = {
  percent: number;
  // added to the percentage-based tax. This allows for more accurate
  // calculations, especially for small donations where the percentage-based
  // tax might be negligible.
  tax: number;
};

export type TaxesPerMethod = {
  [key in PaymentMethod]: Taxes;
};

const taxesPerTier: Record<string, TaxesPerMethod> = {
  default: {
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
  },

  essential_2026: {
    credit_card: {
      percent: 4.98,
      tax: 90, // in cents
    },
    boleto: {
      percent: 0,
      tax: 390, // in cents
    },
    pix: {
      percent: 2.99,
      tax: 0, // in cents
    },
  },

  PARTIDOS: {
    credit_card: {
      percent: 5.9,
      tax: 100, // in cents
    },
    boleto: {
      percent: 3.5,
      tax: 390, // in cents
    },
    pix: {
      percent: 2.99,
      tax: 0, // in cents
    },
  },
};

export default taxesPerTier;
