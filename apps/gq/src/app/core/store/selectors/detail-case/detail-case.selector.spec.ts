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
  describe('Get Material Number15 Selector', () => {
    test('should return Material Number15', () => {
      expect(detailSelectors.getMaterialNumber15.projector(fakeState)).toEqual(
        '15'
      );
    });
  });
});
