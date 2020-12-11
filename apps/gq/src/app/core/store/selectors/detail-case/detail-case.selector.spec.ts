import { DetailCaseMock } from '../../../../../testing/mocks/detail-case.mock';
import * as detailSelectors from './detail-case.selector';

describe('Create Detail Selector', () => {
  const fakeState = {
    detailCase: {
      materialLoading: false,
      materialNumber15: '15',
      materialDetails: DetailCaseMock,
    },
  };
  describe('Get Material Details Selector', () => {
    test('should return Material Details', () => {
      expect(detailSelectors.getMaterialDetails.projector(fakeState)).toEqual(
        DetailCaseMock
      );
    });
  });

  describe('Get Material Number and Description Selector', () => {
    test('should return Material Number and desc', () => {
      expect(
        detailSelectors.getMaterialNumberAndDescription.projector(fakeState)
      ).toEqual({
        materialNumber15: fakeState.detailCase.materialNumber15,
        materialDescription: DetailCaseMock.materialDesignation,
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
