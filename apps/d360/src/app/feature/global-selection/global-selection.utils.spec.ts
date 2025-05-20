import { HttpClient } from '@angular/common/http';

import { of, take } from 'rxjs';

import { GlobalSelectionStateService } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import * as httpUtils from '../../shared/utils/http-client';
import { GlobalSelectionUtils } from './global-selection.utils';

jest.mock('../../shared/utils/http-client', () => ({
  generateUrlWithSearchTerm: jest.fn(),
}));

describe('GlobalSelectionUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('splitToChunks', () => {
    it('should split an array into chunks of specified length', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8];
      const result = GlobalSelectionUtils.splitToChunks(array, 3);
      expect(result).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8],
      ]);
    });

    it('should return empty array when input array is empty', () => {
      const array: any[] = [];
      const result = GlobalSelectionUtils.splitToChunks(array, 3);
      expect(result).toEqual([]);
    });

    it('should return the original array as a single chunk when length is greater than array length', () => {
      const array = [1, 2, 3];
      const result = GlobalSelectionUtils.splitToChunks(array, 5);
      expect(result).toEqual([[1, 2, 3]]);
    });
  });

  describe('resolveOptions', () => {
    it('should return options with validation errors', (done) => {
      const validateFunc = (value: string) =>
        value === 'invalid' ? ['Error'] : null;
      const values = ['valid', 'invalid'];
      const options = [{ id: 'valid', text: 'Valid Option' }];

      const result = GlobalSelectionUtils.resolveOptions({
        values,
        options,
        validateFunc,
      });

      result.pipe(take(1)).subscribe((res) => {
        expect(res).toEqual([
          { id: 'valid', selectableValue: options[0] },
          { id: 'invalid', error: ['Error'] },
        ]);
        done();
      });
    });

    it('should apply format function when provided', (done) => {
      const formatFunc = (value: string) => value.toUpperCase();
      const values = ['valid'];
      const options = [{ id: 'VALID', text: 'Valid Option' }];

      const result = GlobalSelectionUtils.resolveOptions({
        values,
        options,
        formatFunc,
      });

      result.pipe(take(1)).subscribe((res) => {
        expect(res).toEqual([{ id: 'valid', selectableValue: options[0] }]);
        done();
      });
    });

    it('should return error when option does not exist', (done) => {
      const values = ['invalid'];
      const options: SelectableValue[] = [];

      const result = GlobalSelectionUtils.resolveOptions({
        values,
        options,
      });

      result.pipe(take(1)).subscribe((res) => {
        expect(res).toEqual([{ id: 'invalid', error: ['error.not_valid'] }]);
        done();
      });
    });

    it('should use custom error text function when provided', (done) => {
      const errorTextFunc = (value: string) => `Custom error for ${value}`;
      const values = ['invalid'];
      const options: SelectableValue[] = [];

      const result = GlobalSelectionUtils.resolveOptions({
        values,
        options,
        errorTextFunc,
      });

      result.pipe(take(1)).subscribe((res) => {
        expect(res).toEqual([
          { id: 'invalid', error: ['Custom error for invalid'] },
        ]);
        done();
      });
    });
  });

  describe('resolveOptionsOnType', () => {
    let httpClientMock: jest.Mocked<HttpClient>;

    beforeEach(() => {
      httpClientMock = {
        get: jest.fn(),
      } as any;
      jest
        .spyOn(httpUtils, 'generateUrlWithSearchTerm')
        .mockReturnValue('test-url');
    });

    it('should validate values and return error for invalid values', (done) => {
      const validateFunc = (value: string) =>
        value === 'invalid' ? ['Error'] : null;
      const values = ['valid', 'invalid'];
      httpClientMock.get = jest.fn().mockReturnValue(of([]));

      const result = GlobalSelectionUtils.resolveOptionsOnType({
        values,
        urlBegin: 'api/v1',
        validateFunc,
        http: httpClientMock,
      });

      result.pipe(take(1)).subscribe((res) => {
        expect(res).toHaveLength(2);
        expect(res[1].error).toEqual(['Error']);
        done();
      });
    });

    it('should make HTTP request for valid values and handle success', (done) => {
      const values = ['valid'];
      const mockResponse = [{ id: 'valid', text: 'Valid Option' }];
      httpClientMock.get = jest.fn().mockReturnValue(of(mockResponse));

      const result = GlobalSelectionUtils.resolveOptionsOnType({
        values,
        urlBegin: 'api/v1',
        http: httpClientMock,
      });

      result.pipe(take(1)).subscribe((res) => {
        expect(res).toEqual([
          { id: 'valid', selectableValue: mockResponse[0] },
        ]);
        expect(httpClientMock.get).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should set error when no selectable value is found', (done) => {
      const values = ['unknown'];
      httpClientMock.get = jest.fn().mockReturnValue(of([]));

      const result = GlobalSelectionUtils.resolveOptionsOnType({
        values,
        urlBegin: 'api/v1',
        http: httpClientMock,
      });

      result.pipe(take(1)).subscribe((res) => {
        expect(res).toEqual([
          { id: 'unknown', error: ['Resolving value unknown failed.'] },
        ]);
        done();
      });
    });
  });

  describe('isGlobalSelectionCriteria', () => {
    it('should return true when criteria is in stateKeys', () => {
      (GlobalSelectionStateService as any).stateKeys = ['region', 'salesArea'];

      const result = GlobalSelectionUtils.isGlobalSelectionCriteria('region');

      expect(result).toBe(true);
    });

    it('should return false when criteria is not in stateKeys', () => {
      (GlobalSelectionStateService as any).stateKeys = ['region', 'salesArea'];

      const result =
        GlobalSelectionUtils.isGlobalSelectionCriteria('criteria3');

      expect(result).toBe(false);
    });
  });

  describe('globalSelectionCriteriaToFilter', () => {
    it('should return undefined when criteria is undefined', () => {
      const result = GlobalSelectionUtils.globalSelectionCriteriaToFilter(
        undefined as any
      );

      expect(result).toBeUndefined();
    });

    it('should convert criteria to filter format', () => {
      const criteria = {
        key1: [
          { id: 'value1', text: 'Value 1' },
          { id: 'value2', text: 'Value 2' },
        ],
        key2: [{ id: 'value3', text: 'Value 3' }],
        key3: [], // This should be omitted in the result
      } as any;

      const result =
        GlobalSelectionUtils.globalSelectionCriteriaToFilter(criteria);

      expect(result).toEqual({
        key1: ['value1', 'value2'],
        key2: ['value3'],
      });
    });

    it('should return empty object when criteria has no values', () => {
      const criteria = {
        key1: [],
        key2: [],
      } as any;

      const result =
        GlobalSelectionUtils.globalSelectionCriteriaToFilter(criteria);

      expect(result).toEqual({});
    });
  });
});
