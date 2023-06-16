import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { GreetingService } from './greeting.service';

describe('GreetingService', () => {
  let service: GreetingService;
  let spectator: SpectatorService<GreetingService>;
  let backend: HttpTestingController;

  const createService = createServiceFactory({
    service: GreetingService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    backend = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {
    test('should return default message', (done) => {
      GreetingService['handleError']({
        status: 200,
      } as unknown as HttpErrorResponse).subscribe((message) => {
        expect(message).toEqual('Server is currently unavailable! 🤬');
        done();
      });
    });

    test('should return forbidden message for 403', (done) => {
      GreetingService['handleError']({
        status: 403,
      } as unknown as HttpErrorResponse).subscribe((message) => {
        expect(message).toEqual(
          'Unfortunately, you are not allowed to listen! 😔'
        );
        done();
      });
    });
  });

  describe('getGreetingFromAPI', () => {
    test('should return greeting message', (done) => {
      const mockResponse = { greeting: 'Hello, World' };

      service['getGreetingFromAPI'](`/admin/api/hello`).subscribe(
        (response) => {
          expect(response).toEqual('Hello, World');
          done();
        }
      );

      const call = backend.expectOne(`/admin/api/hello`);

      call.flush(mockResponse);
    });

    test('should call handleError on failed request', (done) => {
      GreetingService['handleError'] = jest
        .fn()
        .mockImplementation(() => of('test'));
      const mockErrorResponse = { message: 'failed' };

      service['getGreetingFromAPI'](`/admin/api/hello`).subscribe((_) => {
        expect(GreetingService['handleError']).toHaveBeenCalledTimes(1);
        done();
      });

      const call = backend.expectOne(`/admin/api/hello`);

      call.flush(
        { message: mockErrorResponse.message },
        { status: 403, statusText: '' }
      );
    });
  });

  describe('greetPublic()', () => {
    test('should call getGreetingFromAPI', () => {
      const mock = of('test');
      service['getGreetingFromAPI'] = jest.fn().mockImplementation(() => mock);

      const result = service.greetPublic();

      expect(service['getGreetingFromAPI']).toHaveBeenCalled();
      expect(result).toEqual(mock);
    });
  });

  describe('greetAuthorized()', () => {
    test('should call getGreetingFromAPI', () => {
      const mock = of('test');
      service['getGreetingFromAPI'] = jest.fn().mockImplementation(() => mock);

      const result = service.greetAuthorized();

      expect(service['getGreetingFromAPI']).toHaveBeenCalled();
      expect(result).toEqual(mock);
    });
  });

  describe('greetUsers()', () => {
    test('should call getGreetingFromAPI', () => {
      const mock = of('test');
      service['getGreetingFromAPI'] = jest.fn().mockImplementation(() => mock);

      const result = service.greetUsers();

      expect(service['getGreetingFromAPI']).toHaveBeenCalled();
      expect(result).toEqual(mock);
    });
  });

  describe('greetDotNetPublic()', () => {
    test('should call getGreetingFromAPI', () => {
      const mock = of('test');
      service['getGreetingFromAPI'] = jest.fn().mockImplementation(() => mock);

      const result = service.greetDotNetPublic();

      expect(service['getGreetingFromAPI']).toHaveBeenCalled();
      expect(result).toEqual(mock);
    });
  });

  describe('greetAdmins()', () => {
    test('should call getGreetingFromAPI', () => {
      const mock = of('test');
      service['getGreetingFromAPI'] = jest.fn().mockImplementation(() => mock);

      const result = service.greetAdmins();

      expect(service['getGreetingFromAPI']).toHaveBeenCalled();
      expect(result).toEqual(mock);
    });
  });
});
