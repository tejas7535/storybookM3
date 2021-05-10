import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { environment } from '../../environments/environment';
import { RSY_BEARING } from '../shared/constants/dialog-constant';
import { LazyListLoaderService } from './lazy-list-loader.service';

describe('LazyListLoaderService testing', () => {
  let service: LazyListLoaderService;
  let spectator: SpectatorService<LazyListLoaderService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: LazyListLoaderService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('loadOptions should call preflight if url ends with preflight', () => {
    const mockUrl = `mockUrl${environment.preflightPath}`;
    const mockValues = [
      {
        name: 'mockName',
        value: 'mockValue',
      },
    ];

    service['preflight'] = jest.fn();

    service.loadOptions(mockUrl, mockValues);

    expect(service['preflight']).toHaveBeenCalledTimes(1);
  });

  test('loadOptions trigger a MM response varints http GET call if no preflight url (complex data)', () => {
    const mock = {
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
    } as any;
    const mockUrl = `mockUrlAnyEnding`;
    const mockValues = [
      {
        name: 'mockName',
        value: 'mockValue',
      },
    ];

    service
      .loadOptions(mockUrl, mockValues)
      .subscribe((response) => expect(response).toEqual(mock));

    const req = httpMock.expectOne(`${mockUrl}?cache$=true`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  test('loadOptions trigger a MM response varints http GET call if no preflight url (simple data)', () => {
    const mock = {
      data: [
        {
          data: {
            id: 'mocId',
            title: 'mockTitle',
          },
          media: [{ href: 'testHref' }],
        },
      ],
    } as any;
    const mockUrl = `mockUrlAnyEnding`;
    const mockValues = [
      {
        name: 'mockName',
        value: 'mockValue',
      },
    ];

    service
      .loadOptions(mockUrl, mockValues)
      .subscribe((response) => expect(response).toEqual(mock));

    const req = httpMock.expectOne(`${mockUrl}?cache$=true`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  test('preflight should trigger a bearing preflight http GET request', () => {
    const mock = { data: { input: [] } } as any;
    const mockUrl = `mockUrl`;
    const mockValues = [
      {
        name: 'mockName',
        value: 'mockValue',
      },
      {
        name: RSY_BEARING,
        value: 'mockValue',
      },
    ];

    service['preflight'](mockUrl, mockValues).subscribe((response) =>
      expect(response).toEqual(mock)
    );

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mock);
  });
});
