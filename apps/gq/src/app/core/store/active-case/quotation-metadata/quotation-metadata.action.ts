import { Quotation } from '@gq/shared/models';
import { QuotationMetadata } from '@gq/shared/models/quotation/quotation-metadata.interface';
import { createActionGroup, props } from '@ngrx/store';

export const QuotationMetadataActions = createActionGroup({
  source: 'Quotation Metadata',
  events: {
    'Update Quotation Metadata': props<{
      quotationMetadata: QuotationMetadata;
    }>(),
    'Update Quotation Metadata Success': props<{
      quotation: Quotation;
    }>(),
    'Update Quotation Metadata Failure': props<{
      errorMessage: string;
    }>(),
  },
});
