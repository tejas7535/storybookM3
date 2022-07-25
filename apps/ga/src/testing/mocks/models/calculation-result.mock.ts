import { environment } from '@ga/../environments/environment';
import { ReportUrls, Result } from '@ga/shared/models';

export const MODEL_MOCK_ID = `7721e0d0-0dc6-4198-9ba4-cbeaef76cc2f`;

export const CALCULATION_RESULT_MOCK_ID = `9d65b8a9-6575-4dc5-9c92-bdf2c56dc7ed`;

export const REPORT_URLS_MOCK: ReportUrls = {
  htmlReportUrl: `${environment.baseUrl}/${MODEL_MOCK_ID}/body/${CALCULATION_RESULT_MOCK_ID}`,
  jsonReportUrl: `${environment.baseUrl}/${MODEL_MOCK_ID}/output/${CALCULATION_RESULT_MOCK_ID}`,
};

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
