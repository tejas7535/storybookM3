import { HttpContext, HttpRequest, HttpResponse } from '@angular/common/http';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  AUTO_CONFIGURE_APPLICATION_JSON_HEADER,
  HeadersInterceptor,
} from './headers.interceptor';

describe('HeadersInterceptor', () => {
  let spectator: SpectatorService<HeadersInterceptor>;

  const createService = createServiceFactory({
    service: HeadersInterceptor,
  });

  const dummyRequest = {
    headers: { set: jest.fn() },
    clone: () => dummyRequest,
    context: new HttpContext().set(
      AUTO_CONFIGURE_APPLICATION_JSON_HEADER,
      true
    ),
  } as unknown as HttpRequest<any>;

  const interceptWithResponse = (response: HttpResponse<any>) => {
    spectator.service
      .intercept(dummyRequest, {
        handle: () => of(response),
      })
      .subscribe();
  };

  beforeEach(() => {
    spectator = createService();
  });

  it('should add content type header for non api calls', () => {
    interceptWithResponse(new HttpResponse<any>({}));

    expect(dummyRequest.headers.set).toHaveBeenCalledWith(
      'Content-Type',
      'application/json'
    );
  });
});
