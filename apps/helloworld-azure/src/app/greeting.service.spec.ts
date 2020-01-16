import { HttpRequest } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { GreetingService } from './greeting.service';

import { environment } from '../environments/environment';

describe('GreetingService', () => {
  let service: GreetingService;
  let backend: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [GreetingService],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(GreetingService);
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#greet()', () => {
    test('should return a Observable of type string with the greeting', () => {
      const mockResponse = { greeting: 'Hello, World' };

      service.greet().subscribe(response => {
        expect(response).toEqual('Hello, World');
      });

      const call: TestRequest = backend.expectOne(
        (request: HttpRequest<any>) =>
          !!(
            request.url.match('api/hello') &&
            request.urlWithParams ===
              `${environment.baseUrl}/api/hello?language=en-US` &&
            request.method === 'GET'
          )
      );

      call.flush(mockResponse);
    });
  });
});
