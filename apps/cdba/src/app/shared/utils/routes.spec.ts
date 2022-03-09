import { Params } from '@angular/router';

import {
  checkQueryParamsEquality,
  isCompareRoute,
  isDetailRoute,
  isPortfolioAnalysisRoute,
  isResultsRoute,
  isSearchRoute,
} from './routes';

describe('route utilities', () => {
  let path: string;
  let result: any;
  beforeEach(() => {
    path = undefined;
    result = undefined;
  });
  describe('isSearchRoute', () => {
    it('should return true/false if the given path contains /search', () => {
      path = '/search';
      result = isSearchRoute(path);
      expect(result).toBe(true);

      path = '/detail/detail';
      result = isSearchRoute(path);
      expect(result).toBe(false);
    });
  });

  describe('isResultsRoute', () => {
    it('should return true/false if the given path contains /results', () => {
      path = '/results';
      result = isResultsRoute(path);
      expect(result).toBe(true);

      path = '/detail/detail';
      result = isResultsRoute(path);
      expect(result).toBe(false);
    });
  });

  describe('isDetailRoute', () => {
    it('should return true/false if the given path contains /detail', () => {
      path = '/detail';
      result = isDetailRoute(path);
      expect(result).toBe(true);

      path = '/compare/detail';
      result = isDetailRoute(path);
      expect(result).toBe(false);
    });
  });

  describe('isCompareRoute', () => {
    it('should return true/false if the given path contains /compare', () => {
      path = '/compare';
      result = isCompareRoute(path);
      expect(result).toBe(true);

      path = '/detail/bom';
      result = isCompareRoute(path);
      expect(result).toBe(false);
    });
  });

  describe('isPortfolioAnalysisRoute', () => {
    it('should return true/false if the given path contains /portfolio-analysis', () => {
      path = '/portfolio-analysis';
      result = isPortfolioAnalysisRoute(path);
      expect(result).toBe(true);

      path = '/detail/detail';
      result = isPortfolioAnalysisRoute(path);
      expect(result).toBe(false);
    });
  });

  describe('checkQueryParamsEquality', () => {
    let queryParams1: Params;
    let queryParams2: Params;

    beforeEach(() => {
      queryParams1 = undefined;
      queryParams2 = undefined;
    });
    it('should return true for same queryParams', () => {
      queryParams1 = {
        // x: 'y',
        foo: 'bar',
      };
      queryParams2 = {
        foo: 'bar',
        // x: 'y',
      };

      result = checkQueryParamsEquality(queryParams1, queryParams2);

      expect(result).toBe(true);
    });

    it('should return false for different queryParams', () => {
      queryParams1 = {
        foo: 'bar',
      };
      queryParams2 = {
        foo: 'baz',
      };

      result = checkQueryParamsEquality(queryParams1, queryParams2);

      expect(result).toBe(false);
    });
  });
});
