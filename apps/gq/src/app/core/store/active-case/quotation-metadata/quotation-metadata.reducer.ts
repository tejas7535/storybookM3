import { ActionCreator, on, ReducerTypes } from '@ngrx/store';

import { ActiveCaseState } from '../active-case.reducer';
import { sortQuotationDetails } from '../active-case.utils';
import { QuotationMetadataActions } from './quotation-metadata.action';

export const QuotationMetadataReducers: ReducerTypes<
  ActiveCaseState,
  ActionCreator[]
>[] = [
  on(
    QuotationMetadataActions.updateQuotationMetadata,
    (state: ActiveCaseState) => ({
      ...state,
      quotationMetadataLoading: true,
    })
  ),
  on(
    QuotationMetadataActions.updateQuotationMetadataSuccess,
    (state: ActiveCaseState, { quotation }) => ({
      ...state,
      quotation: {
        ...quotation,
        quotationDetails: sortQuotationDetails(quotation.quotationDetails),
      },
      quotationMetadataLoading: false,
      quotationMetadataLoadingErrorMessage: undefined,
    })
  ),
  on(
    QuotationMetadataActions.updateQuotationMetadataFailure,
    (state: ActiveCaseState, { errorMessage }) => ({
      ...state,
      quotationMetadataLoading: false,
      quotationMetadataLoadingErrorMessage: errorMessage,
    })
  ),
];
