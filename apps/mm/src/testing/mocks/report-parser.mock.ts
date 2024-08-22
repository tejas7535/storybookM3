/* eslint-disable unicorn/no-null */
/* eslint-disable max-lines */
import {
  VARIABLE_BLOCK,
  VARIABLE_LINE,
} from '@mm/core/services/bearinx-result.constant';
import { BearinxOnlineResult } from '@mm/core/services/bearinx-result.interface';

export const JSON_REPORT_FULL_RESPONSE_MOCK: BearinxOnlineResult = {
  identifier: 'outputDescription',
  programName: 'Bearinx online',
  programNameID: 'STRING_BEARINX_ONLINE',
  isBeta: false,
  method: 'Mounting Manager',
  methodID: 'IDM_MOUNTING_MANAGER',
  title: 'Mounting Manager',
  titleID: 'IDM_MOUNTING_MANAGER',
  subordinates: [
    {
      identifier: 'textPairList',
      title: 'Calculation / Installation proposal',
      entries: [],
    },
    {
      identifier: 'textBlock',
      title: 'Attention',
      titleID: 'STRING_ATTENTION_CAPITAL',
      subordinates: [
        {
          identifier: 'text',
          text: [
            'Please see list of warnings and notes at the end of print out.',
          ],
        },
      ],
    },
    {
      identifier: 'legalNote',
      legal:
        'All rights are reserved with regard to this document, even in the event that a patent should be granted or a utility model registered. The document must be treated confidentially. Without our written consent, neither the document itself, nor copies thereof or any other renderings of the complete contents or of extracts therefrom may be made available to third parties or put to improper use by the recipient in any other way. The document has been prepared on the basis of your requirements as set forth above and our own assumptions. Our details take into account those risks which were apparent to us on the basis of your requirements as made available to us. The document has been prepared solely in connection with the purchase of our products. The results shown in the document have been worked out carefully and in accordance with the state of the art, but do not constitute an express or implied guaranty as to quality or durability in the legal sense. You are not dispensed thereby from checking the suitability of the products. We shall be liable for the details provided in the document only in the event of willful intent or negligence. If the document is part of a supply agreement, the liability provisions agreed there shall apply.',
    },
    {
      identifier: 'textPairList',
      title: 'Table of contents',
      titleID: 'STRING_TABLE_OF_CONTENTS',
      entries: [
        ['1    ', 'Input'],
        ['2    ', 'Results'],
        ['2.1  ', 'Mounting tools and utilities'],
        [
          '2.2  ',
          'Mounting recommendations: Bearing seat: tapered shaft, Mounting method: hydraulically supported with hydraulic nut',
        ],
        ['3    ', 'Warnings'],
        ['4    ', 'Notes'],
      ],
    },
    {
      identifier: 'block',
      title: 'Input',
      titleID: 'STRING_OUTP_INPUT',
      subordinates: [
        {
          identifier: 'variableBlock',
          title: 'Bearing data',
          titleID: 'STRING_OUTP_BEARING_DATA',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Designation',
              value: '2205-K-2RS-TVH-C3',
            },
            {
              identifier: 'variableLine',
              designation: 'Design',
              value: 'Self-aligning ball bearing',
            },
            {
              identifier: 'variableLine',
              designation: 'Series',
              value: '22',
            },
            {
              identifier: 'variableLine',
              designation: 'Width',
              abbreviation: 'B',
              value: '18,000',
              unit: 'mm',
            },
            {
              identifier: 'variableLine',
              designation: 'Outside diameter',
              abbreviation: 'D',
              value: '52,000',
              unit: 'mm',
            },
            {
              identifier: 'variableLine',
              designation: 'Inside diameter',
              abbreviation: 'd',
              value: '25,000',
              unit: 'mm',
            },
            {
              identifier: 'variableLine',
              designation: 'Bore type',
              value: 'conical 1:12',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Shaft data',
          titleID: 'STRING_OUTP_SHAFT_DATA',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Inner shaft diameter',
              abbreviation: 'd_sft',
              value: '0,000',
              unit: 'mm',
            },
            {
              identifier: 'variableLine',
              designation: 'Shaft material',
              value: 'steel',
            },
            {
              identifier: 'variableLine',
              designation: 'Modulus of Elasticity',
              abbreviation: 'E',
              value: '210000',
              unit: 'N/mm²',
            },
            {
              identifier: 'variableLine',
              designation: 'Poisson ratio',
              abbreviation: 'Nue',
              value: '0,30',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Mounting',
          titleID: 'STRING_OUTP_MOUNTING',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Bearing seat',
              value: 'tapered shaft',
            },
            {
              identifier: 'variableLine',
              designation: 'Measuring method',
              value: 'radial clearance reduction',
            },
            {
              identifier: 'variableLine',
              designation: 'Mounting method',
              value: 'hydraulically supported with hydraulic nut',
            },
          ],
        },
      ],
    },
    {
      identifier: 'block',
      title: 'Results',
      titleID: 'STRING_OUTP_RESULTS',
      subordinates: [
        {
          identifier: 'variableBlock',
          title: 'End position',
          titleID: 'STRING_OUTP_END_POSITION',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Displacement (start to end position)',
              abbreviation: 'dx_mnt',
              value: '0,190',
              unit: 'mm',
            },
            {
              identifier: 'variableLine',
              designation: 'Radial clearance reduction',
              abbreviation: 'delta_sr',
              value: '8,7',
              unit: 'µm',
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Mounting tools and utilities',
          titleID: 'STRING_OUTP_MOUNTING_TOOLS_AND_UTILITIES',
          subordinates: [
            {
              identifier: 'variableBlock',
              title: 'Hydraulic nut',
              titleID: 'STRING_OUTP_HYDRAULIC_NUT',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Hydraulic nut type',
                  value: 'not available',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Piston face',
                  abbreviation: 'A_k',
                  value: '0,000',
                  unit: 'cm²',
                },
              ],
            },
            {
              identifier: 'table',
              title: 'Pumps',
              titleID: 'STRING_OUTP_PUMPS',
              data: {
                fields: ['', 'Pump for hydraulic nut'],
                items: [
                  [
                    {
                      field: '',
                      value: 'recommended',
                    },
                    {
                      field: 'Pump for hydraulic nut',
                      value: 'PUMP1000-2,2',
                    },
                  ],
                  [
                    {
                      field: '',
                      value: 'alternative',
                    },
                    {
                      field: 'Pump for hydraulic nut',
                      value: 'PUMP700-2L',
                    },
                  ],
                  [
                    {
                      field: '',
                      // eslint-disable-next-line unicorn/no-null
                      value: null,
                    },
                    {
                      field: 'Pump for hydraulic nut',
                      value: 'PUMP1000-5L-AIR',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          identifier: 'block',
          title:
            'Mounting recommendations: Bearing seat: tapered shaft, Mounting method: hydraulically supported with hydraulic nut',
          titleID:
            'STRING_OUTP_MOUNTING_RECOMMENDATIONS_IDMM_BEARING_SEAT_IDMM_MOUNTING_METHOD',
          subordinates: [
            {
              identifier: 'text',
              text: [
                '- The measurement of radial clearance with a feeler gage is hardly possible for radial self-aligning ball bearings.',
              ],
            },
            {
              identifier: 'text',
              text: [
                '- Radial self-aligning ball bearings with an inner diameter up to 75 mm are mounted with a special tool (LOCKNUT-DOUBLEHOOK).',
              ],
            },
            {
              identifier: 'text',
              text: [
                '- The desired radial clearance results from the given torque or the torsion angle.',
              ],
            },
            {
              identifier: 'text',
              text: [
                '- The detailed mounting procedure is described in the manual BA28.',
              ],
            },
            {
              subordinates: [
                {
                  identifier: 'text',
                  text: ['some nested text'],
                },
              ],
              identifier: 'block',
            },
          ],
        },
      ],
    },
    {
      identifier: 'block',
      title: 'Warnings',
      titleID: 'STRING_WARNING_BLOCK',
      subordinates: [
        {
          identifier: 'text',
          text: [' '],
        },
        {
          identifier: 'block',
          subordinates: [
            {
              identifier: 'text',
              text: [
                'There is no hydraulic nut available for the selected bearing.',
              ],
            },
            {
              identifier: 'text',
              text: ['  · 2205-K-2RS-TVH-C3'],
            },
            {
              identifier: 'text',
              text: [' '],
            },
          ],
        },
      ],
    },
    {
      identifier: 'block',
      title: 'Notes',
      titleID: 'STRING_NOTE_BLOCK',
      subordinates: [
        {
          identifier: 'text',
          text: [' '],
        },
        {
          identifier: 'block',
          subordinates: [
            {
              identifier: 'text',
              text: [
                'The calculated values only apply for steel shafts that are either solid or have a bore diameter not bigger than the half outer diameter.',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
          ],
        },
      ],
    },
  ],
  companyInformation: [
    {
      url: 'http://www.schaeffler.com',
      company: 'www.schaeffler.com',
    },
  ],
  timeStamp: '2024-08-13 14:19:36',
  programVersion: '12.0',
};

/** scoped response data only with required unique data */
export const JSON_REPORT_LOCKNUT_AND_CHECK_VALUES_MOCK: BearinxOnlineResult = {
  identifier: 'outputDescription',
  programName: 'Bearinx online',
  programNameID: 'STRING_BEARINX_ONLINE',
  isBeta: false,
  method: 'Mounting Manager',
  methodID: 'IDM_MOUNTING_MANAGER',
  title: 'Mounting Manager',
  titleID: 'IDM_MOUNTING_MANAGER',
  subordinates: [
    {
      identifier: 'block',
      title: 'Results',
      titleID: 'STRING_OUTP_RESULTS',
      subordinates: [
        {
          identifier: 'table',
          title: 'Radial clearance reduction and axial displacement',
          titleID:
            'STRING_OUTP_RADIAL_CLEARANCE_REDUCTION_AND_AXIAL_DISPLACEMENT',
          data: {
            fields: ['', 'Min', 'Max'],
            unitFields: [
              null,
              {
                unit: 'µm',
              },
              {
                unit: 'µm',
              },
            ],
            items: [
              [
                {
                  field: '',
                  value: 'Radial clearance reduction by mounting',
                },
                {
                  field: 'Min',
                  value: '410,0',
                  unit: 'µm',
                },
                {
                  field: 'Max',
                  value: '550,0',
                  unit: 'µm',
                },
              ],
              [
                {
                  field: '',
                  value: 'Axial displacement',
                },
                {
                  field: 'Min',
                  value: '6300,0',
                  unit: 'µm',
                },
                {
                  field: 'Max',
                  value: '8500,0',
                  unit: 'µm',
                },
              ],
            ],
          },
        },
        {
          identifier: 'table',
          title: 'Check values for clearance classes',
          titleID: 'STRING_OUTP_CHECK_VALUES_FOR_CLEARANCE_CLASSES',
          data: {
            fields: ['', 'CN', 'C3', 'C4'],
            unitFields: [
              null,
              {
                unit: 'µm',
              },
              {
                unit: 'µm',
              },
              {
                unit: 'µm',
              },
            ],
            items: [
              [
                {
                  field: '',
                  value: 'Check values for clearance classes',
                },
                {
                  field: 'CN',
                  value: '300,0',
                  unit: 'µm',
                },
                {
                  field: 'C3',
                  value: '430,0',
                  unit: 'µm',
                },
                {
                  field: 'C4',
                  value: '640,0',
                  unit: 'µm',
                },
              ],
            ],
          },
        },
        {
          identifier: 'block',
          title: 'Mounting tools and utilities',
          titleID: 'STRING_OUTP_MOUNTING_TOOLS_AND_UTILITIES',
          subordinates: [
            {
              identifier: 'variableBlock',
              title: 'Locknut',
              titleID: 'STRING_OUTP_LOCKNUT',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Locknut',
                  value: 'HM30/1000-H',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Outer diameter',
                  abbreviation: 'D_m',
                  value: '1140,0',
                  unit: 'mm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Inner diameter',
                  abbreviation: 'd_2',
                  value: '1000,0',
                  unit: 'mm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Width',
                  abbreviation: 'b_1',
                  value: '100,0',
                  unit: 'mm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Groove width',
                  abbreviation: 'm',
                  value: '60,0',
                  unit: 'mm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Groove depth',
                  abbreviation: 'n',
                  value: '25,0',
                  unit: 'mm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Thread',
                  value: 'Tr1000x8',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Lock washer',
                  value: 'MS30/1000',
                },
              ],
            },
            {
              identifier: 'variableBlock',
              title: 'Sleeve connectors',
              titleID: 'STRING_OUTP_SLEEVE_CONNECTORS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Sleeve connector',
                  value: 'PUMP.SLEEVE-CONNECTOR-G1/8',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Number of sleeve connectors',
                  value: '1',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      identifier: 'block',
      title: 'Notes',
      titleID: 'STRING_NOTE_BLOCK',
      subordinates: [
        {
          identifier: 'table',
          text: ['some incorrect notes format'],
        },
      ],
    },
  ],
  companyInformation: [
    {
      url: 'http://www.schaeffler.com',
      company: 'www.schaeffler.com',
    },
  ],
  timeStamp: '2024-08-22 08:50:15',
  programVersion: '12.0',
};

export const JSON_REPORT_INCORRECT_INPUT_MOCK: Partial<BearinxOnlineResult> = {
  subordinates: [
    {
      identifier: 'block',
      title: 'Input',
      titleID: 'STRING_OUTP_INPUT',
      subordinates: [
        {
          identifier: 'variableBlock',
          title: 'Mounting',
          titleID: 'STRING_OUTP_MOUNTING',
          subordinates: [
            {
              identifier: 'incorrect identifier',
              designation: 'incorrect type',
            },
          ],
        },
      ],
    },
  ],
};

export const JSON_REPORT_ALL_TYPES_INPUTS_MOCK: Partial<BearinxOnlineResult> = {
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
          titleID: 'STRING_OUTP_BASIC_FREQUENCIES_FACTOR',
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
      ],
    },
  ],
};
