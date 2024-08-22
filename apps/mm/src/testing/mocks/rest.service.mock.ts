import { BearinxOnlineResult } from '@mm/core/services/bearinx-result.interface';

import {
  IDMM_HYDRAULIC_NUT_TYPE,
  IDMM_INNER_RING_EXPANSION,
  IDMM_RADIAL_CLEARANCE_REDUCTION,
} from './../../app/shared/constants/dialog-constant';
import {
  MMBaseResponse,
  MMBearingPreflightResponse,
  MMBearingsMaterialResponse,
  MMComplexResponse,
  MMSimpleResponse,
  Report,
  SearchResult,
} from './../../app/shared/models';

export const BEARING_SEARCH_RESULT_MOCK: SearchResult = {
  data: [
    {
      data: {
        id: 'entryId',
        title: 'entryTitle',
      },
      links: [],
      _media: 'dont know what this is',
    },
  ],
};

export const BEARING_CALCULATION_RESULT_MOCK: {
  data: any;
  state: boolean;
  _links: Report[];
} = {
  data: 'the data',
  state: false,
  _links: [],
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

export const BEARING_MATERIAL_RESPONSE_MOCK: MMBearingsMaterialResponse = {
  id: 'the id',
  IDMM_MODULUS_OF_ELASTICITY: 'some value',
  IDMM_POISSON_RATIO: 'some value',
};

export const LOAD_OPTIONS_RESPONSE_MOCK: MMBaseResponse = {
  data: [
    {
      id: 'some id',
      title: 'some title',
    },
  ],
};

export const LOAD_OPTIONS_RESPONSE_MOCK_SIMPLE: MMSimpleResponse = {
  data: [
    {
      data: {
        id: 'mockId',
        title: 'mockTitle',
      },
      _media: [{ href: 'testHref' }],
    },
    {
      data: {
        id: 'mockId2',
        title: 'mockTitle2',
      },
    },
  ],
};

export const LOAD_OPTIONS_RESPONSE_MOCK_COMPLEX: MMComplexResponse = {
  data: {
    bearingSeats: [
      {
        data: {
          id: 'mockId',
          title: 'mockTitle',
        },
        _media: [{ href: 'mockHref' }],
      },
    ],
  },
};

export const JSON_REPORT_RESPONSE_MOCK: BearinxOnlineResult = {
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
