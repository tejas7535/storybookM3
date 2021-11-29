import { Color } from '../../shared/models/color.enum';
import {
  calculateColor,
  getColorRangeFromGradient,
  pickHex,
} from './feature-importance.utils';

describe('feature-imoprtance-utils', () => {
  describe('calculateColor', () => {
    test('should return dark grey when weight undefined', () => {
      expect(calculateColor(undefined as number)).toEqual(Color.DARK_GREY);
    });

    test('should return dark grey when weight equals 0', () => {
      expect(calculateColor(0)).toEqual(Color.DARK_GREY);
    });

    test('should return red when weight equals 1', () => {
      expect(calculateColor(1)).toEqual(Color.RED_RGB);
    });

    test('should return blue when weight close to 0', () => {
      expect(calculateColor(0.1)).toEqual('rgb(22, 137, 235)');
    });

    test('should return darker blue when weight quite close to 0', () => {
      expect(calculateColor(0.2)).toEqual('rgb(41, 127, 230)');
    });

    test('should return violet when weight close to 0.5', () => {
      expect(calculateColor(0.5)).toEqual('rgb(97, 97, 215)');
    });

    test('should return light red when weight close to 1', () => {
      expect(calculateColor(0.9)).toEqual('rgb(235, 35, 81)');
    });
  });

  describe('pickHex', () => {
    test('should return violet when looking for color in half of red and blue', () => {
      const color1 = [235, 35, 81];
      const color2 = [22, 137, 235];
      const weight = 0.5;

      const result = pickHex(color1, color2, weight);

      expect(result).toEqual([129, 86, 158]);
    });

    test('should return light green when looking for color in half of yellow and light green', () => {
      const color1 = [255, 255, 0];
      const color2 = [0, 236, 255];
      const weight = 0.5;

      const result = pickHex(color1, color2, weight);

      expect(result).toEqual([128, 246, 128]);
    });
  });

  describe('getColorRangeFromGradient', () => {
    const gradient = [
      [0, [3, 147, 240]],
      [50, [97, 97, 215]],
      [75, [211, 33, 149]],
      [100, [251, 36, 36]],
    ];

    test('should return color range from 1 and 2 of gradient when percent is 75', () => {
      const percent = 75;

      const result = getColorRangeFromGradient(percent, gradient);

      expect(result).toEqual([1, 2]);
    });

    test('should return color range from 2 and 3 of gradient when percent is 76', () => {
      const percent = 76;

      const result = getColorRangeFromGradient(percent, gradient);

      expect(result).toEqual([2, 3]);
    });
  });
});
