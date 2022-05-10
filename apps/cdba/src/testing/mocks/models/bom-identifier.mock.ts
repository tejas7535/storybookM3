import { BomIdentifier, OdataBomIdentifier } from '@cdba/shared/models';

export const BOM_IDENTIFIER_MOCK: BomIdentifier = {
  bomCostingDate: '20171101',
  bomCostingNumber: '145760472',
  bomCostingType: 'K1',
  bomCostingVersion: '61',
  bomEnteredManually: '',
  bomReferenceObject: '0',
  bomValuationVariant: 'SQB',
};

export const ODATA_BOM_IDENTIFIER_MOCK: OdataBomIdentifier = {
  costingDate: '20171101',
  costingNumber: '145760472',
  costingType: 'K1',
  version: '61',
  enteredManually: false,
  referenceObject: '0',
  valuationVariant: 'SQB',
};
