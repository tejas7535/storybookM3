import { QuotationMetadata } from '@gq/shared/models/quotation/quotation-metadata.interface';

export interface QuotationNoteModalData {
  quotationMetadata: QuotationMetadata;
  isQuotationStatusActive: boolean;
}
