import * as fromActiveCaseSelectors from '@gq/core/store/active-case/active-case.selectors';
import { QuotationDetail } from '@gq/shared/models';
import { RfqData } from '@gq/shared/models/rfq-data.interface';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { RfqDataActions } from './rfq-data.actions';

const RFQ_DATA_DETAILS_KEY = 'rfqData';

export interface RfqDataState {
  rfqData: RfqData;
  rfqDataLoading: boolean;
  errorMessage: string;
}
export const initialState: RfqDataState = {
  rfqData: undefined,
  rfqDataLoading: false,
  errorMessage: undefined,
};

export const rfqDataFeature = createFeature({
  name: RFQ_DATA_DETAILS_KEY,
  reducer: createReducer(
    initialState,
    on(
      RfqDataActions.getRfqData,
      (): RfqDataState => ({
        ...initialState,
        rfqDataLoading: true,
      })
    ),
    on(
      RfqDataActions.getRfqDataSuccess,
      (state: RfqDataState, { item }): RfqDataState => ({
        ...state,
        rfqData: item,
        rfqDataLoading: false,
        errorMessage: undefined,
      })
    ),
    on(
      RfqDataActions.getRfqDataFailure,
      (state: RfqDataState, { errorMessage }): RfqDataState => ({
        ...state,
        errorMessage,
        rfqDataLoading: false,
      })
    ),
    on(
      RfqDataActions.resetRfqData,
      (): RfqDataState => ({
        ...initialState,
      })
    )
  ),
  extraSelectors: ({ selectRfqData }) => {
    const getRfqDataUpdateAvl = createSelector(
      selectRfqData,
      fromActiveCaseSelectors.getSelectedQuotationDetail,
      (rfqData: RfqData, selectedQuotationDetail: QuotationDetail) =>
        rfqData &&
        (selectedQuotationDetail.rfqData.sqv !== rfqData.sqv ||
          selectedQuotationDetail.rfqData.status !== rfqData.status ||
          selectedQuotationDetail.rfqData.productionPlant.plantNumber !==
            rfqData.productionPlantNumber)
    );

    return { getRfqDataUpdateAvl };
  },
});
