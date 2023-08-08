import { BearinxOnlineResult } from '@ea/core/services/bearinx-result.interface';
import { CatalogCalculationResult } from '@ea/core/store/models';

export const API_RESULT_MOCK: Partial<BearinxOnlineResult> = {
  subordinates: [
    {
      titleID: 'STRING_OUTP_RESULTS',
      identifier: 'block',
      subordinates: [
        {
          titleID: 'STRING_OUTP_BEARING_BEHAVIOUR',
          identifier: 'variableBlock',
          subordinates: [
            {
              abbreviation: 'Lh10',
              identifier: 'variableLine',
              subordinates: [],
              value: '123.45',
              unit: 'h',
            },
          ],
        },
        {
          titleID: 'STRING_OUTP_ROLLOVER_FREQUENCIES',
          identifier: 'variableBlock',
          subordinates: [
            {
              abbreviation: 'BPFO',
              identifier: 'variableLine',
              subordinates: [],
              value: '123.45',
              unit: '1/s',
            },
            {
              abbreviation: 'BPFI',
              identifier: 'variableLine',
              subordinates: [],
              value: '123.45',
              unit: '1/s',
            },
            {
              abbreviation: 'BSF',
              identifier: 'variableLine',
              subordinates: [],
              value: '123.45',
              unit: '1/s',
            },
            {
              abbreviation: 'RPFB',
              identifier: 'variableLine',
              subordinates: [],
              value: '123.45',
              unit: '1/s',
            },
            {
              abbreviation: 'FTF',
              identifier: 'variableLine',
              subordinates: [],
              value: '123.45',
              unit: '1/s',
            },
          ],
        },
      ],
    },
    {
      identifier: 'block',
      subordinates: [
        {
          designation: 'Designation',
          identifier: 'variableLine',
          value: '6210',
        },
        {
          designation: 'Series',
          identifier: 'variableLine',
          value: '5510',
        },
        {
          identifier: 'block',
          title: 'Bearing internal data',
          titleID: 'STRING_OUTP_CALCULATION_SELECTION',
          subordinates: [],
        },
        {
          identifier: 'block',
          title: 'Test Parent Block',
          titleID: 'STRING_OUTP_BEARING_DATA',
          subordinates: [
            {
              identifier: 'variableBlock',
              title: 'Sub Visible',
              titleID: 'STRING_OUTP_LUBRICATION',
              subordinates: [],
            },
            {
              identifier: 'variableBlock',
              title: 'Sub Hidden',
              titleID: 'STRING_OUT_UNKNOWN',
              subordinates: [],
            },
          ],
        },
      ],
      title: 'Input',
      titleID: 'STRING_OUTP_INPUT',
    },
    {
      identifier: 'block',
      title: 'Error title',
      subordinates: [],
    },
    {
      identifier: 'block',
      title: 'Warning title',
      subordinates: [],
    },
  ],
};

export const EXPECTED_RESULT: CatalogCalculationResult = {
  lh10: { value: '123.45', unit: 'h' },
  BPFO: { value: '123.45', unit: '1/s' },
  BPFI: { value: '123.45', unit: '1/s' },
  BSF: { value: '123.45', unit: '1/s' },
  RPFB: { value: '123.45', unit: '1/s' },
  FTF: { value: '123.45', unit: '1/s' },
};
