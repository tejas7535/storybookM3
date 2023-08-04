import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';

export enum CaseViewRoutePath {
  BasePath = '',
  ActiveTabPath = ':quotationTab',
  DefaultPath = `${QuotationTab.ACTIVE}`,
}
