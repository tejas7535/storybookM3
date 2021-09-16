import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';

import { jsonReport } from '../mocks/json-report';
import { reportBodyMock } from '../mocks/report';
import { ReportService } from './report.service';

describe('ReportService testing', () => {
  let spectator: SpectatorHttp<ReportService>;
  const createHttp = createHttpFactory(ReportService);

  beforeEach(() => {
    spectator = createHttp();
  });

  describe('getHtmlReport', () => {
    it('should trigger a GET call', () => {
      const mockRefHtml = 'fakeRefHtml';

      const mock = reportBodyMock;

      spectator.service
        .getHtmlReport(mockRefHtml)
        .subscribe((response: any) => {
          expect(response).toEqual(mock);
        });

      const req = spectator.expectOne('fakeRefHtml', HttpMethod.GET);

      req.flush(mock);
    });
  });

  describe('getJsonReport', () => {
    it('getReport triggers a GET call', () => {
      const mockRefJson = 'fakeRefJson';

      const mock = jsonReport.subordinates;

      spectator.service
        .getJsonReport(mockRefJson)
        .subscribe((response: any) => {
          expect(response).toEqual(mock);
        });
    });
  });
});
