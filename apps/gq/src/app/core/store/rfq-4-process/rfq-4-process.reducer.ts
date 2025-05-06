import { ActiveDirectoryUser } from '@gq/shared/models/user.model';
import {
  ActionCreator,
  createFeature,
  createReducer,
  on,
  ReducerTypes,
} from '@ngrx/store';

import { ActiveCaseState } from '../active-case/active-case.reducer';
import { Rfq4ProcessActions } from './rfq-4-process.actions';

const RFQ_4_PROCESS_FEATURE_KEY = 'rfq4Processes';
export interface Rfq4ProcessState {
  gqId: number;
  gqPositionId: string;
  findCalculatorsLoading: boolean;
  sendRecalculateSqvRequestLoading: boolean;
  foundCalculators: string[];
  sapMaintainersLoading: boolean;
  sapMaintainers: ActiveDirectoryUser[];
  sendEmailRequestToMaintainCalculatorsLoading: boolean;
}

export const initialState: Rfq4ProcessState = {
  gqId: undefined,
  gqPositionId: undefined,
  findCalculatorsLoading: false,
  sendRecalculateSqvRequestLoading: false,
  foundCalculators: [],
  sapMaintainers: [],
  sapMaintainersLoading: false,
  sendEmailRequestToMaintainCalculatorsLoading: false,
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
        findCalculatorsLoading: true,
      })
    ),
    on(
      Rfq4ProcessActions.findCalculatorsSuccess,
      (state, { foundCalculators }): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        foundCalculators,
        findCalculatorsLoading: false,
      })
    ),
    on(
      Rfq4ProcessActions.findCalculatorsError,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        findCalculatorsLoading: false,
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
        sendRecalculateSqvRequestLoading: true,
      })
    ),
    on(
      Rfq4ProcessActions.sendRecalculateSqvRequestSuccess,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        sendRecalculateSqvRequestLoading: false,
      })
    ),
    on(
      Rfq4ProcessActions.sendRecalculateSqvRequestError,
      (state): Rfq4ProcessState => ({
        ...state,
        gqPositionId: undefined,
        sendRecalculateSqvRequestLoading: false,
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
    )
  ),
});

export const SendRecalculateSqvRequestSuccessReducer: ReducerTypes<
  ActiveCaseState,
  ActionCreator[]
> = on(
  Rfq4ProcessActions.sendRecalculateSqvRequestSuccess,
  (state: ActiveCaseState, { gqPositionId, rfq4Status }): ActiveCaseState => ({
    ...state,
    quotation: {
      ...state.quotation,
      quotationDetails: state.quotation.quotationDetails.map((qd) =>
        qd.gqPositionId === gqPositionId
          ? {
              ...qd,
              detailCosts: {
                ...qd.detailCosts,
                rfq4Status,
              },
            }
          : qd
      ),
    },
  })
);
