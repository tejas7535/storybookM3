import { ExcelStyle } from '@ag-grid-community/all-modules';

interface ExcelStyleMap {
  [name: string]: ExcelStyle;
}
const greenBackground = '00893D';
const whiteText = 'ffffff';
const greyBackground = 'BFBFBF';

export const excelStyleObjects: ExcelStyleMap = {
  keepLeadingZero: {
    id: 'keepLeadingZero',
    dataType: 'String',
  },
  excelText: { id: 'excelText', font: { size: 12 } },
  excelTextBold: { id: 'excelTextBold', font: { size: 12, bold: true } },
  excelQuotationSummaryLabel: {
    id: 'excelQuotationSummaryTitle',
    font: { size: 12, color: whiteText, bold: true },
    interior: {
      color: greenBackground,
      pattern: 'Solid',
      patternColor: greenBackground,
    },
    borders: {
      borderBottom: { weight: 1 },
      borderLeft: { weight: 1 },
      borderRight: { weight: 1 },
      borderTop: { weight: 1 },
    },
  },
  excelCustomerOverviewLabel: {
    id: 'excelCustomerOverviewLabel',
    font: { size: 12, color: whiteText, bold: true },
    interior: {
      color: greyBackground,
      pattern: 'Solid',
      patternColor: greyBackground,
    },
    borders: {
      borderBottom: { weight: 1 },
      borderLeft: { weight: 1 },
      borderRight: { weight: 1 },
      borderTop: { weight: 1 },
    },
  },
  excelTextBorder: {
    id: 'excelTextBorder',
    font: { size: 12 },
    borders: {
      borderBottom: { weight: 1 },
      borderLeft: { weight: 1 },
      borderRight: { weight: 1 },
      borderTop: { weight: 1 },
    },
  },
  excelTextBorderBold: {
    id: 'excelTextBorderBold',
    font: { size: 12, bold: true },
    borders: {
      borderBottom: { weight: 1 },
      borderLeft: { weight: 1 },
      borderRight: { weight: 1 },
      borderTop: { weight: 1 },
    },
  },
};

export const excelStyles: ExcelStyle[] = Object.values(excelStyleObjects);
