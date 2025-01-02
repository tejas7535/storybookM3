import { QuotationToDateActions } from '@gq/core/store/quotation-to-date/quotation-to-date.actions';
import { QuotationToDate } from '@gq/core/store/quotation-to-date/quotation-to-date.model';
import { createFeature, createReducer, on } from '@ngrx/store';

const QUOTATION_TO_DATE_KEY = 'quotationToDate';

export interface QuotationToDateState {
  quotationToDate: QuotationToDate;
  quotationToDateLoading: boolean;
  errorMessage: string;
}

export const initialState: QuotationToDateState = {
  quotationToDate: null,
  quotationToDateLoading: false,
  errorMessage: undefined,
};

export const quotationToDateFeature = createFeature({
  name: QUOTATION_TO_DATE_KEY,
  reducer: createReducer(
    initialState,
    on(
      QuotationToDateActions.getQuotationToDate,
      (state: QuotationToDateState): QuotationToDateState => ({
        ...state,
        quotationToDateLoading: true,
      })
    ),
    on(
      QuotationToDateActions.getQuotationToDateSuccess,
      (
        state: QuotationToDateState,
        { quotationToDate }
      ): QuotationToDateState => ({
        ...state,
        quotationToDate,
        quotationToDateLoading: false,
        errorMessage: initialState.errorMessage,
      })
    ),
    on(
      QuotationToDateActions.getQuotationToDateFailure,
      (
        state: QuotationToDateState,
        { errorMessage }
      ): QuotationToDateState => ({
        ...state,
        quotationToDate: null,
        quotationToDateLoading: false,
        errorMessage,
      })
    )
  ),
});
