import { QuotationDetail } from '@gq/shared/models';
import { ActiveDirectoryUser } from '@gq/shared/models/user.model';
import {
  ActionCreator,
  createFeature,
  createReducer,
  createSelector,
  on,
  ReducerTypes,
} from '@ngrx/store';

import { ActiveCaseState } from '../active-case/active-case.reducer';
import { Rfq4ProcessActions } from './rfq-4-process.actions';

export enum ProcessLoading {
  NONE = 'None',
  FIND_CALCULATORS = 'Find calculators',
  SEND_RECALCULATE_SQV = 'Send recalculate sqv',
  REOPEN_RECALCULATION = 'Reopen recalculation',
  CANCEL_RECALCULATION = 'Cancel recalculation',
}

const RFQ_4_PROCESS_FEATURE_KEY = 'rfq4Processes';
export interface Rfq4ProcessState {
  gqId: number;
  gqPositionId: string;
  processLoading: ProcessLoading;
  foundCalculators: string[];
  sapMaintainersLoading: boolean;
  sapMaintainers: ActiveDirectoryUser[];
}

export const initialState: Rfq4ProcessState = {
  gqId: undefined,
  gqPositionId: undefined,
  processLoading: ProcessLoading.NONE,
  foundCalculators: [],
  sapMaintainers: [],
  sapMaintainersLoading: false,
};

export const rfq4ProcessFeature = createFeature({
  name: RFQ_4_PROCESS_FEATURE_KEY,
  reducer: createReducer(
    initialState,
    on(
      Rfq4ProcessActions.findCalculators,
      (state, { gqPositionId }): Rfq4ProcessState => ({
        ...state,
        gqPositionId,
        processLoading: ProcessLoading.FIND_CALCULATORS,
      })
    ),
    on(
      Rfq4ProcessActions.findCalculatorsSuccess,
      (state, { foundCalculators }): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        foundCalculators,
        processLoading: ProcessLoading.NONE,
      })
    ),
    on(
      Rfq4ProcessActions.findCalculatorsError,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        processLoading: ProcessLoading.NONE,
        foundCalculators: [],
      })
    ),
    on(
      Rfq4ProcessActions.clearCalculators,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        foundCalculators: [],
      })
    ),
    on(
      Rfq4ProcessActions.sendRecalculateSqvRequest,
      (state, { gqPositionId }): Rfq4ProcessState => ({
        ...state,
        gqPositionId,
        processLoading: ProcessLoading.SEND_RECALCULATE_SQV,
      })
    ),
    on(
      Rfq4ProcessActions.sendRecalculateSqvRequestSuccess,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        processLoading: ProcessLoading.NONE,
      })
    ),
    on(
      Rfq4ProcessActions.sendRecalculateSqvRequestError,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        processLoading: ProcessLoading.NONE,
      })
    ),
    on(
      Rfq4ProcessActions.sendReopenRecalculationRequest,
      (state, { gqPositionId }): Rfq4ProcessState => ({
        ...state,
        gqPositionId,
        processLoading: ProcessLoading.REOPEN_RECALCULATION,
      })
    ),
    on(
      Rfq4ProcessActions.sendReopenRecalculationRequestSuccess,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        processLoading: ProcessLoading.NONE,
      })
    ),
    on(
      Rfq4ProcessActions.sendReopenRecalculationRequestError,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        processLoading: ProcessLoading.NONE,
      })
    ),
    on(
      Rfq4ProcessActions.getSapMaintainerUserIds,
      (state): Rfq4ProcessState => ({
        ...state,
        sapMaintainersLoading: true,
      })
    ),
    on(
      Rfq4ProcessActions.getSapMaintainerUserIdsSuccess,
      (state, { maintainerUserIds }): Rfq4ProcessState => ({
        ...state,
        sapMaintainers: maintainerUserIds.map((maintainer) => ({
          userId: maintainer,
          firstName: null as string,
          lastName: null as string,
          mail: null as string,
        })),
        // maintainers loading stays true
        // activeDirectory userInfo will be requested afterwards
        sapMaintainersLoading: true,
      })
    ),
    on(
      Rfq4ProcessActions.getSapMaintainerUserIdsError,
      (state): Rfq4ProcessState => ({
        ...state,
        sapMaintainersLoading: false,
        sapMaintainers: [],
      })
    ),
    on(
      Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsSuccess,
      (state, { maintainers }): Rfq4ProcessState => ({
        ...state,
        sapMaintainersLoading: false,
        // update data of maintainers that are already stored
        sapMaintainers: state.sapMaintainers.map((maintainer) => {
          const foundMaintainer = maintainers.find(
            (m) => m.userId.toLowerCase() === maintainer.userId.toLowerCase()
          );
          // if found, merge the data
          // if not found, return the original maintainer

          return foundMaintainer
            ? { ...maintainer, ...foundMaintainer }
            : maintainer;
        }),
      })
    ),
    on(
      Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsError,
      (state): Rfq4ProcessState => ({
        ...state,
        sapMaintainersLoading: false,
      })
    ),
    on(
      Rfq4ProcessActions.clearSapMaintainers,
      (state): Rfq4ProcessState => ({
        ...state,
        sapMaintainers: [],
      })
    ),
    on(
      Rfq4ProcessActions.sendCancelProcess,
      (state, { gqPositionId }): Rfq4ProcessState => ({
        ...state,
        gqPositionId,
        processLoading: ProcessLoading.CANCEL_RECALCULATION,
      })
    ),
    on(
      Rfq4ProcessActions.sendCancelProcessSuccess,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        processLoading: ProcessLoading.NONE,
      })
    ),
    on(
      Rfq4ProcessActions.sendCancelProcessError,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        processLoading: ProcessLoading.NONE,
      })
    )
  ),
  extraSelectors: ({ selectSapMaintainers, selectProcessLoading }) => {
    const getValidMaintainers = createSelector(
      selectSapMaintainers,
      (maintainers: ActiveDirectoryUser[]) =>
        maintainers.filter(
          (maintainer) => maintainer.firstName && maintainer.lastName
        )
    );

    const isProcessLoading = createSelector(
      selectProcessLoading,
      (process: ProcessLoading) => process !== ProcessLoading.NONE
    );

    return { getValidMaintainers, isProcessLoading };
  },
});

export const RfqProcessRequestSuccessReducer: ReducerTypes<
  ActiveCaseState,
  ActionCreator[]
> = on(
  Rfq4ProcessActions.sendRecalculateSqvRequestSuccess,
  Rfq4ProcessActions.sendCancelProcessSuccess,
  Rfq4ProcessActions.sendReopenRecalculationRequestSuccess,
  (
    state: ActiveCaseState,
    { gqPositionId, rfqProcessResponse }
  ): ActiveCaseState => ({
    ...state,
    quotation: {
      ...state.quotation,
      quotationDetails: updateQuotationDetails(
        state.quotation.quotationDetails,
        gqPositionId,
        (qd) => ({
          ...qd,
          rfq4: {
            ...qd.rfq4,
            rfq4Status: rfqProcessResponse.processVariables.rfq4Status,
            rfq4Id: rfqProcessResponse.processVariables.rfqId ?? qd.rfq4.rfq4Id,
            allowedToReopen: rfqProcessResponse.allowedToReopen,
          },
        })
      ),
    },
  })
);

function updateQuotationDetails(
  quotationDetails: QuotationDetail[],
  gqPositionId: string,
  updateFn: (qd: QuotationDetail) => QuotationDetail
): QuotationDetail[] {
  return quotationDetails.map((qd) =>
    qd.gqPositionId === gqPositionId ? updateFn(qd) : qd
  );
}
