import { BearinxOnlineResult } from '@ea/core/services/bearinx-result.interface';
import { FrictionCalculationResult } from '@ea/core/store/models';

export const FILTER_INPUT_FIELDS_MOCK = {
  apiResponse: {
    subordinates: [
      {
        titleID: 'STRING_OUTP_RESULTS',
        identifier: 'block',
        subordinates: [
          {
            titleID: 'STRING_OUTP_CO2E',
            identifier: 'block',
            subordinates: [
              {
                titleID: 'STRING_OUTP_CO2E_CALCULATION',
                identifier: 'variableBlock',
                subordinates: [
                  {
                    identifier: 'variableLine',
                    designation: 'CO2-emission',
                    subordinates: [],
                    value: '123.45',
                    unit: 'kg',
                  },
                ],
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
  } as Partial<BearinxOnlineResult>,
  expectedResult: {
    co2_downstream: { value: 123.45, unit: 'kg' },
    reportInputSuborinates: {
      inputSubordinates: [
        {
          title: 'Test Parent Block',
          titleID: 'STRING_OUTP_BEARING_DATA',
          hasNestedStructure: true,
          subItems: [
            {
              hasNestedStructure: false,
              title: 'Sub Visible',
              titleID: 'STRING_OUTP_LUBRICATION',
              subItems: [],
            },
          ],
        },
      ],
    },
    reportMessages: {
      messages: [
        {
          title: 'Error title',
          item: {
            subItems: [],
          },
        },
        {
          title: 'Warning title',
          item: {
            subItems: [],
          },
        },
      ],
    },
  } as FrictionCalculationResult,
};
