/* eslint-disable max-lines */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-zero-fractions */

export const greaseReport = {
  identifier: 'outputDescription',
  programName: 'Bearinx',
  programNameID: 'STRING_BEARINX',
  isBeta: true,
  method: 'Grease Application',
  methodID: 'IDM_GREASE_APPLICATION',
  title: 'Grease Application',
  titleID: 'IDM_GREASE_APPLICATION',
  subordinates: [
    {
      identifier: 'textPairList',
      title: 'Calculation / Installation proposal',
      entries: [['Date: ', '2021-11-04 10:29:33']],
    },
    {
      identifier: 'textBlock',
      title: 'Attention',
      subordinates: [
        {
          identifier: 'text',
          text: [
            'Please see list of errors, warnings and notes at the end of print out.',
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
      entries: [
        ['1    ', 'Input'],
        ['2    ', 'Results'],
        ['2.1  ', 'Result for relubrication and grease selection'],
        ['2.2  ', 'Result for relubrication and grease selection'],
        ['3    ', 'Errors'],
        ['4    ', 'Warnings'],
        ['5    ', 'Notes'],
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
              value: '6220',
            },
            {
              identifier: 'variableLine',
              designation: 'Design',
              value: 'Radial deep groove ball bearing',
            },
            {
              identifier: 'variableLine',
              designation: 'Series',
              value: '62',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Bearing dimensions',
          titleID: 'STRING_OUTP_BEARING_DIMENSIONS',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Width',
              abbreviation: 'B',
              value: '34.000',
              unit: 'mm',
            },
            {
              identifier: 'variableLine',
              designation: 'Outside diameter',
              abbreviation: 'D',
              value: '180.000',
              unit: 'mm',
            },
            {
              identifier: 'variableLine',
              designation: 'Inside diameter',
              abbreviation: 'd',
              value: '100.000',
              unit: 'mm',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Basic load ratings',
          titleID: 'STRING_OUTP_BASIC_LOAD_RATINGS',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Basic static load rating',
              abbreviation: 'C0',
              value: '93000',
              unit: 'N',
            },
            {
              identifier: 'variableLine',
              designation: 'Basic dynamic load rating',
              abbreviation: 'C',
              value: '130000',
              unit: 'N',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Operating conditions',
          titleID: 'PROPERTY_PAGE_TITLE_OPERATING_CONDITIONS',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Type of movement',
              value: 'rotating',
            },
            {
              identifier: 'variableLine',
              designation: 'Relative speed',
              abbreviation: 'n_rel',
              value: '1000.00',
              unit: '1/min',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Load',
          titleID: 'STRING_OUTP_LOAD',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Radial load',
              abbreviation: 'F_r',
              value: '10000.00',
              unit: 'N',
            },
            {
              identifier: 'variableLine',
              designation: 'Axial load',
              abbreviation: 'F_a',
              value: '0.00',
              unit: 'N',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Temperatures',
          titleID: 'PROPERTY_PAGE_TITLE_TEMPERATURES',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Operating temperature',
              abbreviation: 'Theta',
              value: '70.0',
              unit: '°C',
            },
            {
              identifier: 'variableLine',
              designation: 'Ambient temperature',
              abbreviation: 't',
              value: '20',
              unit: '°C',
            },
            {
              identifier: 'variableLine',
              designation: 'Environmental influence',
              value: 'average',
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
          identifier: 'block',
          title: 'Result for relubrication and grease selection',
          titleID: 'STRING_OUTP_RESULTS_FOR_GREASE_SELECTION',
          subordinates: [
            {
              identifier: 'variableBlock',
              title: 'Internal calculation data',
              titleID: 'STRING_OUTP_GREASE_SERVICE_INTERNAL_CALCULATION_DATA',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Free volume',
                  value: '184049.00',
                  unit: 'mm³',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Cage material',
                  value: 'steel',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Filling percentage',
                  value: '35.83',
                  unit: '%',
                },
              ],
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Operating data',
          titleID: 'STRING_OUTP_OPERATING_DATA',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Equivalent static load (Catalog)',
              abbreviation: 'P0_xy_i',
              value: '10000.00',
              unit: 'N',
            },
            {
              identifier: 'variableLine',
              designation: 'Equivalent dynamic load (Catalog)',
              abbreviation: 'P_xy_i',
              value: '10000.00',
              unit: 'N',
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Result for relubrication and grease selection',
          titleID: 'STRING_OUTP_RESULTS_FOR_GREASE_SELECTION',
          subordinates: [
            {
              identifier: 'table',
              title:
                'Grease service life and relubrication, Amount of grease in ccm',
              titleID:
                'STRING_OUTP_RESULTS_FOR_GREASE_SERVICE_STRING_OUTP_GREASE_QUANTITY_IN_CCM',
              data: {
                fields: [
                  'Grease grade',
                  'tfR_min',
                  'tfR_max',
                  'tfG_min',
                  'tfG_max',
                  'Qvin',
                  'Qvre_man_min',
                  'Qvre_man_max',
                  'Qvre_aut_min',
                  'Qvre_aut_max',
                  'add_req',
                  'add_w',
                  'kappa',
                ],
                unitFields: [
                  null,
                  {
                    unit: 'h',
                  },
                  {
                    unit: 'h',
                  },
                  {
                    unit: 'h',
                  },
                  {
                    unit: 'h',
                  },
                  {
                    unit: 'cm³',
                  },
                  {
                    unit: 'cm³',
                  },
                  {
                    unit: 'cm³',
                  },
                  {
                    unit: 'cm³/day',
                  },
                  {
                    unit: 'cm³/day',
                  },
                  null,
                  null,
                  null,
                ],
                items: [
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTI2',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'no',
                    },
                    {
                      field: 'kappa',
                      value: '2.33',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTI3',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'no',
                    },
                    {
                      field: 'kappa',
                      value: '2.47',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP90',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '3.26',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP110',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '2.91',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTITOP',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '2.28',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD150',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '3.35',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD220',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '4.63',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol Clean M',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'no',
                    },
                    {
                      field: 'kappa',
                      value: '2.49',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MOTION 2',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '1.42',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol VIB3',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '3.20',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol FOOD2',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '3.62',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD400',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '6.75',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD460',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '6.41',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP120',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '8.76',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol SPEED 2,6',
                    },
                    {
                      field: 'tfR_min',
                      value: '9440',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '14600',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '18900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '26280',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 66.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 33.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 53.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.066,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.11,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: 'no',
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '0.91',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD1000',
                    },
                    {
                      field: 'tfR_min',
                      value: null,
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: null,
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: null,
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: null,
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: null,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: null,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: null,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: null,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: null,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: null,
                    },
                    {
                      field: 'add_w',
                      value: 'yes',
                    },
                    {
                      field: 'kappa',
                      value: '11.76',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP200',
                    },
                    {
                      field: 'tfR_min',
                      value: null,
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: null,
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: null,
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: null,
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: null,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: null,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: null,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: null,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: null,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: null,
                    },
                    {
                      field: 'add_w',
                      value: 'no',
                    },
                    {
                      field: 'kappa',
                      value: '11.26',
                    },
                  ],
                ],
              },
              description: {
                identifier: 'textPairList',
                title: 'Table Explanations:',
                entries: [
                  ['Grease grade: ', 'Designation'],
                  ['tfR_min: ', 'Lower guide value for relubrication interval'],
                  ['tfR_max: ', 'Upper guide value for relubrication interval'],
                  ['tfG_min: ', 'Lower guide value for grease service life'],
                  ['tfG_max: ', 'Upper guide value for grease service life'],
                  ['Qvin: ', 'Guide value for initial grease quantity'],
                  [
                    'Qvre_man_min: ',
                    'Guide value for manual minimum relubrication quantity',
                  ],
                  [
                    'Qvre_man_max: ',
                    'Guide value for manual maximum relubrication quantity',
                  ],
                  [
                    'Qvre_aut_min: ',
                    'Guide value for automatic minimum relubrication quantity per time (1 day = 24h continuous operation)',
                  ],
                  [
                    'Qvre_aut_max: ',
                    'Guide value for automatic maximum relubrication quantity per time (1 day = 24h continuous operation)',
                  ],
                  ['add_req: ', 'Additivation required'],
                  ['add_w: ', 'Effective EP-additivation'],
                  ['kappa: ', 'Viscosity ratio'],
                ],
              },
            },
            {
              identifier: 'table',
              title: 'Grease properties',
              titleID: 'STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES',
              data: {
                fields: [
                  'Grease grade',
                  'NLGI',
                  'BaseOil',
                  'Thickener',
                  'rho',
                  'ny40',
                  'ny100',
                  'T_lim_low',
                  'T_lim_up',
                  'f_low',
                  'vib',
                  'seal',
                  'NSF-H1',
                ],
                unitFields: [
                  null,
                  null,
                  null,
                  null,
                  {
                    unit: 'kg/dm³',
                  },
                  {
                    unit: 'mm²/s',
                  },
                  {
                    unit: 'mm²/s',
                  },
                  {
                    unit: '°C',
                  },
                  {
                    unit: '°C',
                  },
                  null,
                  null,
                  null,
                  null,
                ],
                items: [
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTI2',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Mineral oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium soap',
                    },
                    {
                      field: 'rho',
                      value: '0.900',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '110.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '11.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-30.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '120.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '0',
                    },
                    {
                      field: 'vib',
                      value: '0',
                    },
                    {
                      field: 'seal',
                      value: '0',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTI3',
                    },
                    {
                      field: 'NLGI',
                      value: '3',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Mineral oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium soap',
                    },
                    {
                      field: 'rho',
                      value: '0.900',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '110.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '12.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-20.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '120.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '0',
                    },
                    {
                      field: 'vib',
                      value: '+',
                    },
                    {
                      field: 'seal',
                      value: '+',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP90',
                    },
                    {
                      field: 'NLGI',
                      value: '3',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Mineral + PAO oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Polyurea',
                    },
                    {
                      field: 'rho',
                      value: '0.900',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '148.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '15.5',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-40.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '160.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '0',
                    },
                    {
                      field: 'vib',
                      value: '0',
                    },
                    {
                      field: 'seal',
                      value: '+',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP110',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Synthetic oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium/complex soap',
                    },
                    {
                      field: 'rho',
                      value: '0.900',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '130.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '14.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-35.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '160.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '+',
                    },
                    {
                      field: 'vib',
                      value: '0',
                    },
                    {
                      field: 'seal',
                      value: '0',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTITOP',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Ester/Min/SHC oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium soap',
                    },
                    {
                      field: 'rho',
                      value: '0.870',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '82.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '12.5',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-50.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '140.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '+',
                    },
                    {
                      field: 'vib',
                      value: '+',
                    },
                    {
                      field: 'seal',
                      value: '0',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD150',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Mineral oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium/complex soap',
                    },
                    {
                      field: 'rho',
                      value: '0.900',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '160.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '15.5',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-20.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '140.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: null,
                    },
                    {
                      field: 'vib',
                      value: '+',
                    },
                    {
                      field: 'seal',
                      value: '+',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD220',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Mineral oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium/calcium soap',
                    },
                    {
                      field: 'rho',
                      value: '0.900',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '245.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '20.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-20.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '140.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: null,
                    },
                    {
                      field: 'vib',
                      value: '+',
                    },
                    {
                      field: 'seal',
                      value: '+',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol Clean M',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Ether oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Polyurea',
                    },
                    {
                      field: 'rho',
                      value: '0.950',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '100.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '12.8',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-30.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '180.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '0',
                    },
                    {
                      field: 'vib',
                      value: '0',
                    },
                    {
                      field: 'seal',
                      value: '0',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MOTION 2',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Synthetic oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium soap',
                    },
                    {
                      field: 'rho',
                      value: '0.910',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '50.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '8.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-40.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '130.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: null,
                    },
                    {
                      field: 'vib',
                      value: '++',
                    },
                    {
                      field: 'seal',
                      value: '+',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol VIB3',
                    },
                    {
                      field: 'NLGI',
                      value: '3-4',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Mineral oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium/complex soap',
                    },
                    {
                      field: 'rho',
                      value: '0.900',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '170.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '14.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-30.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '150.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: null,
                    },
                    {
                      field: 'vib',
                      value: '++',
                    },
                    {
                      field: 'seal',
                      value: '+',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol FOOD2',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'PAO oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Aluminum-Complex',
                    },
                    {
                      field: 'rho',
                      value: '0.880',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '150.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '18.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-30.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '120.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '0',
                    },
                    {
                      field: 'vib',
                      value: '0',
                    },
                    {
                      field: 'seal',
                      value: '0',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'yes',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD400',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Mineral oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium/calcium soap',
                    },
                    {
                      field: 'rho',
                      value: '0.900',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '400.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '27.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-40.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '130.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: null,
                    },
                    {
                      field: 'vib',
                      value: '+',
                    },
                    {
                      field: 'seal',
                      value: '+',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD460',
                    },
                    {
                      field: 'NLGI',
                      value: '1',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Mineral oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium/calcium soap',
                    },
                    {
                      field: 'rho',
                      value: '0.930',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '400.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '25.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-30.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '130.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: null,
                    },
                    {
                      field: 'vib',
                      value: '+',
                    },
                    {
                      field: 'seal',
                      value: null,
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP120',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'PAO oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Polyurea',
                    },
                    {
                      field: 'rho',
                      value: '0.930',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '400.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '40.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-30.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '180.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: null,
                    },
                    {
                      field: 'vib',
                      value: '0',
                    },
                    {
                      field: 'seal',
                      value: '+',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol SPEED 2,6',
                    },
                    {
                      field: 'NLGI',
                      value: '2-3',
                    },
                    {
                      field: 'BaseOil',
                      value: 'PAO/Ester oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium/complex soap',
                    },
                    {
                      field: 'rho',
                      value: '0.940',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '25.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '6.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-40.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '120.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '++',
                    },
                    {
                      field: 'vib',
                      value: null,
                    },
                    {
                      field: 'seal',
                      value: '0',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD1000',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Mineral oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'Lithium/calcium soap',
                    },
                    {
                      field: 'rho',
                      value: '0.930',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '1000.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '38.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-20.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '130.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '--',
                    },
                    {
                      field: 'vib',
                      value: '+',
                    },
                    {
                      field: 'seal',
                      value: '+',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP200',
                    },
                    {
                      field: 'NLGI',
                      value: '2',
                    },
                    {
                      field: 'BaseOil',
                      value: 'Alkoxyfluor oil',
                    },
                    {
                      field: 'Thickener',
                      value: 'PTFE',
                    },
                    {
                      field: 'rho',
                      value: '1.900',
                      unit: 'kg/dm³',
                    },
                    {
                      field: 'ny40',
                      value: '550.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '49.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-30.0',
                      unit: '°C',
                    },
                    {
                      field: 'T_lim_up',
                      value: '260.0',
                      unit: '°C',
                    },
                    {
                      field: 'f_low',
                      value: '--',
                    },
                    {
                      field: 'vib',
                      value: '0',
                    },
                    {
                      field: 'seal',
                      value: '0',
                    },
                    {
                      field: 'NSF-H1',
                      value: 'no',
                    },
                  ],
                ],
              },
              description: {
                identifier: 'textPairList',
                title: 'Table Explanations:',
                entries: [
                  ['Grease grade: ', 'Designation'],
                  ['NLGI: ', 'Consistency NLGI'],
                  ['BaseOil: ', 'Base oil'],
                  ['Thickener: ', 'Thickener'],
                  ['rho: ', 'Density'],
                  ['ny40: ', 'Base oil viscosity at 40°C'],
                  ['ny100: ', 'Base oil viscosity at 100°C'],
                  ['T_lim_low: ', 'Lower temperature limit'],
                  ['T_lim_up: ', 'Upper temperature limit'],
                  [
                    'f_low: ',
                    'Low Friction (++/ +/ 0/ -/ --: extremely suitable/ highly suitable / suitable/ less suitable/ not suitable)',
                  ],
                  [
                    'vib: ',
                    'Suitable for vibrations (++/ +/ 0/ -/ --: extremely suitable/ highly suitable / suitable/ less suitable/ not suitable)',
                  ],
                  [
                    'seal: ',
                    'Support for seals (++/ +/ 0/ -/ --: extremely suitable/ highly suitable / suitable/ less suitable/ not suitable)',
                  ],
                  [
                    'NSF-H1: ',
                    'H1 registration (NSF-H1 kosher and halal certification)',
                  ],
                ],
              },
            },
          ],
        },
      ],
    },
    {
      identifier: 'block',
      title: 'Errors',
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
                'Very high kappa values and corresponding friction losses occur at the present operating speed for the following lubricating greases:',
              ],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol LOAD1000'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol TEMP200'],
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
      title: 'Warnings',
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
              text: ['Relubrication should be carried out once a year.'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol Clean M'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol MOTION 2'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol MULTITOP'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol MULTI2'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol MULTI3'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol LOAD150'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol LOAD220'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol LOAD400'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol LOAD460'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol TEMP90'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol TEMP110'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol TEMP120'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol SPEED 2,6'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol VIB3'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol FOOD2'],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: [
                'Where a grease service life >3 years is required, this should be agreed in consultation with the lubricant manufacturer.',
              ],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol Clean M'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol MOTION 2'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol MULTITOP'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol MULTI2'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol MULTI3'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol LOAD150'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol LOAD220'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol LOAD400'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol LOAD460'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol TEMP90'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol TEMP110'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol TEMP120'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol SPEED 2,6'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol VIB3'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol FOOD2'],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: [
                'Calculation finished. The results for the permissible greases are in the result file.',
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
    {
      identifier: 'block',
      title: 'Notes',
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
                'Calculation of the grease service life and the relubrication interval corresponds to the catalog method. The internal geometry and the internal load distribution are not taken into consideration in the calculation. For appropriate grease selection, the employees of the Schaeffler Group have access to the Grease Configurator. If the axis of rotation is vertical, the supply of lubricant to the contact must be checked. Please consult the experts in the Lubrication Technology department.',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: [
                'A complete plausibility check of the loads is not implemented. Load conditions like minimal load, maximum permissible load as well as suitability of the load situation for the selected bearing are not checked.',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: [
                'In the Grease App, fatigue life is not considered or calculated. Please check this separately.',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: [
                'When calculating the amount of lubricant, only the volume of the bearing is taken into account, while the free space of the surrounding construction is not considered.',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: [
                'The specified grease quantities are only guide values, which may be deviated from based on practical experience. In case of questions, please contact the Schaeffler engineering service.',
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
  timeStamp: '2021-11-04 10:29:33',
  programVersion: '12.0',
};
