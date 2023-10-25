import type { DonationList } from '../doar-para.d.ts';

const donations: DonationList = {
  list: [
    {
      id: 'f19d721c-fd6a-4252-9d6f-db8a288deed6',
      creation_date: '20231023T17:04:57-0300',
      payment_method: 'credit_card',
      amount: 10000,
      donor_name: 'John Doe',
      donor_natural_person_id: '90704890070',
    },
    {
      id: 'c124be9e-799b-4811-8f65-0a468c7ca44d',
      creation_date: '20231023T16:43:18-0300',
      payment_method: 'instant_payment_platform',
      amount: 5000,
      donor_name: 'Jane Smith',
      donor_natural_person_id: '30962206032',
    },
    {
      id: 'b8fa1795-37e6-489f-b6f7-53d1b643cf0d',
      creation_date: '20231024T01:13:03-0300',
      payment_method: 'pro_forma_invoice',
      amount: 5000,
      donor_name: 'Jane Smith',
      donor_natural_person_id: '35397555002',
    },
  ],
  has_more: true,
  pagination_marker: 'some_marker_value',
};

export default donations;
