import { mockResponse } from '@lsa/testing/mocks/recommendation.mock';

import { Lubricator } from '../models';
import { RecommendationTableDataPipe } from './recommendation-table-data.pipe';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key) => key),
}));

jest.mock('@lsa/shared/constants', () => ({
  ...jest.requireActual('@lsa/shared/constants'),
  recommendationTableFields: ['volume'],
}));

describe('RecommendationTableDataPipe', () => {
  let pipe: RecommendationTableDataPipe;

  beforeEach(() => {
    pipe = new RecommendationTableDataPipe();
  });

  it('should create', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    beforeEach(() => {
      pipe['getFieldValue'] = jest.fn();
    });

    it('should create the data object', () => {
      const result = pipe.transform(mockResponse.lubricators);

      expect(result).toMatchSnapshot();
      expect(pipe['getFieldValue']).toHaveBeenCalledWith(
        'volume',
        mockResponse.lubricators.minimumRequiredLubricator
      );
      expect(pipe['getFieldValue']).toHaveBeenCalledWith(
        'volume',
        mockResponse.lubricators.recommendedLubricator
      );
    });

    it('should create the data object with identical lubricators', () => {
      const result = pipe.transform({
        minimumRequiredLubricator:
          mockResponse.lubricators.minimumRequiredLubricator,
        recommendedLubricator:
          mockResponse.lubricators.minimumRequiredLubricator,
      });

      expect(result).toMatchSnapshot();
      expect(pipe['getFieldValue']).toHaveBeenCalledWith(
        'volume',
        mockResponse.lubricators.minimumRequiredLubricator
      );
      expect(pipe['getFieldValue']).toHaveBeenCalledWith(
        'volume',
        mockResponse.lubricators.minimumRequiredLubricator
      );
    });

    it('should create the data object without lubricators', () => {
      const result = pipe.transform({});

      expect(result).toMatchSnapshot();
      expect(pipe['getFieldValue']).toHaveBeenCalledWith('volume', undefined);
      expect(pipe['getFieldValue']).toHaveBeenCalledWith('volume', undefined);
    });
  });

  describe('getFieldValue', () => {
    beforeEach(() => {
      pipe['getTranslation'] = jest.fn((key) => key);
    });
    it('should do nothing if lubricator is not defined', () => {
      const result = pipe['getFieldValue']('accessories');

      expect(result).not.toBeDefined();
    });

    it.each([
      ['outputDiameter', '1 centimeter', 1, 'centimeter'],
      ['maxOperatingPressure', '≤ 1 bar', 1, 'bar'],
      ['maxTemp', '1 degreeCelsius', 1, 'degreeCelsius'],
      ['minTemp', '1 degreeCelsius', 1, 'degreeCelsius'],
      ['batteryPowered', 'no', 0, 'no'],
      ['isOptime', 'yes', 1, 'yes'],
      ['volume', '1 millilitre', 1, 'millilitre'],
    ])(
      'should return the transformed field value as string for %p',
      (field, expected, value, expectedKey) => {
        const result = pipe['getFieldValue'](
          field as keyof Lubricator,
          {
            [field]: value,
          } as unknown as Lubricator
        );

        expect(result).toEqual(expected);
        expect(pipe['getTranslation']).toHaveBeenCalledWith(expectedKey);
      }
    );

    it('should return the field value as string in default case', () => {
      const result = pipe['getFieldValue']('noOfOutlets', {
        noOfOutlets: 1,
      } as Lubricator);

      expect(result).toEqual('1');
    });
  });

  describe('getTranslation', () => {
    it('should translate the given key with prefix', () => {
      const result = pipe['getTranslation']('test');

      expect(result).toEqual('recommendation.result.test');
    });
  });
});
