import { convertCelsiusToFahrenheit } from './temperature-helpers';

describe('Temperature helpers', () => {
  describe('convertCelsiusToFahrenheit', () => {
    it('should convert Celsius to Fahrenheit', () => {
      const resultBoilingWater = convertCelsiusToFahrenheit(100);
      const resultRoomTemperature = convertCelsiusToFahrenheit(20);
      const resultWithDecimals = convertCelsiusToFahrenheit(21);
      const resultFreezingWater = convertCelsiusToFahrenheit(0);
      const resultParity = convertCelsiusToFahrenheit(-40);
      const resultLowTemperatur = convertCelsiusToFahrenheit(-100);
      const resultInvalid = convertCelsiusToFahrenheit(+'a');

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const resultNumberFromString = convertCelsiusToFahrenheit('-10');

      expect(resultBoilingWater).toBe(212);
      expect(resultRoomTemperature).toBe(68);
      expect(resultWithDecimals).toBe(70); // exact value would be 69.8
      expect(resultFreezingWater).toBe(32);
      expect(resultParity).toBe(-40);
      expect(resultLowTemperatur).toBe(-148);
      expect(resultInvalid).toBe(Number.NaN);
      expect(resultNumberFromString).toBe(14);
    });
  });
});
