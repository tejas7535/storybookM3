import {
  loadMaterialInformation,
  loadMaterialInformationFailure,
  loadMaterialInformationSuccess,
} from '../..';
import {
  DETAIL_IDENTIFIERS_MOCK,
  DETAIL_STATE_MOCK,
} from '../../../../../testing/mocks';
import { DETAIL_CASE_MOCK } from '../../../../../testing/mocks/detail-case.mock';
import { MaterialDetails } from '../../models';
import { detailCaseReducer } from './detail-case.reducer';

describe('DetailCase Reducer', () => {
  describe('loadMaterialInformation', () => {
    test('should set materialInformation loading', () => {
      const action = loadMaterialInformation(DETAIL_IDENTIFIERS_MOCK);

      const state = detailCaseReducer(DETAIL_STATE_MOCK, action);

      expect(state.detailCase.materialLoading).toEqual(true);
      expect(state.detailCase.materialNumber15).toEqual(
        DETAIL_IDENTIFIERS_MOCK.materialNumber15
      );
    });
  });
  describe('loadMaterialInformationSuccess', () => {
    test('should set materialInformation loading and materialDetails', () => {
      const materialDetails: MaterialDetails = DETAIL_CASE_MOCK;

      const action = loadMaterialInformationSuccess({ materialDetails });

      const state = detailCaseReducer(DETAIL_STATE_MOCK, action);

      expect(state.detailCase.materialLoading).toEqual(false);
      expect(state.detailCase.materialDetails).toEqual(materialDetails);
    });
  });
  describe('loadMaterialInformationFailure', () => {
    test('should set materialInformation loading and materialDetails undefined', () => {
      const errorMessage = 'This is an error message';
      const action = loadMaterialInformationFailure({ errorMessage });

      const state = detailCaseReducer(DETAIL_STATE_MOCK, action);

      expect(state.detailCase.materialLoading).toEqual(false);
      expect(state.detailCase.materialDetails).toEqual(undefined);
    });
  });
});
