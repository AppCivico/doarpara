import type { DonationList } from '../doar-para.d.ts';

const donations: DonationList = {
  list: [
    {
      id: 'f19d721c-fd6a-4252-9d6f-db8a288deed6',
      creationDate: '20231023T17:04:57-0300',
      paymentMethod: 'credit_card',
      amount: 10000,
      donorName: 'John Doe',
      donorNaturalPersonId: '90704890070',
    },
    {
      id: 'c124be9e-799b-4811-8f65-0a468c7ca44d',
      creationDate: '20231023T16:43:18-0300',
      paymentMethod: 'instant_payment_platform',
      amount: 5000,
      donorName: 'Jane Smith',
      donorNaturalPersonId: '30962206032',
    },
    {
      id: 'b8fa1795-37e6-489f-b6f7-53d1b643cf0d',
      creationDate: '20231024T01:13:03-0300',
      paymentMethod: 'pro_forma_invoice',
      amount: 5000,
      donorName: 'Jane Smith',
      donorNaturalPersonId: '35397555002',
    },
  ],
  has_more: true,
  pagination_marker: 'some_marker_value',
};

export default donations;
