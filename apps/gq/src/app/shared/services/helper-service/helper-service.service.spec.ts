import { HelperService } from './helper-service.service';

describe('HelperServiceService', () => {
  describe('getCurrentYear', () => {
    test('get year', () => {
      Date.prototype.getFullYear = jest.fn(() => 2020);
      expect(HelperService.getCurrentYear()).toEqual(2020);
      expect(Date.prototype.getFullYear).toHaveBeenCalledTimes(1);
    });
  });
  describe('getLastYear', () => {
    test('get year', () => {
      HelperService.getCurrentYear = jest.fn(() => 2020);
      expect(HelperService.getLastYear()).toEqual(2019);
      expect(HelperService.getCurrentYear).toHaveBeenCalledTimes(1);
    });
  });

  describe('transformNumber', () => {
    test('should transform Number with digits', () => {
      const result = HelperService.transformNumber(10000, true);

      expect(result).toEqual('10,000.00');
    });
    test('should transform Number without digits', () => {
      const result = HelperService.transformNumber(10000, false);

      expect(result).toEqual('10,000');
    });
  });

  describe('transformNumberCurrency', () => {
    test('should transform NumberCurrency', () => {
      const result = HelperService.transformNumberCurrency('10000', 'EUR');

      expect(result).toEqual('10000 EUR');
    });
    test('should return undefined', () => {
      const result = HelperService.transformNumberCurrency(undefined, 'EUR');

      expect(result).toEqual('-');
    });
  });
  describe('transformMarginDetails', () => {
    test('should transformMarginDetails', () => {
      HelperService.transformNumber = jest.fn();
      HelperService.transformNumberCurrency = jest.fn();

      HelperService.transformMarginDetails(1000, 'EUR');

      expect(HelperService.transformNumberCurrency).toHaveBeenCalledTimes(1);
      expect(HelperService.transformNumber).toHaveBeenCalledTimes(1);
    });
  });
});
