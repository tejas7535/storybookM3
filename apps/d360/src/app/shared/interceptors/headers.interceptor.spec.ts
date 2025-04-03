import { environment } from '../../../environments/environment';
import { Stub } from '../test/stub.class';
import {
  AUTO_CONFIGURE_APPLICATION_JSON_HEADER,
  HeadersInterceptor,
} from './headers.interceptor';

describe('HeadersInterceptor', () => {
  let service: HeadersInterceptor;

  beforeEach(() => {
    service = Stub.get<HeadersInterceptor>({
      component: HeadersInterceptor,
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    let mockRequest: any;
    let mockNext: any;

    beforeEach(() => {
      mockRequest = {
        headers: {
          keys: jest.fn().mockReturnValue(['header1', 'header2']),
          get: jest.fn((key) => `value-${key}`),
        },
        context: {
          get: jest.fn(),
        },
        url: '/api/test',
        clone: jest.fn(),
      };

      mockNext = {
        handle: jest.fn(),
      };

      jest
        .spyOn(service['translocoService'], 'getActiveLang')
        .mockReturnValue('en');
    });

    it('should clone the request with existing headers', () => {
      mockRequest.context.get.mockReturnValue(false);
      mockRequest.url = 'api/test';

      service.intercept(mockRequest, mockNext);

      expect(mockRequest.clone).toHaveBeenCalledWith({
        setHeaders: {
          header1: 'value-header1',
          header2: 'value-header2',
          'Accept-Language': 'en',
          language: 'en',
        },
      });
    });

    it('should add Content-Type header if AUTO_CONFIGURE_APPLICATION_JSON_HEADER is true', () => {
      mockRequest.context.get.mockReturnValue(true);
      mockRequest.url = '';

      service.intercept(mockRequest, mockNext);

      expect(mockRequest.clone).toHaveBeenCalledWith({
        setHeaders: {
          header1: 'value-header1',
          header2: 'value-header2',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should add language and Accept-Language headers for API requests', () => {
      mockRequest.context.get.mockReturnValue(false);
      mockRequest.url = `/${environment.apiUrl}/test`;

      service.intercept(mockRequest, mockNext);

      expect(mockRequest.clone).toHaveBeenCalledWith({
        setHeaders: {
          header1: 'value-header1',
          header2: 'value-header2',
          language: 'en',
          'Accept-Language': 'en',
        },
      });
    });

    it('should call next.handle with the cloned request', () => {
      const clonedRequest = { url: '/api/test-cloned' };
      mockRequest.clone.mockReturnValue(clonedRequest);

      service.intercept(mockRequest, mockNext);

      expect(mockNext.handle).toHaveBeenCalledWith(clonedRequest);
    });
  });

  describe('AUTO_CONFIGURE_APPLICATION_JSON_HEADER', () => {
    it('should return true as the default value', () => {
      const tokenValue = AUTO_CONFIGURE_APPLICATION_JSON_HEADER.defaultValue();
      expect(tokenValue).toBe(true);
    });
  });
});
