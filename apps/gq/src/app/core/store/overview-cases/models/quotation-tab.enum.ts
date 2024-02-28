import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';

export enum QuotationTab {
  ACTIVE = 'QUOTATION',
  IN_APPROVAL = 'IN_APPROVAL',
  TO_APPROVE = 'TO_APPROVE',
  ARCHIVED = 'ARCHIVED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SHARED = 'SHARED',
}

export const QuotationStatusByQuotationTab = new Map<
  QuotationTab,
  QuotationStatus
>([
  [QuotationTab.ACTIVE, QuotationStatus.ACTIVE],
  [QuotationTab.IN_APPROVAL, QuotationStatus.IN_APPROVAL],
  [QuotationTab.TO_APPROVE, QuotationStatus.IN_APPROVAL],
  [QuotationTab.ARCHIVED, QuotationStatus.ARCHIVED],
  [QuotationTab.APPROVED, QuotationStatus.APPROVED],
  [QuotationTab.REJECTED, QuotationStatus.REJECTED],
]);
