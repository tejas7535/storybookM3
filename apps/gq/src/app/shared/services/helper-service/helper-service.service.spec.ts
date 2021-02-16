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
});
