import { ResultReportLargeItem } from '@ea/calculation/calculation-result-report-large-items/result-report-large-item';
import { CalculationResultReportInput } from '@ea/core/store/models';
import { CalculationResultReportMessage } from '@ea/core/store/models/calculation-result-report-message.model';
import jsPDF from 'jspdf';

export interface DocumentData {
  reportHeading: string;
  generationDate: string;
  documentDisclaimer: string;
  calculationMethodsHeading: string;
  inputSectionHeading: string;
  co2disclaimer: string;
  noticeHeading: string;
  page: string;
  bearingLink: {
    text: string;
    link: string;
  };
}

export interface GeneratedDocument {
  designation: string;
  document: jsPDF;
}

export const DefaultDocumentColors = {
  chipColor: '#f0f6fa',
  chipTextColor: '#3198b5',
  mainGreenColor: '#EDF7F1', // light green
  darkGreenColor: '#00893D',
  secondaryTextColor: '#000000',
  tableBorderTextColor: '#C9C5C4',
} as const;

export const DocumentFonts = {
  family: 'NotoSans',
  style: {
    bold: 'bold',
    normal: 'normal',
  },
};

export const DefaultDocumentDimensions = {
  pageMargin: 21,
  reportTitleFontSize: 16,
  sectionTitleFontSize: 11,
  textFontSize: 9,
  disclaimerFontSize: 7,
  blockSpacing: 12,
};

export interface ComponentRenderProps {
  dimensions: typeof DefaultDocumentDimensions;
  colors: typeof DefaultDocumentColors;
  fonts: typeof DocumentFonts;
}

export const DefaultComponentRenderProps: ComponentRenderProps = {
  fonts: DocumentFonts,
  colors: DefaultDocumentColors,
  dimensions: DefaultDocumentDimensions,
};

export interface InputTableOptions {
  labelWidth?: number;
  header?: string;
  ignoreLabelWidth?: boolean;
  headerSpacing: Spacing;
  labelSpacing: Spacing;
  valueSpacing: Spacing;
}

export interface ResultTableAttributes {
  headerSpacing: Spacing;
  cellPadding: Spacing;
  divierSpacing: Spacing;
  divierColor: string;
  borderColor: string;
}

export interface Spacing {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

export interface ResultBlock<T> {
  icon?: string;
  header: string;
  data: T;
}

export interface ResultReport {
  designation: string;
  calculationMethods: string[];
  calculationInput: CalculationResultReportInput[];
  upstreamEmissions?: ResultBlock<ResultReportLargeItem>;
  frictionalPowerloss?: ResultBlock<any>;
  lubricationInfo?: ResultBlock<ResultReportLargeItem[]>;
  overrollingFrequency?: ResultBlock<ResultReportLargeItem[]>;
  ratingLife?: ResultBlock<ResultReportLargeItem[]>;
  notices: ResultBlock<CalculationResultReportMessage[]>;
}
