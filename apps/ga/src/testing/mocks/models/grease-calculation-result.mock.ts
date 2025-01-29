/* eslint-disable max-lines */
/* eslint-disable unicorn/no-zero-fractions */

import { GreaseReportSubordinate } from '@ga/features/grease-calculation/calculation-result/models';

/* eslint-disable unicorn/no-null */
export const GREASE_COMPLETE_RESULT_MOCK: GreaseReportSubordinate = {
  programName: 'Bearinx online',
  programNameID: 'STRING_BEARINX_ONLINE',
  isBeta: false,
  method: 'Grease Application',
  methodID: 'IDM_GREASE_APPLICATION',
  title: 'Grease Application',

  subordinates: [
    {
      identifier: 'textPairList',
      title: 'Calculation / Installation proposal',
      entries: [['Date: ', '2025-01-27 14:35:28']],
    },

    {
      identifier: 'legalNote',
      legal:
        'All rights are reserved, even in the event that a patent is granted or a utility model is registered. The document is to be treated confidentially. Without our written consent, neither the document itself nor copies thereof or other reproductions of the entire contents or excerpts thereof may be made available to third parties or misused in any other way by the recipient. Our dimensioning is based on your specifications and the information provided by you. Our dimensioning takes into account those risks which were recognizable to us on the basis of the information and specifications provided by you. Our dimensioning is made exclusively in connection with the purchase of our products. We do not assume any warranty in connection with the use of third-party products. The results have been worked out carefully and according to the state of the art, but do not represent any (explicit or implicit) guarantee of quality or durability in the legal sense. We are liable for the dimensioning and its results only in the case of intent and gross negligence. Unless expressly agreed otherwise, we are responsible for our scope of delivery only in accordance with the specifications documented herein, which form the basis of our dimensioning. We only perform component and system validations pertaining to the scope of services described herein. The responsibility for the overall system, of which our scope of delivery is only a part, is exclusively with you. All tasks and liabilities associated with the overall system and the integration of our scope of supply are your sole responsibility. In this respect, you are not released from the obligation to check our products for their suitability in the application with suitable methods or tests. If the document or the dimensioning is part of a supply contract or other agreement, the liability provisions agreed therein shall apply.',
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
              value: '6226',
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
              value: '1.57480',
              unit: 'in',
            },
            {
              identifier: 'variableLine',
              designation: 'Outside diameter',
              abbreviation: 'D',
              value: '9.05512',
              unit: 'in',
            },
            {
              identifier: 'variableLine',
              designation: 'Inside diameter',
              abbreviation: 'd',
              value: '5.11811',
              unit: 'in',
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
              value: '32800',
              unit: 'lbf',
            },
            {
              identifier: 'variableLine',
              designation: 'Basic dynamic load rating',
              abbreviation: 'C',
              value: '39800',
              unit: 'lbf',
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
              value: '350.00',
              unit: 'rpm',
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
              designation: 'Load levels',
              value: 'low (C0/P approx. 15)',
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
              value: '158.0',
              unit: 'deg F',
            },
            {
              identifier: 'variableLine',
              designation: 'Ambient temperature',
              abbreviation: 't',
              value: '68.0',
              unit: 'deg F',
            },
            {
              identifier: 'variableLine',
              designation: 'Environmental influence',
              value: '0.8 (moderate)',
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
          title: 'Operating data',
          titleID: 'STRING_OUTP_OPERATING_DATA',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Equivalent dynamic load (Catalog)',
              abbreviation: 'P_xy_i',
              value: '2188.1404',
              unit: 'lbf',
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
                      value: '19710',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '> 39420',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.06,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.096,
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
                      value: '1.08',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTI3',
                    },
                    {
                      field: 'tfR_min',
                      value: '19710',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '> 39420',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.06,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.096,
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
                      value: '1.15',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTITOP',
                    },
                    {
                      field: 'tfR_min',
                      value: '19710',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '> 39420',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.06,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.096,
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
                      value: '1.06',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD150',
                    },
                    {
                      field: 'tfR_min',
                      value: '19710',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '> 39420',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.06,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.096,
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
                      value: '1.55',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD400',
                    },
                    {
                      field: 'tfR_min',
                      value: '19710',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '> 39420',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.06,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.096,
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
                      value: '2.97',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MOTION 2',
                    },
                    {
                      field: 'tfR_min',
                      value: '19710',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '> 39420',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.06,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.096,
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
                      value: '0.66',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP90',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '1.51',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP110',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '1.35',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD220',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '1.82',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD460',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '2.97',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP120',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '4.06',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol Clean M',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '1.16',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol VIB3',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '1.48',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol FOOD2',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '1.68',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol XTRA3',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '1.09',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP200',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '5.22',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD1000',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '5.45',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol SPEED 2,6',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
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
                      value: '0.42',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Non-Schaeffler Multi-Purpose Grease',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: null,
                    },
                    {
                      field: 'add_w',
                      value: null,
                    },
                    {
                      field: 'kappa',
                      value: null,
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Non-Schaeffler High-Temperature Grease',
                    },
                    {
                      field: 'tfR_min',
                      value: '17900',
                      unit: 'h',
                    },
                    {
                      field: 'tfR_max',
                      value: '21900',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_min',
                      value: '35700',
                      unit: 'h',
                    },
                    {
                      field: 'tfG_max',
                      value: '> 43800',
                      unit: 'h',
                    },
                    {
                      field: 'Qvin',
                      value: 150.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_min',
                      value: 52.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_man_max',
                      value: 84.0,
                      unit: 'cm³',
                    },
                    {
                      field: 'Qvre_aut_min',
                      value: 0.063,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'Qvre_aut_max',
                      value: 0.1,
                      unit: 'cm³/day',
                    },
                    {
                      field: 'add_req',
                      value: null,
                    },
                    {
                      field: 'add_w',
                      value: null,
                    },
                    {
                      field: 'kappa',
                      value: null,
                    },
                  ],
                ],
              },
              description: {
                identifier: 'textPairList',
                title: 'Table Explanations:',
                titleID: 'STRING_TABLE_DESCRIPTION',
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
                  ['kappa: ', 'Viscosity ratio per ISO 281'],
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
                    unit: 'lb/in³',
                  },
                  {
                    unit: 'mm²/s',
                  },
                  {
                    unit: 'mm²/s',
                  },
                  {
                    unit: 'deg F',
                  },
                  {
                    unit: 'deg F',
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
                      value: '0.03251',
                      unit: 'lb/in³',
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
                      value: '-22.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '248.0',
                      unit: 'deg F',
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
                      value: '0.03251',
                      unit: 'lb/in³',
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
                      value: '-4.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '248.0',
                      unit: 'deg F',
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
                      value: '0.03143',
                      unit: 'lb/in³',
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
                      value: '-58.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '284.0',
                      unit: 'deg F',
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
                      value: '0.03251',
                      unit: 'lb/in³',
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
                      value: '-4.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '284.0',
                      unit: 'deg F',
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
                      value: '0.03360',
                      unit: 'lb/in³',
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
                      value: '-40.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '266.0',
                      unit: 'deg F',
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
                      value: '0.03288',
                      unit: 'lb/in³',
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
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '266.0',
                      unit: 'deg F',
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
                      value: '0.03251',
                      unit: 'lb/in³',
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
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '320.0',
                      unit: 'deg F',
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
                      value: '0.03251',
                      unit: 'lb/in³',
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
                      value: '-31.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '320.0',
                      unit: 'deg F',
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
                      value: '0.03324',
                      unit: 'lb/in³',
                    },
                    {
                      field: 'ny40',
                      value: '208.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '17.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-22.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '284.0',
                      unit: 'deg F',
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
                      value: '0.03360',
                      unit: 'lb/in³',
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
                      value: '-22.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '266.0',
                      unit: 'deg F',
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
                      value: '0.03360',
                      unit: 'lb/in³',
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
                      value: '-22.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '356.0',
                      unit: 'deg F',
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
                      value: '0.03432',
                      unit: 'lb/in³',
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
                      value: '-22.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '356.0',
                      unit: 'deg F',
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
                      value: '0.03251',
                      unit: 'lb/in³',
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
                      value: '-22.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '302.0',
                      unit: 'deg F',
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
                      value: '0.03179',
                      unit: 'lb/in³',
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
                      value: '-22.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '248.0',
                      unit: 'deg F',
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
                      value: 'Arcanol XTRA3',
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
                      value: '0.03143',
                      unit: 'lb/in³',
                    },
                    {
                      field: 'ny40',
                      value: '105.0',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: '11.5',
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '14.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '248.0',
                      unit: 'deg F',
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
                      value: '0.06864',
                      unit: 'lb/in³',
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
                      value: '-22.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '500.0',
                      unit: 'deg F',
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
                      value: '0.03360',
                      unit: 'lb/in³',
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
                      value: '-4.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '266.0',
                      unit: 'deg F',
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
                      value: '0.03396',
                      unit: 'lb/in³',
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
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '248.0',
                      unit: 'deg F',
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
                      value: 'Non-Schaeffler Multi-Purpose Grease',
                    },
                    {
                      field: 'NLGI',
                      value: null,
                    },
                    {
                      field: 'BaseOil',
                      value: null,
                    },
                    {
                      field: 'Thickener',
                      value: null,
                    },
                    {
                      field: 'rho',
                      value: null,
                      unit: 'lb/in³',
                    },
                    {
                      field: 'ny40',
                      value: null,
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: null,
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-4.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '248.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'f_low',
                      value: null,
                    },
                    {
                      field: 'vib',
                      value: null,
                    },
                    {
                      field: 'seal',
                      value: null,
                    },
                    {
                      field: 'NSF-H1',
                      value: null,
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Non-Schaeffler High-Temperature Grease',
                    },
                    {
                      field: 'NLGI',
                      value: null,
                    },
                    {
                      field: 'BaseOil',
                      value: null,
                    },
                    {
                      field: 'Thickener',
                      value: null,
                    },
                    {
                      field: 'rho',
                      value: null,
                      unit: 'lb/in³',
                    },
                    {
                      field: 'ny40',
                      value: null,
                      unit: 'mm²/s',
                    },
                    {
                      field: 'ny100',
                      value: null,
                      unit: 'mm²/s',
                    },
                    {
                      field: 'T_lim_low',
                      value: '-22.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'T_lim_up',
                      value: '320.0',
                      unit: 'deg F',
                    },
                    {
                      field: 'f_low',
                      value: null,
                    },
                    {
                      field: 'vib',
                      value: null,
                    },
                    {
                      field: 'seal',
                      value: null,
                    },
                    {
                      field: 'NSF-H1',
                      value: null,
                    },
                  ],
                ],
              },
              description: {
                identifier: 'textPairList',
                title: 'Table Explanations:',
                titleID: 'STRING_TABLE_DESCRIPTION',
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
        {
          identifier: 'block',
          title: 'CONCEPT1',
          titleID: 'STRING_OUTP_CONCEPT1',
          subordinates: [
            {
              identifier: 'table',
              title: 'CONCEPT1',
              titleID: 'STRING_OUTP_CONCEPT1',
              data: {
                fields: [
                  'Grease grade',
                  'C1',
                  'suit_60',
                  'C1_60',
                  'suit_125',
                  'C1_125',
                  'Note',
                ],
                items: [
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTI2',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },
                    {
                      field: 'suit_60',
                      value: 'yes',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'yes',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTI3',
                    },
                    {
                      field: 'C1',
                      value: 'no',
                    },
                    {
                      field: 'suit_60',
                      value: 'no',
                    },
                    {
                      field: 'C1_60',
                      value: '-  ',
                    },
                    {
                      field: 'suit_125',
                      value: 'no',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: null,
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MULTITOP',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },
                    {
                      field: 'suit_60',
                      value: 'yes',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'yes',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD150',
                    },
                    {
                      field: 'C1',
                      value: 'conditional',
                    },

                    {
                      field: 'C1_60',
                      value: '12.0',
                    },

                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD400',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },

                    {
                      field: 'C1_60',
                      value: '12.0',
                    },

                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol MOTION 2',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },

                    {
                      field: 'C1_60',
                      value: '12.0',
                    },

                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP90',
                    },
                    {
                      field: 'C1',
                      value: 'conditional',
                    },

                    {
                      field: 'C1_60',
                      value: '12.0',
                    },

                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP110',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },

                    {
                      field: 'C1_60',
                      value: '12.0',
                    },

                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD220',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },

                    {
                      field: 'C1_60',
                      value: '12.0',
                    },

                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD460',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },

                    {
                      field: 'C1_60',
                      value: '12.0',
                    },

                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP120',
                    },
                    {
                      field: 'C1',
                      value: 'conditional',
                    },
                    {
                      field: 'suit_60',
                      value: 'conditional',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'conditional',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol Clean M',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },
                    {
                      field: 'suit_60',
                      value: 'yes',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'yes',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol VIB3',
                    },
                    {
                      field: 'C1',
                      value: 'no',
                    },
                    {
                      field: 'suit_60',
                      value: 'no',
                    },
                    {
                      field: 'C1_60',
                      value: '-  ',
                    },
                    {
                      field: 'suit_125',
                      value: 'no',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: null,
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol FOOD2',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },
                    {
                      field: 'suit_60',
                      value: 'yes',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'yes',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol XTRA3',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },
                    {
                      field: 'suit_60',
                      value: 'yes',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'yes',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol TEMP200',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },
                    {
                      field: 'suit_60',
                      value: 'yes',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'yes',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol LOAD1000',
                    },
                    {
                      field: 'C1',
                      value: 'yes',
                    },
                    {
                      field: 'suit_60',
                      value: 'yes',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'yes',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Arcanol SPEED 2,6',
                    },
                    {
                      field: 'C1',
                      value: 'no',
                    },
                    {
                      field: 'suit_60',
                      value: 'no',
                    },
                    {
                      field: 'C1_60',
                      value: '-  ',
                    },
                    {
                      field: 'suit_125',
                      value: 'no',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: null,
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Non-Schaeffler Multi-Purpose Grease',
                    },
                    {
                      field: 'C1',
                      value: 'unknown',
                    },
                    {
                      field: 'suit_60',
                      value: 'unknown',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'unknown',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                  [
                    {
                      field: 'Grease grade',
                      value: 'Non-Schaeffler High-Temperature Grease',
                    },
                    {
                      field: 'C1',
                      value: 'unknown',
                    },
                    {
                      field: 'suit_60',
                      value: 'unknown',
                    },
                    {
                      field: 'C1_60',
                      value: '12.0',
                    },
                    {
                      field: 'suit_125',
                      value: 'unknown',
                    },
                    {
                      field: 'C1_125',
                      value: '-  ',
                    },
                    {
                      field: 'Note',
                      value: '1, 4',
                    },
                  ],
                ],
              },
              description: {
                identifier: 'textPairList',
                title: 'Table Explanations:',
                titleID: 'STRING_TABLE_DESCRIPTION',
                entries: [
                  ['Grease grade: ', 'Designation'],
                  ['C1: ', 'Suitability CONCEPT1'],
                  [
                    'suit_60: ',
                    'CONCEPT1 60ccm, suitable for present ambient temperature and runtime.',
                  ],
                  ['C1_60: ', 'Setting for CONCEPT1 60ccm'],
                  [
                    'suit_125: ',
                    'CONCEPT1 125ccm, suitable for present ambient temperature and runtime.',
                  ],
                  ['C1_125: ', 'Setting for CONCEPT1 125ccm'],
                  ['Note: ', 'See note'],
                ],
              },
            },
            {
              identifier: 'textBlock',
              title: 'Suitability CONCEPT1:',
              titleID: 'IDCO_CONCEPT1_CONDITION_GREASE_DATABASE',
              subordinates: [
                {
                  identifier: 'text',
                  text: [' '],
                },
              ],
            },
            {
              identifier: 'textBlock',
              title: 'yes:',
              titleID: 'LB_YES',
              subordinates: [
                {
                  identifier: 'text',
                  text: [
                    'Lubricant can be used without restriction in the operating range of the CONCEPT1 lubricator (ambient temperature: -20°C to 55°C resp. -4°F to 131°F).',
                  ],
                },
              ],
            },
            {
              identifier: 'textBlock',
              title: 'no:',
              titleID: 'LB_NO',
              subordinates: [
                {
                  identifier: 'text',
                  text: [
                    'Lubricant is not suitable for use in the CONCEPT1 lubricator.',
                  ],
                },
              ],
            },
            {
              identifier: 'textBlock',
              title: 'conditional:',
              titleID: 'LB_CONDITION',
              subordinates: [
                {
                  identifier: 'text',
                  text: [
                    'Lubricant should only be used at ambient temperatures below 30°C (86°F) and runtimes below 6 months and should be checked occasionally. These lubricants tend to separate base oil and thickener at long runtimes and high temperatures, as well as at constant vibrations. This could lead to blockages of the lubrication lines.',
                  ],
                },
              ],
            },
            {
              identifier: 'textBlock',
              title: 'unknown:',
              titleID: 'LB_UNKNOWN',
              subordinates: [
                {
                  identifier: 'text',
                  text: [
                    'No statement can be made for Non-Schaeffler greases regarding their suitability for the CONCEPT1. Please check the suitability yourself or consult Schaeffler Engineering Service.',
                  ],
                },
                {
                  identifier: 'text',
                  text: ['  '],
                },
                {
                  identifier: 'text',
                  text: ['  '],
                },
              ],
            },
            {
              identifier: 'textBlock',
              title: 'Note 1:',
              titleID: 'STRING_OUTP_REMARK_1',
              subordinates: [
                {
                  identifier: 'text',
                  text: [
                    'The determined CONCEPT1 60 cartridge setting is larger than the maximum value that can be set. However, the lubricator can be operated with the setting displayed.',
                  ],
                },
              ],
            },
            {
              identifier: 'textBlock',
              title: 'Note 2:',
              titleID: 'STRING_OUTP_REMARK_2',
              subordinates: [
                {
                  identifier: 'text',
                  text: [
                    'The determined CONCEPT1 125 cartridge setting is larger than the maximum value that can be set. We recommend the use of a smaller CONCEPT1 lubricator.',
                  ],
                },
              ],
            },
            {
              identifier: 'textBlock',
              title: 'Note 3:',
              titleID: 'STRING_OUTP_REMARK_3',
              subordinates: [
                {
                  identifier: 'text',
                  text: [
                    'The determined CONCEPT1 cartridge setting is significantly larger than the maximum value that can be set. The use of a CONCEPT1 lubricator is not recommended with these relubrication quantities.',
                  ],
                },
              ],
            },
            {
              identifier: 'textBlock',
              title: 'Note 4:',
              titleID: 'STRING_OUTP_REMARK_4',
              subordinates: [
                {
                  identifier: 'text',
                  text: [
                    'The determined CONCEPT1 125 cartridge setting is significantly larger than the maximum value that can be set. The use of a CONCEPT1 125 lubricator is not recommended with these relubrication quantities.',
                  ],
                },
                {
                  identifier: 'text',
                  text: ['  '],
                },
                {
                  identifier: 'text',
                  text: ['  '],
                },
              ],
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
              text: ['Relubrication should be carried out once a year.'],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol XTRA3'],
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
              text: ['  · Non-Schaeffler Multi-Purpose Grease'],
            },
            {
              identifier: 'text',
              text: ['  · Non-Schaeffler High-Temperature Grease'],
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
              text: ['  · Arcanol LOAD1000'],
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
              text: ['  · Arcanol TEMP200'],
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
                'A grease service life >3 years must be agreed with the lubricant supplier with regard to the respective application. The guide value issued in Bearinx for the grease service life is limited to 5 years. In individual cases, grease usage durations greater than 5 years are also possible. If necessary, please contact the Schaeffler engineering service, that can advise you on the basis of the practical experience. ',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: [
                'The operating temperature is below the recommended minimum operating temperature for the following greases:',
              ],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol TEMP120 ( 158.0 deg F < 176.0 deg F ) '],
            },
            {
              identifier: 'text',
              text: ['  · Arcanol TEMP200 ( 158.0 deg F < 302.0 deg F ) '],
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
                'As the simplified load input via load levels has been used, the thermally safe operating speed as well as the static load safety are not checked.',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: [
                'Calculation of the grease service life and the relubrication interval corresponds to the catalog method. The internal geometry and the internal load distribution are not taken into consideration in the calculation. If you have any questions relating to selection of a suitable grease, please contact the Schaeffler engineering service. If the axis of rotation is vertical, the supply of lubricant to the contact must be checked.',
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
                'When calculating the amount of lubricant, only the volume of the bearing is taken into account, while the free space of the surrounding construction and the volume of the supply lines are not considered.',
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
            {
              identifier: 'text',
              text: [
                'For the Non-Schaeffler Greases the individual properties are unknown. Therefore, criteria on the suitability of the grease are not checked for these greases (e.g., viscosity ratio, additivation, n*dm-limits of the grease, thermally safe operating speed, suitability for the CONCEPT1 lubricator).',
              ],
            },
            {
              identifier: 'text',
              text: ['  · Non-Schaeffler Multi-Purpose Grease'],
            },
            {
              identifier: 'text',
              text: ['  · Non-Schaeffler High-Temperature Grease'],
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
  timeStamp: '2025-01-27 14:35:28',
  programVersion: '12.0',
  transactionFileName: 'C:\\Windows\\TEMP\\l3ug5dpd.mon\\tfqnqbvm.cwf.vg2',
} as Partial<GreaseReportSubordinate> as GreaseReportSubordinate;
