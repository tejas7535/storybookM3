import { DETAIL_CASE_MOCK } from '../../../../../testing/mocks/';
import * as detailSelectors from './detail-case.selector';

describe('Create Detail Selector', () => {
  const fakeState = {
    detailCase: {
      materialLoading: false,
      materialNumber15: '15',
      materialDetails: DETAIL_CASE_MOCK,
    },
  };
  describe('Get Material Details Selector', () => {
    test('should return Material Details', () => {
      expect(detailSelectors.getMaterialDetails.projector(fakeState)).toEqual(
        DETAIL_CASE_MOCK
      );
    });
  });

  describe('Get Material Number and Description Selector', () => {
    test('should return Material Number and desc', () => {
      expect(
        detailSelectors.getMaterialNumberAndDescription.projector(fakeState)
      ).toEqual({
        materialNumber15: fakeState.detailCase.materialNumber15,
        materialDescription: DETAIL_CASE_MOCK.materialDescription,
      });
    });

    test('should return Material Number and undefined description', () => {
      const mockState = {
        ...fakeState,
        detailCase: {
          ...fakeState.detailCase,
          materialDetails: undefined as any,
        },
      };
      expect(
        detailSelectors.getMaterialNumberAndDescription.projector(mockState)
      ).toEqual({
        materialNumber15: fakeState.detailCase.materialNumber15,
        materialDescription: undefined,
      });
    });
  });

  describe('Is Material Loading', () => {
    test('should return false', () => {
      expect(
        detailSelectors.isMaterialLoading.projector(fakeState)
      ).toBeFalsy();
    });

    test('should return true', () => {
      const mockState = {
        ...fakeState,
        detailCase: {
          ...fakeState.detailCase,
          materialLoading: true,
        },
      };
      expect(
        detailSelectors.isMaterialLoading.projector(mockState)
      ).toBeTruthy();
    });
  });
});
