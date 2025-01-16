import { ACTIVE_CASE_STATE_MOCK } from '../../../../../testing/mocks';
import {
  QUOTATION_METADATA_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks/models/quotation/';
import { activeCaseFeature } from '../active-case.reducer';
import { QuotationMetadataActions } from './quotation-metadata.action';

describe('Quotation Meta Data Reducer', () => {
  describe('updateQuotationMetaData', () => {
    test('should update quotation meta data', () => {
      const action = QuotationMetadataActions.updateQuotationMetadata({
        quotationMetadata: QUOTATION_METADATA_MOCK,
      });

      const state = activeCaseFeature.reducer(ACTIVE_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...ACTIVE_CASE_STATE_MOCK,
        quotationMetadataLoading: true,
      });
    });

    test('should update quotation meta data success', () => {
      const action = QuotationMetadataActions.updateQuotationMetadataSuccess({
        quotation: QUOTATION_MOCK,
      });

      const state = activeCaseFeature.reducer(
        {
          ...ACTIVE_CASE_STATE_MOCK,
          quotation: undefined,
          quotationMetadataLoading: true,
        },
        action
      );

      expect(state).toEqual({
        ...ACTIVE_CASE_STATE_MOCK,
        quotationMetadataLoading: false,
        quotation: QUOTATION_MOCK,
      });
    });

    test('should update quotation meta data failure', () => {
      const action = QuotationMetadataActions.updateQuotationMetadataFailure({
        errorMessage: 'Error',
      });

      const state = activeCaseFeature.reducer(
        { ...ACTIVE_CASE_STATE_MOCK, quotationMetadataLoading: true },
        action
      );

      expect(state).toEqual({
        ...ACTIVE_CASE_STATE_MOCK,
        quotationMetadataLoading: false,
        quotationMetadataLoadingErrorMessage: 'Error',
      });
    });
  });
});
