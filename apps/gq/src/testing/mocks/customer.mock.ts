import { Customer, KeyAccount } from '../../app/core/store/models';

export const CUSTOMER_MOCK: Customer = {
  id: '123',
  name: 'mock customer',
  country: 'mock country',
  incoterms: 'incoterms',
  keyAccount: new KeyAccount('', ''),
  paymentTerms: 'paymentTerms',
  region: 'region',
  sectorManagement: 'sectorManagement',
  subKeyAccount: new KeyAccount('', ''),
  subRegion: 'subRegion',
  subSector: 'subSector',
};
