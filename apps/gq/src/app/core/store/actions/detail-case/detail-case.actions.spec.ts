import {
  loadMaterialInformation,
  loadMaterialInformationFailure,
  loadMaterialInformationSuccess,
} from '..';
import { MaterialDetails } from '../../models';

describe('Autocomplete Actions', () => {
  test('loadMaterialInformation', () => {
    const materialNumber15 = '12345';
    const action = loadMaterialInformation({ materialNumber15 });
    expect(action).toEqual({
      materialNumber15,
      type: '[Detail Case] Load Material Information from Endpoint',
    });
  });
  test('loadMaterialInformationFailure', () => {
    const action = loadMaterialInformationFailure();

    expect(action).toEqual({
      type: '[Detail Case] Load Material Information from Endpoint Failure',
    });
  });
  test('loadMaterialInformationSuccess', () => {
    const materialDetails: MaterialDetails = {
      dimensions: '123',
      gpsdGroup: {
        id: '1',
        name: '1',
      },
      grossWeight: '123',
      materialDesignation: '1234',
      materialNumber13: '13',
      materialNumber15: '15',
      materialType: 'type',
      productHierarchy: {
        id: '2',
        name: '2',
      },
    };
    const action = loadMaterialInformationSuccess({ materialDetails });
    expect(action).toEqual({
      materialDetails,
      type: '[Detail Case] Load Material Information from Endpoint Success',
    });
  });
});
