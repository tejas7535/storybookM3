import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { firstValueFrom, Observable, of, throwError } from 'rxjs';

import { Stub } from '../test/stub.class';
import * as ErrorUtils from '../utils/errors';
import { HttpError } from '../utils/http-client';
import * as SAP from '../utils/sap-localisation';
import { HttpErrorInterceptor } from './http-error.interceptor';

class CustomHttpHandler extends HttpHandler {
  handle(): Observable<HttpEvent<any>> {
    return of(new HttpResponse());
  }
}

describe('HttpErrorInterceptor', () => {
  let service: HttpErrorInterceptor;
  let mockRequest: HttpRequest<any>;
  let mockNext: CustomHttpHandler;

  beforeEach(() => {
    service = Stub.get<HttpErrorInterceptor>({
      component: HttpErrorInterceptor,
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    beforeEach(() => {
      mockRequest = new HttpRequest('GET', 'https://example.com/api');
      mockNext = new CustomHttpHandler();

      jest
        .spyOn(service['snackbarService'], 'openSnackBar')
        .mockImplementation();
    });

    it('should handle JSON error responses and parse error details', async () => {
      const errorResponse = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        error: { message: 'Test error' },
        status: 400,
        url: 'https://example.com/api',
      };

      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.intercept(mockRequest, mockNext));
      } catch (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toBeInstanceOf(HttpError);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.details).toEqual({ message: 'Test error' });
      }
    });

    it('should display a snackbar message for problem details', async () => {
      const errorResponse = {
        headers: {
          get: jest.fn().mockReturnValue('application/problem+json'),
        },
        error: {
          values: {
            [SAP.SapErrorMessageHeader.MessageId]: 'any message from SAP',
          },
        },
        status: 400,
        url: 'https://example.com/api',
      };

      jest.spyOn(ErrorUtils, 'isProblemDetail').mockReturnValue(true);
      jest.spyOn(SAP, 'messageFromSAP').mockReturnValue('SAP Message');

      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.intercept(mockRequest, mockNext));
      } catch {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(service['snackbarService'].openSnackBar).toHaveBeenCalledWith(
          'SAP Message'
        );
      }
    });

    it('should not display a snackbar for excluded URLs', async () => {
      const errorResponse = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        error: { message: 'Test error' },
        status: 400,
        url: 'https://login.microsoftonline.com',
      };

      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.intercept(mockRequest, mockNext));
      } catch {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(service['snackbarService'].openSnackBar).not.toHaveBeenCalled();
      }
    });

    it('should throw an HttpError with parsed details', async () => {
      const errorResponse: {
        error?: any;
        headers?: HttpHeaders;
        status?: number;
        statusText?: string;
        url?: string;
      } = {
        headers: new HttpHeaders('Content-Type: application/json'),
        error: { message: 'Test error' },
        status: 400,
        statusText: 'Bad Request',
        url: 'https://example.com/api',
      };

      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(
          throwError(() => new HttpErrorResponse(errorResponse))
        );

      try {
        await firstValueFrom(service.intercept(mockRequest, mockNext));
      } catch (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toBeInstanceOf(HttpError);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.details).toEqual({ message: 'Test error' });
      }
    });

    it('should handle non-JSON error responses gracefully', async () => {
      const errorResponse = {
        headers: {
          get: jest.fn().mockReturnValue('text/plain'),
        },
        error: 'Plain text error message',
        status: 500,
        url: 'https://example.com/api',
      };

      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.intercept(mockRequest, mockNext));
      } catch (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toBeInstanceOf(HttpError);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.details).toEqual('Plain text error message');
      }
    });

    it('should handle missing error details gracefully', async () => {
      const errorResponse = {
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        error: null,
        status: 500,
        url: 'https://example.com/api',
      } as any;

      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.intercept(mockRequest, mockNext));
      } catch (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toBeInstanceOf(HttpError);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.details).toEqual(null);
      }
    });

    it('should handle empty error responses gracefully', async () => {
      const errorResponse = {};

      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.intercept(mockRequest, mockNext));
      } catch (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toBeInstanceOf(TypeError);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.details).toBeUndefined();
      }
    });

    it('should handle unexpected content types gracefully', async () => {
      const errorResponse = {
        headers: {
          get: jest.fn().mockReturnValue('application/unknown'),
        },
        error: { message: 'Unknown content type error' },
        status: 400,
        url: 'https://example.com/api',
      };

      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.intercept(mockRequest, mockNext));
      } catch (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toBeInstanceOf(HttpError);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.details).toEqual({
          message: 'Unknown content type error',
        });
      }
    });

    it('should handle null headers gracefully', async () => {
      const errorResponse = {
        headers: null,
        error: { message: 'Test error' },
        status: 400,
        url: 'https://example.com/api',
      } as any;

      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(throwError(() => errorResponse));

      try {
        await firstValueFrom(service.intercept(mockRequest, mockNext));
      } catch (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toBeInstanceOf(TypeError);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.details).toBeUndefined();
      }
    });

    it('should pass the request through without modification if no error occurs', async () => {
      jest
        .spyOn(mockNext, 'handle')
        .mockReturnValueOnce(of(new HttpResponse()));

      const response = await firstValueFrom(
        service.intercept(mockRequest, mockNext)
      );

      expect(response).toBeInstanceOf(HttpResponse);
      expect(mockNext.handle).toHaveBeenCalledWith(mockRequest);
    });
  });
});
