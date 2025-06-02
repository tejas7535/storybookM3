import {
  generateUrlWithSearchTerm,
  HttpError,
  NetworkError,
  RequestAbortedError,
} from './http-client';

describe('http-client utils', () => {
  describe('generateUrlWithSearchTerm', () => {
    it('should generate URL with search term', () => {
      const url = 'https://api.example.com/search';
      const searchTerm = 'test query';

      const result = generateUrlWithSearchTerm(url, searchTerm);

      expect(result).toBe('https://api.example.com/search?search=test+query');
    });

    it('should generate URL with search term and language', () => {
      const url = 'https://api.example.com/search';
      const searchTerm = 'test query';
      const language = 'en';

      const result = generateUrlWithSearchTerm(url, searchTerm, language);

      expect(result).toBe(
        'https://api.example.com/search?search=test+query&language=en'
      );
    });

    it('should properly encode special characters in search term', () => {
      const url = 'https://api.example.com/search';
      const searchTerm = 'test & query+with spaces';

      const result = generateUrlWithSearchTerm(url, searchTerm);

      expect(result).toBe(
        'https://api.example.com/search?search=test+%26+query%2Bwith+spaces'
      );
    });
  });

  describe('HttpError', () => {
    it('should create an instance with statusCode and details', () => {
      const statusCode = 404;
      const details = { message: 'Resource not found' };

      const error = new HttpError(statusCode, details);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('HttpError: 404');
      expect(error.statusCode).toBe(statusCode);
      expect(error.details).toBe(details);
    });
  });

  describe('NetworkError', () => {
    it('should create an instance of Error', () => {
      const error = new NetworkError('Network connection failed');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Network connection failed');
    });
  });

  describe('RequestAbortedError', () => {
    it('should create an instance of Error', () => {
      const error = new RequestAbortedError('Request was aborted');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Request was aborted');
    });
  });
});
