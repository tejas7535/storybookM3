import { ExcelStyle } from 'ag-grid-community';

export const excelStyles: ExcelStyle[] = [
  // The base style, red font.
  {
    id: 'header',
    font: {
      bold: true,
    },
  },
  {
    id: 'hint',
    borders: {
      borderBottom: {
        lineStyle: 'Double',
      },
    },
    alignment: {
      wrapText: true,
    },
  },
];
