/* eslint-disable unicorn/no-null */
/* eslint-disable max-lines */
import {
  STRING_OUTP_BASIC_FREQUENCIES_FACTOR,
  VARIABLE_BLOCK,
  VARIABLE_LINE,
} from '@ea/core/services/bearinx-result.constant';
import { BearinxOnlineResult } from '@ea/core/services/bearinx-result.interface';
import {
  CalculationResultReportInput,
  CatalogCalculationResult,
} from '@ea/core/store/models';

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
  bearingBehaviour: {
    lh10: { value: '123.45', unit: 'h' },
  },
  loadcaseOverrollingFrequencies: [
    {
      BPFO: {
        value: '123.45',
        unit: '1/s',
        loadcaseName: undefined,
        title: 'BPFO',
      },
      BPFI: {
        value: '123.45',
        unit: '1/s',
        loadcaseName: undefined,
        title: 'BPFI',
      },
      BSF: {
        value: '123.45',
        unit: '1/s',
        loadcaseName: undefined,
        title: 'BSF',
      },
      RPFB: {
        value: '123.45',
        unit: '1/s',
        loadcaseName: undefined,
        title: 'RPFB',
      },
      FTF: {
        value: '123.45',
        unit: '1/s',
        loadcaseName: undefined,
        title: 'FTF',
      },
    },
  ],
};

export const API_INPUTS_MOCK: Partial<BearinxOnlineResult> = {
  subordinates: [
    {
      identifier: 'block',
      title: 'Input',
      titleID: 'STRING_OUTP_INPUT',
      subordinates: [
        {
          identifier: 'block',
          subordinates: [
            {
              identifier: 'table',
              data: {
                fields: ['apple', 'bannana', 'tomato'],
                items: [
                  [
                    {
                      field: 'apple',
                      value: 'delicious apple',
                      unit: 'kg',
                    },
                    {
                      field: 'bannana',
                      value: 'delicious bannana',
                      unit: 'qt',
                    },
                    {
                      field: 'tomato',
                      value: 'some cherry tomatoes',
                    },
                    {
                      field: 'resultValues.designation',
                      value: 'designation',
                    },
                  ],
                ],
                unitFields: [],
              },
              description: {
                identifier: 'textPairList',
                title: 'Table Explanations:',
                entries: [
                  ['apple: ', 'apple'],
                  ['bannana: ', 'bannana'],
                  ['tomato: ', 'tomato'],
                ],
              },
            },
          ],
          title: 'inner Block',
        },
        {
          identifier: VARIABLE_BLOCK,
          title: 'title variable Block 1',
          subordinates: [
            {
              identifier: VARIABLE_LINE,
              designation: 'reference rating life',
              value: 'nominal',
            },
          ],
        },
        {
          identifier: VARIABLE_BLOCK,
          title: 'Basic frequencies factor',
          titleID: STRING_OUTP_BASIC_FREQUENCIES_FACTOR,
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Overrolling frequency factor on outer ring',
              abbreviation: 'BPFFO',
              value: '4.1181',
            },
            {
              identifier: 'variableLine',
              designation: 'Overrolling frequency factor on inner ring',
              abbreviation: 'BPFFI',
              value: '5.8819',
            },
            {
              identifier: 'variableLine',
              designation: 'Overrolling frequency factor on rolling element',
              abbreviation: 'BSFF',
              value: '2.7465',
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Input data for all load cases',
          titleID: 'STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES',
          subordinates: [
            {
              identifier: 'table',
              title: 'Load case data',
              titleID: 'STRING_OUTP_LOADCASE_DATA',
              data: {
                fields: ['Des', 'q', '', 'n_i', 'T'],
                unitFields: [
                  null,
                  {
                    unit: '%',
                  },
                  null,
                  {
                    unit: '1/min',
                  },
                  {
                    unit: '°C',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Des',
                      value: 'Loadcase 1',
                    },
                    {
                      field: 'q',
                      value: '30.000',
                      unit: '%',
                    },
                    {
                      field: '',
                      value: 'rotating',
                    },
                    {
                      field: 'n_i',
                      value: '65.00',
                      unit: '1/min',
                    },
                    {
                      field: 'T',
                      value: '70',
                      unit: '°C',
                    },
                  ],
                  [
                    {
                      field: 'Des',
                      value: 'Loadcase 2 item',
                    },
                    {
                      field: 'q',
                      value: '30.000',
                      unit: '%',
                    },
                    {
                      field: '',
                      value: 'rotating',
                    },
                    {
                      field: 'n_i',
                      value: '36.00',
                      unit: '1/min',
                    },
                    {
                      field: 'T',
                      value: '70',
                      unit: '°C',
                    },
                  ],
                ],
              },
              description: {
                identifier: 'textPairList',
                title: 'Table Explanations:',
                entries: [
                  ['Des: ', 'Designation'],
                  ['q: ', 'Time portion'],
                  ['n_i: ', 'Speed'],
                  ['T: ', 'Mean operating temperature'],
                ],
              },
            },
            {
              identifier: 'table',
              title: 'Load',
              titleID: 'STRING_OUTP_LOAD',
              data: {
                fields: ['Des', 'Fr', 'Fa'],
                unitFields: [
                  null,
                  {
                    unit: 'N',
                  },
                  {
                    unit: 'N',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Des',
                      value: 'Loadcase 1',
                    },
                    {
                      field: 'Fr',
                      value: '65.0',
                      unit: 'N',
                    },
                    {
                      field: 'Fa',
                      value: '0.0',
                      unit: 'N',
                    },
                  ],
                  [
                    {
                      field: 'Des',
                      value: 'Loadcase 2 item',
                    },
                    {
                      field: 'Fr',
                      value: '55.0',
                      unit: 'N',
                    },
                    {
                      field: 'Fa',
                      value: '0.0',
                      unit: 'N',
                    },
                  ],
                ],
              },
              description: {
                identifier: 'textPairList',
                title: 'Table Explanations:',
                entries: [
                  ['Des: ', 'Designation'],
                  ['Fr: ', 'Radial load'],
                  ['Fa: ', 'Axial load'],
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};

export const API_RESULT_MULTIPLE_LOADCASES_MOCK: Partial<BearinxOnlineResult> =
  {
    subordinates: [
      {
        identifier: 'block',
        title: 'Input',
        titleID: 'STRING_OUTP_INPUT',
        subordinates: [
          {
            identifier: 'variableBlock',
            title: 'Bearing',
            titleID: 'STRING_OUTP_BEARING',
            subordinates: [
              {
                identifier: 'variableLine',
                designation: 'Designation',
                value: '6210-C-2HRS',
              },
              {
                identifier: 'variableLine',
                designation: 'Inside diameter',
                abbreviation: 'd',
                value: '50.000',
                unit: 'mm',
              },
              {
                identifier: 'variableLine',
                designation: 'Outside diameter',
                abbreviation: 'D',
                value: '90.000',
                unit: 'mm',
              },
              {
                identifier: 'variableLine',
                designation: 'Width',
                abbreviation: 'B',
                value: '20.000',
                unit: 'mm',
              },
              {
                identifier: 'variableLine',
                designation: 'Basic dynamic load rating',
                abbreviation: 'C',
                value: '38000',
                unit: 'N',
              },
              {
                identifier: 'variableLine',
                designation: 'Basic static load rating',
                abbreviation: 'C0',
                value: '23200',
                unit: 'N',
              },
              {
                identifier: 'variableLine',
                designation: 'Fatigue limit load',
                abbreviation: 'Cu',
                value: '1580',
                unit: 'N',
              },
              {
                identifier: 'variableLine',
                designation: 'Limiting speed',
                abbreviation: 'n_lim',
                value: '6500.0',
                unit: '1/min',
              },
              {
                identifier: 'variableLine',
                designation: 'Limiting speed, grease',
                abbreviation: 'n_lim_g',
                value: '9900.0',
                unit: '1/min',
              },
            ],
          },
          {
            identifier: 'variableBlock',
            title: 'Basic frequency factors related to 1/s',
            titleID: 'STRING_OUTP_BASIC_FREQUENCIES_FACTOR',
            subordinates: [
              {
                identifier: 'variableLine',
                designation: 'Overrolling frequency factor on outer ring',
                abbreviation: 'BPFFO',
                value: '4.0929',
              },
              {
                identifier: 'variableLine',
                designation: 'Overrolling frequency factor on inner ring',
                abbreviation: 'BPFFI',
                value: '5.9071',
              },
              {
                identifier: 'variableLine',
                designation: 'Overrolling frequency factor on rolling element',
                abbreviation: 'BSFF',
                value: '2.6652',
              },
              {
                identifier: 'variableLine',
                designation: 'Ring pass frequency factor on rolling element',
                abbreviation: 'RPFFB',
                value: '5.3304',
              },
              {
                identifier: 'variableLine',
                designation:
                  'Speed factor of rolling element set for rotating inner ring',
                abbreviation: 'FTFF_i',
                value: '0.4093',
              },
              {
                identifier: 'variableLine',
                designation:
                  'Speed factor of rolling element set for rotating outer ring',
                abbreviation: 'FTFF_o',
                value: '0.5907',
              },
            ],
          },
          {
            identifier: 'variableBlock',
            title: 'Lubrication data',
            titleID: 'STRING_OUTP_LUBRICATING_DATA',
            subordinates: [
              {
                identifier: 'variableLine',
                designation: 'Permitted lubricants',
                value: 'Only grease',
              },
              {
                identifier: 'variableLine',
                designation: 'Type of lubrication',
                value: 'grease',
              },
              {
                identifier: 'variableLine',
                designation: 'Type of grease',
                value: 'Arcanol MULTI2',
              },
              {
                identifier: 'variableLine',
                designation: 'Viscosity at 40°C',
                abbreviation: 'ny 40',
                value: '110.0',
                unit: 'mm²/s',
              },
              {
                identifier: 'variableLine',
                designation: 'Viscosity at 100°C',
                abbreviation: 'ny 100',
                value: '11.0',
                unit: 'mm²/s',
              },
              {
                identifier: 'variableLine',
                designation: 'Contamination',
                value: 'normal cleanliness',
              },
              {
                identifier: 'variableLine',
                designation: 'External heat flow',
                abbreviation: 'dQ/dt',
                value: '0.0',
                unit: 'kW',
              },
            ],
          },
          {
            identifier: 'variableBlock',
            title: 'Other conditions',
            titleID: 'STRING_OUTP_MISCELLANEOUS_DATA',
            subordinates: [
              {
                identifier: 'variableLine',
                designation: 'Ambient temperature',
                abbreviation: 't',
                value: '20.0',
                unit: '°C',
              },
              {
                identifier: 'variableLine',
                designation: 'Environmental influence',
                value: '0.8 (moderate)',
              },
              {
                identifier: 'variableLine',
                designation: 'Requisite reliability',
                value: '90 %',
              },
              {
                identifier: 'variableLine',
                designation: 'Condition of rotation',
                value: 'rotating inner ring',
              },
              {
                identifier: 'variableLine',
                designation: 'Clearance group',
                value: 'CN',
              },
            ],
          },
          {
            identifier: 'block',
            title: 'Input data for all load cases',
            titleID: 'STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES',
            subordinates: [
              {
                identifier: 'table',
                title: 'Load case data',
                titleID: 'STRING_OUTP_LOADCASE_DATA',
                data: {
                  fields: ['Des', 'q', '', 'n_i', 'T'],
                  unitFields: [
                    // eslint-disable-next-line unicorn/no-null
                    null,
                    {
                      unit: '%',
                    },
                    // eslint-disable-next-line unicorn/no-null
                    null,
                    {
                      unit: '1/min',
                    },
                    {
                      unit: '°C',
                    },
                  ],
                  items: [
                    [
                      {
                        field: 'Des',
                        value: 'loadcase1',
                      },
                      {
                        field: 'q',
                        value: '20.000',
                        unit: '%',
                      },
                      {
                        field: '',
                        value: 'rotating',
                      },
                      {
                        field: 'n_i',
                        value: '200.00',
                        unit: '1/min',
                      },
                      {
                        field: 'T',
                        value: '70',
                        unit: '°C',
                      },
                    ],
                    [
                      {
                        field: 'Des',
                        value: 'loadcase2',
                      },
                      {
                        field: 'q',
                        value: '20.000',
                        unit: '%',
                      },
                      {
                        field: '',
                        value: 'rotating',
                      },
                      {
                        field: 'n_i',
                        value: '200.00',
                        unit: '1/min',
                      },
                      {
                        field: 'T',
                        value: '70',
                        unit: '°C',
                      },
                    ],
                  ],
                },
                description: {
                  identifier: 'textPairList',
                  title: 'Table Explanations:',
                  entries: [
                    ['Des: ', 'Designation'],
                    ['q: ', 'Time portion'],
                    ['n_i: ', 'Speed'],
                    ['T: ', 'Mean operating temperature'],
                  ],
                },
              },
              {
                identifier: 'table',
                title: 'Load',
                titleID: 'STRING_OUTP_LOAD',
                data: {
                  fields: ['Des', 'Fr', 'Fa'],
                  unitFields: [
                    // eslint-disable-next-line unicorn/no-null
                    null,
                    {
                      unit: 'N',
                    },
                    {
                      unit: 'N',
                    },
                  ],
                  items: [
                    [
                      {
                        field: 'Des',
                        value: 'loadcase1',
                      },
                      {
                        field: 'Fr',
                        value: '200.0',
                        unit: 'N',
                      },
                      {
                        field: 'Fa',
                        value: '0.0',
                        unit: 'N',
                      },
                    ],
                    [
                      {
                        field: 'Des',
                        value: 'loadcase2',
                      },
                      {
                        field: 'Fr',
                        value: '200.0',
                        unit: 'N',
                      },
                      {
                        field: 'Fa',
                        value: '0.0',
                        unit: 'N',
                      },
                    ],
                  ],
                },
                description: {
                  identifier: 'textPairList',
                  title: 'Table Explanations:',
                  entries: [
                    ['Des: ', 'Designation'],
                    ['Fr: ', 'Radial load'],
                    ['Fa: ', 'Axial load'],
                  ],
                },
              },
            ],
          },
        ],
      },
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
            identifier: 'block',
            title: 'Results for load cases',
            titleID: 'STRING_OUTP_RESULTS_OF_LOADCASES',
            subordinates: [
              {
                identifier: 'table',
                title: 'Overrolling frequencies',
                titleID: 'STRING_OUTP_ROLLOVER_FREQUENCIES',
                data: {
                  fields: ['Load case', 'BPFO', 'BPFI', 'BSF', 'FTF'],
                  unitFields: [
                    // eslint-disable-next-line unicorn/no-null
                    null,
                    {
                      unit: '1/s',
                    },
                    {
                      unit: '1/s',
                    },
                    {
                      unit: '1/s',
                    },
                    {
                      unit: '1/s',
                    },
                  ],
                  items: [
                    [
                      {
                        field: 'Load case',
                        value: 'loadcase1',
                      },
                      {
                        field: 'BPFO',
                        value: '1',
                        unit: '1/s',
                      },
                      {
                        field: 'BPFI',
                        value: '1',
                        unit: '1/s',
                      },
                      {
                        field: 'BSF',
                        value: '1',
                        unit: '1/s',
                      },
                      {
                        field: 'FTF',
                        value: '1',
                        unit: '1/s',
                      },
                    ],
                    [
                      {
                        field: 'Load case',
                        value: 'loadcase2',
                      },
                      {
                        field: 'BPFO',
                        value: '2',
                        unit: '1/s',
                      },
                      {
                        field: 'BPFI',
                        value: '2',
                        unit: '1/s',
                      },
                      {
                        field: 'BSF',
                        value: '2',
                        unit: '1/s',
                      },
                      {
                        field: 'FTF',
                        value: '2',
                        unit: '1/s',
                      },
                    ],
                  ],
                },
                description: {
                  identifier: 'textPairList',
                  title: 'Table Explanations:',
                  entries: [
                    ['BPFO: ', 'Overrolling frequency on outer ring'],
                    ['BPFI: ', 'Overrolling frequency on inner ring'],
                    ['BSF: ', 'Overrolling frequency on rolling element'],
                    ['FTF: ', 'Speed of rolling element set'],
                  ],
                },
              },
              {
                identifier: 'table',
                title: 'Load factors and equivalent loads',
                titleID: 'STRING_OUTP_LOAD_FACTORS_AND_EQUIVALENT_LOADS',
                data: {
                  fields: ['Load case', 'P0', 'P_i'],
                  unitFields: [
                    // eslint-disable-next-line unicorn/no-null
                    null,
                    {
                      unit: 'N',
                    },
                    {
                      unit: 'N',
                    },
                  ],
                  items: [
                    [
                      {
                        field: 'Load case',
                        value: 'loadcase1',
                      },
                      {
                        field: 'P0',
                        value: '1',
                        unit: 'N',
                      },
                      {
                        field: 'P_i',
                        value: '1',
                        unit: 'N',
                      },
                    ],
                    [
                      {
                        field: 'Load case',
                        value: 'loadcase2',
                      },
                      {
                        field: 'P0',
                        value: '2',
                        unit: 'N',
                      },
                      {
                        field: 'P_i',
                        value: '2',
                        unit: 'N',
                      },
                    ],
                  ],
                },
                description: {
                  identifier: 'textPairList',
                  title: 'Table Explanations:',
                  entries: [
                    ['P0: ', 'Equivalent static load'],
                    ['P_i: ', 'Equivalent dynamic load'],
                  ],
                },
              },
              {
                identifier: 'table',
                title: 'Friction and thermally permissible speed',
                titleID: 'STRING_OUTP_FRICTION_AND_THERMALLY_PERMISSABLE_SPEED',
                data: {
                  fields: ['Load case', 'M0', 'M1', 'MR', 'NR', 'n_theta'],
                  unitFields: [
                    // eslint-disable-next-line unicorn/no-null
                    null,
                    {
                      unit: 'N mm',
                    },
                    {
                      unit: 'N mm',
                    },
                    {
                      unit: 'N mm',
                    },
                    {
                      unit: 'kW',
                    },
                    {
                      unit: '1/min',
                    },
                  ],
                  items: [
                    [
                      {
                        field: 'Load case',
                        value: 'loadcase1',
                      },
                      {
                        field: 'M0',
                        value: '1',
                        unit: 'N mm',
                      },
                      {
                        field: 'M1',
                        value: '1',
                        unit: 'N mm',
                      },
                      {
                        field: 'MR',
                        value: '1',
                        unit: 'N mm',
                      },
                      {
                        field: 'NR',
                        value: '1',
                        unit: 'kW',
                      },
                      {
                        field: 'n_theta',
                        value: '1',
                        unit: '1/min',
                      },
                    ],
                    [
                      {
                        field: 'Load case',
                        value: 'loadcase2',
                      },
                      {
                        field: 'M0',
                        value: '2',
                        unit: 'N mm',
                      },
                      {
                        field: 'M1',
                        value: '2',
                        unit: 'N mm',
                      },
                      {
                        field: 'MR',
                        value: '2',
                        unit: 'N mm',
                      },
                      {
                        field: 'NR',
                        value: '2',
                        unit: 'kW',
                      },
                      {
                        field: 'n_theta',
                        value: '2',
                        unit: '1/min',
                      },
                    ],
                  ],
                },
                description: {
                  identifier: 'textPairList',
                  title: 'Table Explanations:',
                  entries: [
                    ['M0: ', 'Speed-dependent frictional torque'],
                    ['M1: ', 'Load-dependent frictional torque'],
                    ['MR: ', 'Total frictional torque'],
                    ['NR: ', 'Total frictional power loss'],
                    ['n_theta: ', 'Thermally safe operating speed'],
                  ],
                },
              },
              {
                identifier: 'table',
                title: 'Lubrication',
                titleID: 'STRING_OUTP_LUBRICATION',
                data: {
                  fields: ['Load case', 'ny', 'ny1', 'kappa', 'a_ISO'],
                  unitFields: [
                    // eslint-disable-next-line unicorn/no-null
                    null,
                    {
                      unit: 'mm²/s',
                    },
                    {
                      unit: 'mm²/s',
                    },
                    // eslint-disable-next-line unicorn/no-null
                    null,
                    // eslint-disable-next-line unicorn/no-null
                    null,
                  ],
                  items: [
                    [
                      {
                        field: 'Load case',
                        value: 'loadcase1',
                      },
                      {
                        field: 'ny',
                        value: '1',
                        unit: 'mm²/s',
                      },
                      {
                        field: 'ny1',
                        value: '1',
                        unit: 'mm²/s',
                      },
                      {
                        field: 'kappa',
                        value: '1',
                      },
                      {
                        field: 'a_ISO',
                        value: '1',
                      },
                    ],
                    [
                      {
                        field: 'Load case',
                        value: 'loadcase2',
                      },
                      {
                        field: 'ny',
                        value: '2',
                        unit: 'mm²/s',
                      },
                      {
                        field: 'ny1',
                        value: '2',
                        unit: 'mm²/s',
                      },
                      {
                        field: 'kappa',
                        value: '2',
                      },
                      {
                        field: 'a_ISO',
                        value: '2',
                      },
                    ],
                  ],
                },
                description: {
                  identifier: 'textPairList',
                  title: 'Table Explanations:',
                  entries: [
                    ['ny: ', 'Operating viscosity'],
                    ['ny1: ', 'Reference viscosity'],
                    ['kappa: ', 'Viscosity ratio'],
                    ['a_ISO: ', 'Life adjustment factor'],
                  ],
                },
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

export const EXPECTED_RESULT_MULTIPLE_LOADCASES_INPUTS: CalculationResultReportInput[] =
  [
    {
      hasNestedStructure: false,
      title: 'Bearing',
      titleID: 'STRING_OUTP_BEARING',
      subItems: [
        {
          hasNestedStructure: false,
          designation: 'Designation',
          value: '6210-C-2HRS',
          abbreviation: undefined,
          title: undefined,
          titleID: undefined,
          unit: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Inside diameter',
          abbreviation: 'd',
          value: '50.000',
          unit: 'mm',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Outside diameter',
          abbreviation: 'D',
          value: '90.000',
          unit: 'mm',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Width',
          abbreviation: 'B',
          value: '20.000',
          unit: 'mm',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Basic dynamic load rating',
          abbreviation: 'C',
          value: '38000',
          unit: 'N',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Basic static load rating',
          abbreviation: 'C0',
          value: '23200',
          unit: 'N',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Fatigue limit load',
          abbreviation: 'Cu',
          value: '1580',
          unit: 'N',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Limiting speed',
          abbreviation: 'n_lim',
          value: '6500.0',
          unit: '1/min',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Limiting speed, grease',
          abbreviation: 'n_lim_g',
          value: '9900.0',
          unit: '1/min',
          title: undefined,
          titleID: undefined,
        },
      ],
    },
    {
      hasNestedStructure: false,
      title: 'Basic frequency factors related to 1/s',
      titleID: 'STRING_OUTP_BASIC_FREQUENCIES_FACTOR',
      subItems: [
        {
          hasNestedStructure: false,
          designation: 'Overrolling frequency factor on outer ring',
          abbreviation: 'BPFFO',
          value: '4.09',
          title: undefined,
          titleID: undefined,
          unit: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Overrolling frequency factor on inner ring',
          abbreviation: 'BPFFI',
          value: '5.91',
          title: undefined,
          titleID: undefined,
          unit: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Overrolling frequency factor on rolling element',
          abbreviation: 'BSFF',
          value: '2.67',
          title: undefined,
          titleID: undefined,
          unit: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Ring pass frequency factor on rolling element',
          abbreviation: 'RPFFB',
          value: '5.33',
          title: undefined,
          titleID: undefined,
          unit: undefined,
        },
        {
          hasNestedStructure: false,
          designation:
            'Speed factor of rolling element set for rotating inner ring',
          abbreviation: 'FTFF_i',
          value: '0.409',
          title: undefined,
          titleID: undefined,
          unit: undefined,
        },
        {
          hasNestedStructure: false,
          designation:
            'Speed factor of rolling element set for rotating outer ring',
          abbreviation: 'FTFF_o',
          value: '0.591',
          title: undefined,
          titleID: undefined,
          unit: undefined,
        },
      ],
    },
    {
      hasNestedStructure: false,
      title: 'Lubrication data',
      titleID: 'STRING_OUTP_LUBRICATING_DATA',
      subItems: [
        {
          hasNestedStructure: false,
          designation: 'Permitted lubricants',
          value: 'Only grease',
          title: undefined,
          titleID: undefined,
          unit: undefined,
          abbreviation: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Type of lubrication',
          value: 'grease',
          title: undefined,
          titleID: undefined,
          unit: undefined,
          abbreviation: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Type of grease',
          value: 'Arcanol MULTI2',
          title: undefined,
          titleID: undefined,
          unit: undefined,
          abbreviation: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Viscosity at 40°C',
          abbreviation: 'ny 40',
          value: '110.0',
          unit: 'mm²/s',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Viscosity at 100°C',
          abbreviation: 'ny 100',
          value: '11.0',
          unit: 'mm²/s',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Contamination',
          value: 'normal cleanliness',
          title: undefined,
          titleID: undefined,
          unit: undefined,
          abbreviation: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'External heat flow',
          abbreviation: 'dQ/dt',
          value: '0.0',
          unit: 'kW',
          title: undefined,
          titleID: undefined,
        },
      ],
    },
    {
      hasNestedStructure: false,
      title: 'Other conditions',
      titleID: 'STRING_OUTP_MISCELLANEOUS_DATA',
      subItems: [
        {
          hasNestedStructure: false,
          designation: 'Ambient temperature',
          abbreviation: 't',
          value: '20.0',
          unit: '°C',
          title: undefined,
          titleID: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Environmental influence',
          value: '0.8 (moderate)',
          title: undefined,
          titleID: undefined,
          unit: undefined,
          abbreviation: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Requisite reliability',
          value: '90 %',
          title: undefined,
          titleID: undefined,
          unit: undefined,
          abbreviation: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Condition of rotation',
          value: 'rotating inner ring',
          title: undefined,
          titleID: undefined,
          unit: undefined,
          abbreviation: undefined,
        },
        {
          hasNestedStructure: false,
          designation: 'Clearance group',
          value: 'CN',
          title: undefined,
          titleID: undefined,
          unit: undefined,
          abbreviation: undefined,
        },
      ],
    },
    {
      hasNestedStructure: true,
      title: 'Load',
      titleID: 'STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES',
      subItems: [
        {
          hasNestedStructure: false,
          title: 'loadcase1',
          subItems: [
            {
              hasNestedStructure: false,
              designation: 'Time portion (q)',
              value: '20.000',
              unit: '%',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'operationConditions.rotatingCondition.typeOfMotion',
              value: 'rotating',
              title: undefined,
              titleID: undefined,
              unit: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'Speed (n_i)',
              value: '200.00',
              unit: '1/min',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'Mean operating temperature (T)',
              value: '70',
              unit: '°C',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'Radial load (Fr)',
              value: '200.0',
              unit: 'N',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'Axial load (Fa)',
              value: '0.0',
              unit: 'N',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
          ],
        },
        {
          hasNestedStructure: false,
          title: 'loadcase2',
          subItems: [
            {
              hasNestedStructure: false,
              designation: 'Time portion (q)',
              value: '20.000',
              unit: '%',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'operationConditions.rotatingCondition.typeOfMotion',
              value: 'rotating',
              title: undefined,
              titleID: undefined,
              unit: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'Speed (n_i)',
              value: '200.00',
              unit: '1/min',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'Mean operating temperature (T)',
              value: '70',
              unit: '°C',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'Radial load (Fr)',
              value: '200.0',
              unit: 'N',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
            {
              hasNestedStructure: false,
              designation: 'Axial load (Fa)',
              value: '0.0',
              unit: 'N',
              title: undefined,
              titleID: undefined,
              abbreviation: undefined,
            },
          ],
        },
      ],
    },
  ];

export const EXPECTED_RESULT_MULTIPLE_LOADCASES: CatalogCalculationResult = {
  reportMessages: {
    errors: [],
    warnings: [],
    notes: [],
  },
  bearingBehaviour: {
    lh10: { value: '123.45', unit: 'h' },
  },
  loadcaseOverrollingFrequencies: [
    {
      BPFO: {
        value: '1',
        unit: '1/s',
        loadcaseName: 'loadcase1',
        short: 'BPFO',
        title: 'BPFO',
      },
      BPFI: {
        value: '1',
        unit: '1/s',
        loadcaseName: 'loadcase1',
        short: 'BPFI',
        title: 'BPFI',
      },
      BSF: {
        value: '1',
        unit: '1/s',
        loadcaseName: 'loadcase1',
        short: 'BSF',
        title: 'BSF',
      },
      FTF: {
        value: '1',
        unit: '1/s',
        loadcaseName: 'loadcase1',
        short: 'FTF',
        title: 'FTF',
      },
    },
    {
      BPFO: {
        value: '2',
        unit: '1/s',
        loadcaseName: 'loadcase2',
        short: 'BPFO',
        title: 'BPFO',
      },
      BPFI: {
        value: '2',
        unit: '1/s',
        loadcaseName: 'loadcase2',
        short: 'BPFI',
        title: 'BPFI',
      },
      BSF: {
        value: '2',
        unit: '1/s',
        loadcaseName: 'loadcase2',
        short: 'BSF',
        title: 'BSF',
      },
      FTF: {
        value: '2',
        unit: '1/s',
        loadcaseName: 'loadcase2',
        short: 'FTF',
        title: 'FTF',
      },
    },
  ],
  loadcaseFriction: [
    {
      speedDependentFrictionalTorque: {
        value: 1,
        unit: 'N mm',
        loadcaseName: 'loadcase1',
        short: 'M0',
        title: 'speedDependentFrictionalTorque',
      },
      loadDependentFrictionalTorque: {
        value: 1,
        unit: 'N mm',
        loadcaseName: 'loadcase1',
        short: 'M1',
        title: 'loadDependentFrictionalTorque',
      },
      totalFrictionalTorque: {
        value: 1,
        unit: 'N mm',
        loadcaseName: 'loadcase1',
        short: 'MR',
        title: 'totalFrictionalTorque',
      },
      totalFrictionalPowerLoss: {
        value: 1,
        unit: 'kW',
        loadcaseName: 'loadcase1',
        short: 'NR',
        title: 'totalFrictionalPowerLoss',
      },
      thermallySafeOperatingSpeed: {
        value: 1,
        unit: '1/min',
        loadcaseName: 'loadcase1',
        short: 'n_theta',
        title: 'thermallySafeOperatingSpeed',
      },
    },
    {
      speedDependentFrictionalTorque: {
        value: 2,
        unit: 'N mm',
        loadcaseName: 'loadcase2',
        short: 'M0',
        title: 'speedDependentFrictionalTorque',
      },
      loadDependentFrictionalTorque: {
        value: 2,
        unit: 'N mm',
        loadcaseName: 'loadcase2',
        short: 'M1',
        title: 'loadDependentFrictionalTorque',
      },
      totalFrictionalTorque: {
        value: 2,
        unit: 'N mm',
        loadcaseName: 'loadcase2',
        short: 'MR',
        title: 'totalFrictionalTorque',
      },
      totalFrictionalPowerLoss: {
        value: 2,
        unit: 'kW',
        loadcaseName: 'loadcase2',
        short: 'NR',
        title: 'totalFrictionalPowerLoss',
      },
      thermallySafeOperatingSpeed: {
        value: 2,
        unit: '1/min',
        loadcaseName: 'loadcase2',
        short: 'n_theta',
        title: 'thermallySafeOperatingSpeed',
      },
    },
  ],
  loadcaseFactorsAndEquivalentLoads: [
    {
      p0: {
        value: 1,
        unit: 'N',
        short: 'P0',
        loadcaseName: 'loadcase1',
        title: 'p0',
      },
      p_i: {
        value: 1,
        unit: 'N',
        short: 'P_i',
        loadcaseName: 'loadcase1',
        title: 'p_i',
      },
    },
    {
      p0: {
        value: 2,
        unit: 'N',
        short: 'P0',
        loadcaseName: 'loadcase2',
        title: 'p0',
      },
      p_i: {
        value: 2,
        unit: 'N',
        short: 'P_i',
        loadcaseName: 'loadcase2',
        title: 'p_i',
      },
    },
  ],
  loadcaseLubrication: [
    {
      operatingViscosity: {
        value: 1,
        unit: 'mm²/s',
        short: 'ny',
        loadcaseName: 'loadcase1',
        title: 'operatingViscosity',
      },
      referenceViscosity: {
        value: 1,
        unit: 'mm²/s',
        short: 'ny1',
        loadcaseName: 'loadcase1',
        title: 'referenceViscosity',
      },
      viscosityRatio: {
        value: 1,
        short: 'kappa',
        unit: undefined,
        loadcaseName: 'loadcase1',
        title: 'viscosityRatio',
      },
      lifeAdjustmentFactor: {
        value: 1,
        short: 'a_ISO',
        unit: undefined,
        loadcaseName: 'loadcase1',
        title: 'lifeAdjustmentFactor',
      },
    },
    {
      operatingViscosity: {
        value: 2,
        unit: 'mm²/s',
        short: 'ny',
        loadcaseName: 'loadcase2',
        title: 'operatingViscosity',
      },
      referenceViscosity: {
        value: 2,
        unit: 'mm²/s',
        short: 'ny1',
        loadcaseName: 'loadcase2',
        title: 'referenceViscosity',
      },
      viscosityRatio: {
        value: 2,
        short: 'kappa',
        unit: undefined,
        loadcaseName: 'loadcase2',
        title: 'viscosityRatio',
      },
      lifeAdjustmentFactor: {
        value: 2,
        short: 'a_ISO',
        unit: undefined,
        loadcaseName: 'loadcase2',
        title: 'lifeAdjustmentFactor',
      },
    },
  ],
};
