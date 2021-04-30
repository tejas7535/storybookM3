import { Transaction } from '../../app/core/store/reducers/transactions/models/transaction.model';

export const TRANSACTION_MOCK: Transaction = {
  identifier: 213,
  customerName: 'customerName',
  customerId: 'customerId',
  country: 'DE',
  materialDescription: 'matDesc',
  price: 10,
  profitMargin: 0.5,
  quantity: 100,
  salesIndication: 'Invoice',
  year: '2020',
};
