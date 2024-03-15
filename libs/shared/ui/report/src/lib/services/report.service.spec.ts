import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';

import { reportBodyMock } from '../../mocks';
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

      const req = spectator.expectOne(mockRefHtml, HttpMethod.GET);

      req.flush(mock);
    });
  });
});
