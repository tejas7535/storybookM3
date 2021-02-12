import { DETAIL_CASE_MOCK } from '../../../../../testing/mocks';
import {
  loadMaterialInformation,
  loadMaterialInformationFailure,
  loadMaterialInformationSuccess,
} from './detail-case.actions';

describe('Autocomplete Actions', () => {
  test('loadMaterialInformation', () => {
    const materialNumber15 = '1234';
    const action = loadMaterialInformation({ materialNumber15 });
    expect(action).toEqual({
      materialNumber15,
      type: '[Detail Case] Load Material Information from Endpoint',
    });
  });
  test('loadMaterialInformationFailure', () => {
    const errorMessage = 'error';
    const action = loadMaterialInformationFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Detail Case] Load Material Information from Endpoint Failure',
    });
  });
  test('loadMaterialInformationSuccess', () => {
    const materialDetails = DETAIL_CASE_MOCK;
    const action = loadMaterialInformationSuccess({ materialDetails });
    expect(action).toEqual({
      materialDetails,
      type: '[Detail Case] Load Material Information from Endpoint Success',
    });
  });
});
