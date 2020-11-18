import {
  loadMaterialInformation,
  loadMaterialInformationFailure,
  loadMaterialInformationSuccess,
} from '../..';
import { DETAIL_STATE_MOCK } from '../../../../../testing/mocks';
import { DetailCaseMock } from '../../../../../testing/mocks/detail-case.mock';
import { MaterialDetails } from '../../models';
import { detailCaseReducer } from './detail-case.reducer';

describe('DetailCase Reducer', () => {
  describe('loadMaterialInformation', () => {
    test('should set materialInformation loading', () => {
      const materialNumber15 = '15015';
      const action = loadMaterialInformation({ materialNumber15 });

      const state = detailCaseReducer(DETAIL_STATE_MOCK, action);

      expect(state.detailCase.materialLoading).toEqual(true);
      expect(state.detailCase.materialNumber15).toEqual(materialNumber15);
    });
  });
  describe('loadMaterialInformationSuccess', () => {
    test('should set materialInformation loading and materialDetails', () => {
      const materialDetails: MaterialDetails = DetailCaseMock;

      const action = loadMaterialInformationSuccess({ materialDetails });

      const state = detailCaseReducer(DETAIL_STATE_MOCK, action);

      expect(state.detailCase.materialLoading).toEqual(false);
      expect(state.detailCase.materialDetails).toEqual(materialDetails);
    });
  });
  describe('loadMaterialInformationFailure', () => {
    test('should set materialInformation loading and materialDetails undefined', () => {
      const action = loadMaterialInformationFailure();

      const state = detailCaseReducer(DETAIL_STATE_MOCK, action);

      expect(state.detailCase.materialLoading).toEqual(false);
      expect(state.detailCase.materialDetails).toEqual(undefined);
    });
  });
});
