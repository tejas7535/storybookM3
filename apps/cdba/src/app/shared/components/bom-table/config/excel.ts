import { ExcelStyle } from 'ag-grid-community';

export const createIndentExcelStyles = (): any => {
  const result = [];

  for (let i = 0; i < 15; i += 1) {
    result.push({
      id: `indent-${i}`,
      alignment: {
        indent: i + 1,
      },
      dataType: 'string',
    });
  }

  return result;
};

export const BOM_TABLE_EXCEL_STYLES: ExcelStyle[] = [
  ...createIndentExcelStyles(),
  {
    id: 'header',
    alignment: { vertical: 'Center' },
    interior: {
      color: '#AEAAAA',
      pattern: 'Solid',
    },
    borders: {
      borderBottom: {
        color: '#000',
        lineStyle: 'Continuous',
        weight: 1,
      },
      borderTop: {
        color: '#000',
        lineStyle: 'Continuous',
        weight: 1,
      },
    },
  },
  {
    id: 'prependedMetadata',
    interior: {
      color: '#D9D9D9',
      pattern: 'Solid',
    },
  },
  {
    id: 'stringType',
    dataType: 'String',
    alignment: {
      horizontal: 'Right',
    },
  },
  {
    id: 'floatingNumberType',
    numberFormat: {
      // https://customformats.com/
      format: '0.0####;-0.0####;0',
    },
  },
];
