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
}

export const initialState: Rfq4ProcessState = {
  gqId: undefined,
  gqPositionId: undefined,
  findCalculatorsLoading: false,
  sendRecalculateSqvRequestLoading: false,
  foundCalculators: [],
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
