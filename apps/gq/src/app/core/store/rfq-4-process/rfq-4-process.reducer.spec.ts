import { QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state/active-case-state.mock';
import { activeCaseFeature } from '../active-case/active-case.reducer';
import { Rfq4ProcessActions } from './rfq-4-process.actions';
import {
  ProcessLoading,
  rfq4ProcessFeature,
  Rfq4ProcessState,
} from './rfq-4-process.reducer';

describe('rfq4ProcessFeature.reducer', () => {
  const rfq4ProcessesMock: Rfq4ProcessState = {
    gqId: undefined,
    gqPositionId: undefined,
    processLoading: ProcessLoading.NONE,
    foundCalculators: [],
    sapMaintainers: [],
    sapMaintainersLoading: false,
  };

  const gqPositionId = '1245';
  const foundCalculators = ['calculator1', 'calculator2'];
  describe('findCalculators', () => {
    test('should set processLoading to FIND_CALCULATORS', () => {
      const action = Rfq4ProcessActions.findCalculators({
        gqPositionId,
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.FIND_CALCULATORS);
    });
    test('should set findCalculatorsLoading to false', () => {
      const fakeState: Rfq4ProcessState = {
        ...rfq4ProcessesMock,
        processLoading: ProcessLoading.FIND_CALCULATORS,
      };

      const action = Rfq4ProcessActions.findCalculatorsSuccess({
        gqPositionId,
        foundCalculators,
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
    });
    test('should set process loading to none when error', () => {
      const action = Rfq4ProcessActions.findCalculatorsError({
        error: 'an Error',
        gqPositionId,
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
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
    test('should set process loading to SEND_RECALCULATE_SQV', () => {
      const action = Rfq4ProcessActions.sendRecalculateSqvRequest({
        gqPositionId,
        message: 'message',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.SEND_RECALCULATE_SQV);
    });
    test('should set sendRecalculateSqvRequestLoading to false', () => {
      const fakeState: Rfq4ProcessState = {
        ...rfq4ProcessesMock,
        processLoading: ProcessLoading.SEND_RECALCULATE_SQV,
      };

      const action = Rfq4ProcessActions.sendRecalculateSqvRequestSuccess({
        gqPositionId,
        rfq4Status: Rfq4Status.IN_PROGRESS,
      });
      const state = rfq4ProcessFeature.reducer(fakeState, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
    });
    test('should set sendRecalculateSqvRequestLoading to false when error', () => {
      const action = Rfq4ProcessActions.sendRecalculateSqvRequestError({
        error: 'an Error',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.processLoading).toEqual(ProcessLoading.NONE);
    });
  });

  describe('getSapMaintainerUserIds', () => {
    test('should set sapMaintainersLoading to true', () => {
      const action = Rfq4ProcessActions.getSapMaintainerUserIds();
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sapMaintainersLoading).toEqual(true);
    });
    test('should set sapMaintainersLoading to false when error', () => {
      const action = Rfq4ProcessActions.getSapMaintainerUserIdsError({
        error: 'an Error',
      });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sapMaintainersLoading).toEqual(false);
    });
  });
  describe('getActiveDirectoryUserOfSapMaintainerUserIds', () => {
    test('should set sapMaintainersLoading to false', () => {
      const action =
        Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsSuccess({
          maintainers: [
            {
              userId: 'userId',
              firstName: 'firstName',
              lastName: 'lastName',
              mail: 'mail',
            },
          ],
        });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sapMaintainersLoading).toEqual(false);
    });
    test('should set sapMaintainersLoading to false and set sapMaintainers', () => {
      const action =
        Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsSuccess({
          maintainers: [
            {
              userId: 'userId',
              firstName: 'firstName',
              lastName: 'lastName',
              mail: 'mail',
            },
          ],
        });
      const state = rfq4ProcessFeature.reducer(
        {
          ...rfq4ProcessesMock,
          sapMaintainers: [
            {
              userId: 'userId',
              firstName: null as string,
              lastName: null as string,
              mail: null as string,
            },
          ],
        },
        action
      );

      expect(state.sapMaintainers).toEqual([
        {
          userId: 'userId',
          firstName: 'firstName',
          lastName: 'lastName',
          mail: 'mail',
        },
      ]);
    });
    test('should set sapMaintainersLoading to false when error', () => {
      const action =
        Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsError({
          error: 'an Error',
        });
      const state = rfq4ProcessFeature.reducer(rfq4ProcessesMock, action);

      expect(state.sapMaintainersLoading).toEqual(false);
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

  describe('extraSelectors', () => {
    test('getValidMaintainers should return maintainers with firstName and lastName', () => {
      const result = rfq4ProcessFeature.getValidMaintainers.projector([
        { userId: 'any', firstName: null, lastName: null },
        { userId: 'valid', firstName: 'John', lastName: 'Doe' },
      ]);

      expect(result).toEqual([
        { userId: 'valid', firstName: 'John', lastName: 'Doe' },
      ]);
    });
  });
});
