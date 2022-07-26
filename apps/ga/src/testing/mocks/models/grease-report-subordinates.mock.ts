/* eslint-disable max-lines */

import { GreaseReportSubordinate } from '@ga/features/grease-calculation/calculation-result/models';

import { greaseResultMock } from './grease-result.mock';

export const GREASE_RESULT_SUBORDINATES_MOCK: GreaseReportSubordinate[] = [
  {
    identifier: 'block',
    title: 'Input',
    titleID: 'STRING_OUTP_INPUT',
    subordinates: [
      {
        identifier: 'variableBlock',
        title: 'Bearing data',
        titleID: 'STRING_OUTP_RESULTS',
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
        titleID: 'STRING_OUTP_RESULTS',
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
        titleID: 'STRING_OUTP_RESULTS',
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
        titleID: 'STRING_OUTP_RESULTS',
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
        titleID: 'STRING_OUTP_RESULTS',
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
        titleID: 'STRING_OUTP_RESULTS',
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
        greaseResult: greaseResultMock,
        identifier: 'greaseResult',
      },
      {
        greaseResult: greaseResultMock,
        identifier: 'greaseResult',
      },
      {
        greaseResult: greaseResultMock,
        identifier: 'greaseResult',
      },
    ],
    defaultOpen: true,
  },
  {
    identifier: 'block',
    title: 'errorsWarningsNotes',
    defaultOpen: false,
    subordinates: [
      {
        identifier: 'block',
        title: 'errors',
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
        title: 'warnings',
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
        title: 'notes',
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
  },
];
