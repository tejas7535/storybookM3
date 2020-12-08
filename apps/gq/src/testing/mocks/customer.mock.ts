import {
  Customer,
  KeyAccount,
  SectorManagement,
  SubKeyAccount,
  SubSector,
} from '../../app/core/store/models';

export const CUSTOMER_MOCK: Customer = {
  id: '123',
  name: 'mock customer',
  country: 'mock country',
  incoterms: 'incoterms',
  keyAccount: new KeyAccount('keyAccountId', 'keyAccountName'),
  paymentTerms: 'paymentTerms',
  region: 'region',
  sectorManagement: new SectorManagement(
    'sectorManagementId',
    'sectorManagementName'
  ),
  subKeyAccount: new SubKeyAccount('subKeyAccountId', 'subKeyAccountName'),
  subRegion: 'subRegion',
  subSector: new SubSector('subSectorId', 'subSectorName'),
};
