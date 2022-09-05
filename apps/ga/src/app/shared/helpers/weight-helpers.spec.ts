import { convertGramToOunces } from './weight-helpers';

describe('Weight helpers', () => {
  describe('convertGramToOunces', () => {
    it('should convert Gram to Ounces', () => {
      const resultOneGram = convertGramToOunces(1);
      const resultInvalid = convertGramToOunces(+'a');

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const resultNumberFromString = convertGramToOunces('-1');

      expect(resultOneGram).toBe(0.035);
      expect(resultInvalid).toBe(Number.NaN);
      expect(resultNumberFromString).toBe(-0.035);
    });
  });
});
