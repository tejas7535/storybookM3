export const metersToFeet = (meters: number): number => meters * 3.280_839_9;
export const feetToMeters = (feet: number) => feet / 3.280_839_9;

export const celciusToFahrenheit = (celcius: number) => celcius * 1.8 + 32;
export const fahrenheitToCelcius = (fahrenheit: number) =>
  (fahrenheit - 32) / 1.8;

export const mlToFlz = (ml: number) => ml * 0.033;
