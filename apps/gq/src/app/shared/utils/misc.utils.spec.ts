import { Keyboard } from '../models';
import * as miscUtils from './misc.utils';

describe('MiscUtils', () => {
  describe('getCurrentYear', () => {
    test('getCurrentYear', () => {
      Date.prototype.getFullYear = jest.fn(() => 2020);
      expect(miscUtils.getCurrentYear()).toEqual(2020);
      expect(Date.prototype.getFullYear).toHaveBeenCalledTimes(1);
    });

    test('getLastYear', () => {
      jest.spyOn(miscUtils, 'getCurrentYear').mockReturnValue(2020);
      expect(miscUtils.getLastYear()).toEqual(2019);
      expect(miscUtils.getCurrentYear).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateQuantityInputKeyPress', () => {
    test('should prevent default on invalid input', () => {
      const event = { key: 'a', preventDefault: jest.fn() } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
    test('should not prevent default when input is a number', () => {
      const event = { key: '1', preventDefault: jest.fn() } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
    test('should not prevent default when input is paste event', () => {
      const event = {
        key: 'v',
        preventDefault: jest.fn(),
        ctrlKey: true,
      } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });

    test('should not prevent default when input is paste event on macOs', () => {
      const event = {
        key: 'v',
        preventDefault: jest.fn(),
        ctrlKey: false,
        metaKey: true,
      } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });

    test('should not prevent default when input is delete key', () => {
      const event = {
        key: Keyboard.BACKSPACE,
        preventDefault: jest.fn(),
      } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
  });

  describe('parseLocalizedInputValue', () => {
    [
      {
        locale: 'de-DE',
        inputs: [
          undefined,
          '100',
          '1.000',
          '1.000.000',
          '1.000.000,45678',
          '10,23',
          '1,5',
        ],
        expectedOutputs: [
          0, 100, 1000, 1_000_000, 1_000_000.456_78, 10.23, 1.5,
        ],
      },
      {
        locale: 'en-US',
        inputs: [
          undefined,
          '100',
          '1,000',
          '1,000,000',
          '1,000,000.45678',
          '10.23',
          '1.5',
        ],
        expectedOutputs: [
          0, 100, 1000, 1_000_000, 1_000_000.456_78, 10.23, 1.5,
        ],
      },
    ].forEach((testCase) => {
      testCase.inputs.forEach((input, index) => {
        test(`should return ${testCase.expectedOutputs[index]} for ${testCase.inputs[index]} for locale ${testCase.locale}`, () => {
          const result = miscUtils.parseLocalizedInputValue(
            input,
            testCase.locale
          );

          expect(result).toEqual(testCase.expectedOutputs[index]);
        });
      });
    });
  });

  describe('parseNullableLocalizedInputValue', () => {
    [
      {
        locale: 'de-DE',
        inputs: [
          undefined,
          '100',
          '1.000',
          '1.000.000',
          '1.000.000,45678',
          '10,23',
          '1,5',
        ],
        expectedOutputs: [
          undefined,
          100,
          1000,
          1_000_000,
          1_000_000.456_78,
          10.23,
          1.5,
        ],
      },
      {
        locale: 'en-US',
        inputs: [
          undefined,
          '100',
          '1,000',
          '1,000,000',
          '1,000,000.45678',
          '10.23',
          '1.5',
        ],
        expectedOutputs: [
          undefined,
          100,
          1000,
          1_000_000,
          1_000_000.456_78,
          10.23,
          1.5,
        ],
      },
    ].forEach((testCase) => {
      testCase.inputs.forEach((input, index) => {
        test(`should return ${testCase.expectedOutputs[index]} for ${testCase.inputs[index]} for locale ${testCase.locale}`, () => {
          const result = miscUtils.parseNullableLocalizedInputValue(
            input,
            testCase.locale
          );

          expect(result).toEqual(testCase.expectedOutputs[index]);
        });
      });
    });
  });

  describe('calculateDuration', () => {
    test('should return undefined if startDate is undefined', () => {
      expect(
        miscUtils.calculateDuration(undefined, '2023-07-10T06:36:46.8018708Z')
      ).toBeUndefined();
    });

    test('should return undefined if endDate is empty', () => {
      expect(
        miscUtils.calculateDuration('2023-07-10T06:36:46.8018708Z', '')
      ).toBeUndefined();
    });

    test('should return correct duration', () => {
      expect(
        miscUtils.calculateDuration(
          '2021-02-28T00:00:00Z',
          '2023-06-12T00:00:00Z'
        )
      ).toEqual({ years: 2, months: 3, days: 12 });
    });
    test('should cound commenced day as additional day', () => {
      expect(
        miscUtils.calculateDuration(
          '2021-02-28T10:00:00Z',
          '2023-06-12T00:00:00Z'
        )
      ).toEqual({ years: 2, months: 3, days: 12 });
    });
  });
});
