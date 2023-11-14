declare const Iugu: any;

type Errors = {
  errors: unknown
};

export type CreditCard = {
  number: string,
  verification_value: string,
  expiration: string,
  full_name: string,
};

export type PaymentToken = {
  id: string;
  method: string;
  extra_info: {
    bin: string;
    year: number;
    month: number;
    brand: string;
    holder_name: string;
    display_number: string;
  },
  test: boolean;
} | Errors;
