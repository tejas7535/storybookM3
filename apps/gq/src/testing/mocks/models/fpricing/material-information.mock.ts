import { MaterialInformationExtended } from '@gq/core/store/f-pricing/models/material-information-extended.interface';

import { MaterialInformation } from '../../../../app/shared/models/f-pricing/material-information.interface';

export const MATERIAL_INFORMATION_MOCK: MaterialInformation[] = [
  {
    informationKey: 'innerRing',
    properties: [
      {
        key: 'racewayDiameter',
        values: [
          { materialNumber13: 12_345, value: 90 },
          { materialNumber13: 45_678, value: 120 },
        ],
      },
      {
        key: 'racewayDiameter2',
        values: [
          { materialNumber13: 12_345, value: 120 },
          { materialNumber13: 45_678, value: 90 },
        ],
      },
      {
        key: 'materialCat',
        values: [
          { materialNumber13: 12_345, value: '100Cr6' },
          { materialNumber13: 45_678, value: '100Cr6' },
        ],
      },
    ],
  },
  {
    informationKey: 'outerRing',
    properties: [
      {
        key: 'cageMaterial',
        values: [
          { materialNumber13: 12_345, value: 'Medium (2)' },
          { materialNumber13: 45_678, value: '100Cr6' },
        ],
      },
      {
        key: 'cageDesign',
        values: [
          { materialNumber13: 12_345, value: 'NU' },
          { materialNumber13: 45_678, value: 'NU' },
        ],
      },
    ],
  },
];

export const MATERIAL_INFORMATION_EXTENDED_MOCK: MaterialInformationExtended[] =
  [
    {
      ...MATERIAL_INFORMATION_MOCK[0],
      countOfDelta: 2,
      deltaValues: [
        {
          isDelta: true,
          absolute: 30,
          relative: 33.33,
        },
        {
          isDelta: true,
          absolute: -30,
          relative: -25,
        },
        {
          isDelta: false,
        },
      ],
    },
    {
      ...MATERIAL_INFORMATION_MOCK[1],
      countOfDelta: 1,
      deltaValues: [
        {
          isDelta: true,
        },
        {
          isDelta: false,
        },
      ],
    },
  ];
