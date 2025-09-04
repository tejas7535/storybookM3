export interface GreasePdfConcept1Item {
  conceptTitle: string;
  settingArrow: string;
  notes: string;
}

export interface GreasePdfConcept1Result {
  title: string;
  concept60ml: GreasePdfConcept1Item;
  concept125ml: GreasePdfConcept1Item;
}

export interface GreasePdfResultItem {
  itemTitle: string;
  items: string[];
}

export interface GreasePdfResultTable {
  title: string;
  subTitle: string;
  items: GreasePdfResultItem[];
  concept1?: GreasePdfConcept1Result;
  isRecommended?: boolean;
}

export const enum BadgeStyle {
  Primary = 'primary',
  Error = 'error',
  Success = 'success',
  Warning = 'warning',
  Recommended = 'recommended',
  Miscible = 'miscible',
}

export interface PDFGreaseResultSectionItem {
  title: string;
  value: string;
  secondaryValue?: string;
  badgeClass?: BadgeStyle;
  concept1Data?: PDFConceptInfo;
}

export interface PDFConceptInfo {
  emptyDuration: string;
  arrowSetting: string;
  duration: number;
  arrowImage?: string;
}
export interface PDFGreaseResultSection {
  sectionTitle: string;
  values: PDFGreaseResultSectionItem[];
  concept1?: boolean;
}

export interface PDFPartnerVersionHeaderInfo {
  title: string;
  schaefflerLogo: string;
}

export interface PDFGreaseReportResult {
  sections: PDFGreaseResultSection[];
  isSufficient: boolean;
  mainTitle: string;
  subTitle: string;
  qrCode: string;
  recommended?: string;
  miscible?: string;
  partnerVersionInfo?: PDFPartnerVersionHeaderInfo;
}
