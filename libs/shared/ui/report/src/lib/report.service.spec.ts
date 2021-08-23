import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';

import { reportBodyMock } from '../mocks/report';
import { ReportService } from './report.service';

describe('ReportService testing', () => {
  let spectator: SpectatorHttp<ReportService>;
  const createHttp = createHttpFactory(ReportService);

  beforeEach(() => {
    spectator = createHttp();
  });

  test('getReport triggers a GET call', () => {
    const mockRefHtml = 'fakeRefHtml';

    const mock = reportBodyMock;

    spectator.service.getReport(mockRefHtml).subscribe((response) => {
      expect(response).toEqual(mock);
    });

    const req = spectator.expectOne('fakeRefHtml', HttpMethod.GET);

    req.flush(mock);
  });
});
