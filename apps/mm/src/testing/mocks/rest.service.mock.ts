import { BearinxOnlineResult } from '@mm/core/services/bearinx-result.interface';

import {
  IDMM_HYDRAULIC_NUT_TYPE,
  IDMM_INNER_RING_EXPANSION,
  IDMM_RADIAL_CLEARANCE_REDUCTION,
} from './../../app/shared/constants/dialog-constant';
import {
  BearingSeatsResponse as BearingSeatsResponse,
  MMBearingPreflightResponse,
  SearchResult,
  ShaftMaterialResponse,
  SimpleListResponse,
} from './../../app/shared/models';

export const BEARING_SEARCH_RESULT_MOCK: SearchResult = {
  data: ['bearing-123', 'bearing-567'],
  total: 2,
};

export const BEARING_PREFLIGHT_EMPTY_MOCK: MMBearingPreflightResponse = {
  data: {
    input: [],
  },
};

export const BEARING_PREFLIGHT_RESPONSE_MOCK: MMBearingPreflightResponse = {
  data: {
    input: [
      {
        id: 'the id',
        title: 'the title',
        fields: [
          {
            id: IDMM_HYDRAULIC_NUT_TYPE,
            defaultValue: 'default',
            range: [
              {
                id: 'some id',
                title: 'some text',
              },
            ],
          },
          {
            id: IDMM_INNER_RING_EXPANSION,
            defaultValue: 'default',
            range: [],
          },
          {
            id: IDMM_RADIAL_CLEARANCE_REDUCTION,
            defaultValue: 'default',
            range: [],
          },
        ],
      },
    ],
  },
};

export const BEARING_MATERIAL_RESPONSE_MOCK: ShaftMaterialResponse = {
  id: 'the id',
  emodul: 'some value',
  nue: 'some value',
};

export const SIMPLE_LIST_RESPONSE: SimpleListResponse = [
  {
    id: 'mockId',
    title: 'mockTitle',
    available: false,
    image: 'imageName1.png',
    selected: false,
  },
  {
    id: 'mockId2',
    title: 'mockTitle2',
    available: false,
    image: undefined,
    selected: false,
  },
];

export const BEARING_SEATS_RESPONSE: BearingSeatsResponse = {
  bearingSeats: [
    {
      id: 'mockId',
      title: 'mockTitle',
      image: 'imageName.png',
      available: false,
    },
  ],
  bearingType: '',
};

export const REPORT_RESPONSE_MOCK: BearinxOnlineResult = {
  programName: 'some name',
  programNameID: '123',
  isBeta: false,
  method: '',
  methodID: '',
  companyInformation: undefined,
  timeStamp: '',
  programVersion: '12.0',
  transactionFileName: '',
  identifier: '',
  title: '',
  titleID: '',
};
