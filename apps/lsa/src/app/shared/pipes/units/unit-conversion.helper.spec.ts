import {
  celciusToFahrenheit,
  fahrenheitToCelcius,
  feetToMeters,
  metersToFeet,
} from './unit-conversion.helper';

describe('UnitConversion Helper', () => {
  describe('Length units', () => {
    it.each([
      [0, '0.00'],
      [1, '3.28'],
      [10, '32.81'],
    ])('%f meters should equal %f ft', (input, expected) => {
      expect(metersToFeet(input).toFixed(2)).toEqual(expected);
    });

    it.each([
      [0, '0.00'],
      [6, '1.83'],
      [420, '128.02'],
    ])('%f feet should equal %f meters', (input, expected) => {
      expect(feetToMeters(input).toFixed(2)).toEqual(expected);
    });
  });

  describe('temperature units', () => {
    it.each([
      [0, '32.00'],
      [-10, '14.00'],
      [70, '158.00'],
    ])('%f °C should be %f in °F', (input, expected) => {
      expect(celciusToFahrenheit(input).toFixed(2)).toEqual(expected);
    });

    it.each([
      [32, '0.00'],
      [158, '70.00'],
      [0, '-17.78'],
    ])('%f °F should be %f in °C', (input, expected) => {
      expect(fahrenheitToCelcius(input).toFixed(2)).toEqual(expected);
    });
  });
});
