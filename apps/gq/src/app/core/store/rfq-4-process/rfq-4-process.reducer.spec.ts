import { QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state/active-case-state.mock';
import { activeCaseFeature } from '../active-case/active-case.reducer';
import { Rfq4ProcessActions } from './rfq-4-process.actions';
import { rfq4ProcessFeature, Rfq4ProcessState } from './rfq-4-process.reducer';

describe('rfq4ProcessFeature.reducer', () => {
  const rfq4ProcessesMock: Rfq4ProcessState = {
    gqId: undefined,
    gqPositionId: undefined,
    findCalculatorsLoading: false,
    sendRecalculateSqvRequestLoading: false,
    foundCalculators: [],
  };

  const gqPositionId = '1245';
  const foundCalculators = ['calculator1', 'calculator2'];
  describe('findCalculators', () => {
    test('should set findCalculatorsLoading to true', () => {
      const action = Rfq4ProcessActions.findCalculators({
        gqPositionId,
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.findCalculatorsLoading).toEqual(true);
    });
    test('should set findCalculatorsLoading to false', () => {
      const fakeState: Rfq4ProcessState = {
        ...rfq4ProcessesMock,
        findCalculatorsLoading: true,
      };

      const action = Rfq4ProcessActions.findCalculatorsSuccess({
        foundCalculators,
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);

      expect(state.findCalculatorsLoading).toEqual(false);
    });
    test('should set findCalculatorsLoading to false when error', () => {
      const action = Rfq4ProcessActions.findCalculatorsError({
        error: 'an Error',
        gqPositionId,
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.findCalculatorsLoading).toEqual(false);
    });

    test('should clear the foundCalculators', () => {
      const action = Rfq4ProcessActions.clearCalculators();
      const state = rfq4ProcessFeature.reducer(
        { ...rfq4ProcessesMock, foundCalculators: ['name1', 'name2'] },
        action
      );
      expect(state.foundCalculators).toEqual([]);
    });
  });

  describe('sendRecalculateSqvRequest', () => {
    test('should set sendRecalculateSqvRequestLoading to true', () => {
      const action = Rfq4ProcessActions.sendRecalculateSqvRequest({
        gqPositionId,
        message: 'message',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sendRecalculateSqvRequestLoading).toEqual(true);
    });
    test('should set sendRecalculateSqvRequestLoading to false', () => {
      const fakeState: Rfq4ProcessState = {
        ...rfq4ProcessesMock,
        sendRecalculateSqvRequestLoading: true,
      };

      const action = Rfq4ProcessActions.sendRecalculateSqvRequestSuccess({
        gqPositionId,
        rfq4Status: Rfq4Status.IN_PROGRESS,
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);

      expect(state.sendRecalculateSqvRequestLoading).toEqual(false);
    });
    test('should set sendRecalculateSqvRequestLoading to false when error', () => {
      const action = Rfq4ProcessActions.sendRecalculateSqvRequestError({
        error: 'an Error',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sendRecalculateSqvRequestLoading).toEqual(false);
    });
  });

  describe('sendRecalculateSqvRequestSuccessReducer', () => {
    test('should update the rfq4Status, after sending recalculationRequest', () => {
      const fakeState = {
        activeCase: {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: {
            ...ACTIVE_CASE_STATE_MOCK.quotation,
            quotationDetails: [
              {
                ...QUOTATION_DETAIL_MOCK,
                rfq4Status: Rfq4Status.OPEN,
              } as QuotationDetail,
            ],
          },
        },
      };
      const action = Rfq4ProcessActions.sendRecalculateSqvRequestSuccess({
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        rfq4Status: Rfq4Status.IN_PROGRESS,
      });
      const state = activeCaseFeature.reducer(fakeState.activeCase, action);

      expect(
        state.quotation.quotationDetails[0].detailCosts.rfq4Status
      ).toEqual(Rfq4Status.IN_PROGRESS);
    });
  });
});
