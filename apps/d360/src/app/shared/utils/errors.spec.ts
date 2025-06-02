import { getErrorMessage, isProblemDetail } from './errors';
import { HttpError, NetworkError } from './http-client';

describe('Error Utils', () => {
  describe('isProblemDetail', () => {
    it('should return false for null or undefined', () => {
      expect(isProblemDetail(null)).toBe(false);
      expect(isProblemDetail(undefined as any)).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isProblemDetail('string')).toBe(false);
      expect(isProblemDetail(123)).toBe(false);
      expect(isProblemDetail(true)).toBe(false);
    });

    it('should return false for objects missing required properties', () => {
      expect(isProblemDetail({})).toBe(false);
      expect(isProblemDetail({ title: 'Error' })).toBe(false);
      expect(isProblemDetail({ detail: 'Error details' })).toBe(false);
      expect(isProblemDetail({ title: 'Error', detail: {} })).toBe(false);
    });

    it('should return false for objects with incorrect property types', () => {
      expect(
        isProblemDetail({
          title: 123,
          detail: 'Error details',
          code: null,
          values: null,
        })
      ).toBe(false);
      expect(
        isProblemDetail({
          title: 'Error',
          detail: 123,
          code: null,
          values: null,
        })
      ).toBe(false);
      expect(
        isProblemDetail({
          title: 'Error',
          detail: 'Error details',
          code: 123,
          values: null,
        })
      ).toBe(false);
      expect(
        isProblemDetail({
          title: 'Error',
          detail: 'Error details',
          code: null,
          values: 'not-an-object',
        })
      ).toBe(false);
    });

    it('should return true for valid problem details', () => {
      expect(
        isProblemDetail({
          title: 'Error',
          detail: 'Error details',
          code: null,
          values: null,
        })
      ).toBe(true);
      expect(
        isProblemDetail({
          title: 'Error',
          detail: 'Error details',
          code: 'ERROR_CODE',
          values: null,
        })
      ).toBe(true);
      expect(
        isProblemDetail({
          title: 'Error',
          detail: 'Error details',
          code: null,
          values: { key: 'value' },
        })
      ).toBe(true);
      expect(
        isProblemDetail({
          title: 'Error',
          detail: 'Error details',
          code: 'ERROR_CODE',
          values: { key: 'value' },
        })
      ).toBe(true);
    });
  });

  describe('getErrorMessage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle NetworkError', () => {
      const error = new NetworkError('Network error');
      const message = getErrorMessage(error);

      expect(message).toBe('error.network_error');
    });

    it('should handle standard Error objects', () => {
      const error = new Error('Standard error message');
      const message = getErrorMessage(error);

      expect(message).toBe('Standard error message');
    });

    it('should handle unknown error types', () => {
      const message = getErrorMessage('string error');

      expect(message).toBe('error.unknown');
    });

    it('should handle HttpError with non-problem details', () => {
      const error = new HttpError(500, 'Not a problem detail' as any);
      const message = getErrorMessage(error);

      expect(message).toBe('error.unknown');
    });

    it('should handle HttpError with valid problem details but no code', () => {
      const problemDetail = {
        title: 'Error Title',
        detail: 'Error Detail',
        code: null as any,
        values: null as any,
      };
      const error = new HttpError(500, problemDetail);
      const message = getErrorMessage(error);

      expect(message).toBe('Error Title: Error Detail');
    });

    it('should handle HttpError with valid problem details and code, but no title/detail', () => {
      const problemDetail = {
        title: '',
        detail: '',
        code: 'ERROR_CODE',
        values: null as any,
      };
      const error = new HttpError(500, problemDetail);
      const message = getErrorMessage(error);

      expect(message).toBe('error.error_with_code');
    });

    it('should handle HttpError with custom error message mapper', () => {
      const problemDetail = {
        title: 'Error Title',
        detail: 'Error Detail',
        code: 'CUSTOM_ERROR',
        values: { param: 'value' },
      };
      const error = new HttpError(500, problemDetail);
      const customMessages = {
        CUSTOM_ERROR: (details: any) =>
          `Custom error: ${details.values?.param}`,
      };
      const message = getErrorMessage(error, customMessages);

      expect(message).toBe('Custom error: value');
    });

    it('should handle HttpError with title only', () => {
      const problemDetail = {
        title: 'Error Title',
        detail: '',
        code: null as any,
        values: null as any,
      };
      const error = new HttpError(500, problemDetail);
      const message = getErrorMessage(error);

      expect(message).toBe('Error Title');
    });

    it('should handle HttpError with detail only', () => {
      const problemDetail = {
        title: '',
        detail: 'Error Detail',
        code: null as any,
        values: null as any,
      };
      const error = new HttpError(500, problemDetail);
      const message = getErrorMessage(error);

      expect(message).toBe('Error Detail');
    });
  });
});
