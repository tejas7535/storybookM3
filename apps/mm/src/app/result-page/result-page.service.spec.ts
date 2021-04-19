import { of } from 'rxjs';

import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';

import { environment } from '../../environments/environment';
import { ResultPageService } from './result-page.service';

describe('ResultPageService testing', () => {
  let spectator: SpectatorHttp<ResultPageService>;
  const createHttp = createHttpFactory(ResultPageService);

  beforeEach(() => {
    spectator = createHttp();
  });

  test('getResult triggers a POST call', () => {
    const mock = {
      _links: [
        {
          rel: 'self',
          href: 'mockRefSelf',
        },
        {
          rel: 'pdf',
          href: 'mockRefPdf',
        },
        {
          rel: 'html',
          href: 'mockRefHtml',
        },
        {
          rel: 'body',
          href: 'mockRefBody',
        },
      ],
    };
    const mockFormProperties = {
      data: {},
      state: false,
      _links: [
        {
          rel: 'body',
          href: 'bodyLink',
        },
        {
          rel: 'pdf',
          href: 'pdfLink',
        },
      ],
    };

    const spy = jest
      .spyOn(spectator.service, 'getReport')
      .mockImplementationOnce(() => of('mockHtmlReport'));

    spectator.service.getResult(mockFormProperties).subscribe((response) => {
      expect(response).toEqual(mock);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('mockRefHtml');
    });

    const req = spectator.expectOne(
      `${environment.apiMMBaseUrl}/bearing-calculation`,
      HttpMethod.POST
    );
    expect(req.request.body).toEqual(mockFormProperties);

    req.flush(mock);
  });

  test('getReport triggers a GET call', () => {
    const mockRefHtml = 'fakeRefHtml';
    spectator.service.getReport(mockRefHtml).subscribe();
    spectator.expectOne('fakeRefHtml', HttpMethod.GET);
  });
});
