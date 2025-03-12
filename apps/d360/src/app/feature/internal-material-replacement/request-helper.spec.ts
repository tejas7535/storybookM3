import { IMRSubstitution } from './model';
import { dataToIMRSubstitutionRequest } from './request-helper';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key) => key),
}));

describe('dataToIMRSubstitutionRequest', () => {
  it('should throw an error if region or replacementType is missing', () => {
    const data: IMRSubstitution = {
      region: '',
      replacementType: '' as any,
      salesArea: '',
      salesOrg: '',
      customerNumber: '',
      predecessorMaterial: '',
      successorMaterial: '',
      replacementDate: '',
      cutoverDate: '',
      startOfProduction: '',
      note: '',
    };

    expect(() => dataToIMRSubstitutionRequest(data)).toThrow(
      'generic.validation.check_inputs'
    );
  });

  it('should return a valid IMRSubstitutionRequest object', () => {
    const data: IMRSubstitution = {
      region: 'region1',
      replacementType: 'type1' as any,
      salesArea: 'area1',
      salesOrg: 'org1',
      customerNumber: 'customer1',
      predecessorMaterial: 'material1',
      successorMaterial: 'material2',
      replacementDate: '2023-01-01',
      cutoverDate: '2023-02-01',
      startOfProduction: '2023-03-01',
      note: 'note1',
    };

    const result = dataToIMRSubstitutionRequest(data);

    expect(result).toEqual({
      replacementType: 'type1',
      region: 'region1',
      salesArea: 'area1',
      salesOrg: 'org1',
      customerNumber: 'customer1',
      predecessorMaterial: 'material1',
      successorMaterial: 'material2',
      replacementDate: '2023-01-01',
      cutoverDate: '2023-02-01',
      startOfProduction: '2023-03-01',
      note: 'note1',
    });
  });

  it('should handle null dates correctly', () => {
    const data: IMRSubstitution = {
      region: 'region1',
      replacementType: 'type1' as any,
      salesArea: 'area1',
      salesOrg: 'org1',
      customerNumber: 'customer1',
      predecessorMaterial: 'material1',
      successorMaterial: 'material2',
      replacementDate: null,
      cutoverDate: null,
      startOfProduction: null,
      note: 'note1',
    };

    const result = dataToIMRSubstitutionRequest(data);

    expect(result).toEqual({
      replacementType: 'type1',
      region: 'region1',
      salesArea: 'area1',
      salesOrg: 'org1',
      customerNumber: 'customer1',
      predecessorMaterial: 'material1',
      successorMaterial: 'material2',
      replacementDate: null,
      cutoverDate: null,
      startOfProduction: null,
      note: 'note1',
    });
  });
});
