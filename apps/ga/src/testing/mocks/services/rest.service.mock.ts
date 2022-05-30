import { Property, ReportUrls, Result } from '@ga/shared/models';

import { environment } from '../../../environments/environment';

export const BEARING_SEARCH_RESULT_MOCK: string[] = [
  'Bearing Number 1',
  'Bearing Number 2',
  'Bearing Number 69',
];

/* eslint-disable unicorn/numeric-separators-style, unicorn/no-zero-fractions */
export const MOCK_PROPERTIES: Property[] = [
  {
    name: 'IDCO_IDENTIFICATION',
    value: '1ea5c8b9-a564-4341-b4df-b0eb54a1f01d',
  },
  { name: 'IDCO_DESIGNATION', value: '6005' },
  { name: 'IDL_CONSTRUCTIONTYPE', value: 'LB_RADIAL_RILLENKUGELLAGER' },
  { name: 'IDL_SERIE', value: 'LB_60' },
  { name: 'IDSU_DA', value: 47.0 },
  { name: 'IDSU_DI', value: 25.0 },
  { name: 'IDSU_B', value: 12.0 },
  { name: 'IDL_RADIAL_INSTALLATION_CODE', value: 'IC_FIXED' },
  { name: 'IDL_AXIAL_POSITIVE_INSTALLATION_CODE', value: 'IC_FIXED' },
  { name: 'IDL_AXIAL_NEGATIVE_INSTALLATION_CODE', value: 'IC_FIXED' },
  { name: 'IDCO_RADIAL_LOAD', value: 0.0, dimension1: 0 },
  { name: 'IDCO_AXIAL_LOAD', value: 0.0, dimension1: 0 },
  { name: 'IDL_RELATIVE_SPEED_WITHOUT_SIGN', value: 0.0, dimension1: 0 },
  { name: 'IDL_AXIAL_LOAD_RELATED_FRICTION', value: 0.0, dimension1: 0 },
  { name: 'IDL_LOAD_RELATED_FRICTION', value: 0.0, dimension1: 0 },
  { name: 'IDLC_TYPE_OF_MOVEMENT', value: 'LB_ROTATING' },
  { name: 'IDLC_OSCILLATION_ANGLE', value: 360.0000000000008 },
  { name: 'IDLC_MOVEMENT_FREQUENCY', value: 0.0 },
  { name: 'IDSLC_TEMPERATURE', value: 20.0 },
  { name: 'IDSCO_OILTEMP', value: 70.0, dimension1: 0 },
  { name: 'IDSCO_INFLUENCE_OF_AMBIENT', value: 'LB_AVERAGE_AMBIENT_INFLUENCE' },
];
/* eslint-enable unicorn/numeric-separators-style, unicorn/no-zero-fractions */

export const MODEL_MOCK_ID = `7721e0d0-0dc6-4198-9ba4-cbeaef76cc2f`;

export const CALCULATION_RESULT_MOCK_ID = `9d65b8a9-6575-4dc5-9c92-bdf2c56dc7ed`;

export const CALCULATION_RESULT_MOCK: Result = {
  data: undefined,
  state: false,
  _links: [
    {
      href: `https://caeonlinecalculation-d.schaeffler.com/BearinxWebApi/v1.2/greaseservice/${CALCULATION_RESULT_MOCK_ID}`,
      rel: 'result',
    },
    {
      href: `https://caeonlinecalculation-d.schaeffler.com/BearinxWebApi/v1.2/greaseservice/${CALCULATION_RESULT_MOCK_ID}`,
      rel: 'html',
    },
    {
      href: `https://caeonlinecalculation-d.schaeffler.com/BearinxWebApi/v1.2/greaseservice/${CALCULATION_RESULT_MOCK_ID}`,
      rel: 'output',
    },
  ],
};

export const REPORT_URLS_MOCK: ReportUrls = {
  htmlReportUrl: `${environment.baseUrl}/${MODEL_MOCK_ID}/body/${CALCULATION_RESULT_MOCK_ID}`,
  jsonReportUrl: `${environment.baseUrl}/${MODEL_MOCK_ID}/output/${CALCULATION_RESULT_MOCK_ID}`,
};
