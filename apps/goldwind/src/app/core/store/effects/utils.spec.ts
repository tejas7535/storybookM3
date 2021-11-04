import { Interval } from '../reducers/shared/models';
import { actionInterval } from './utils';

describe('Effect Utils', () => {
  describe('actionInterval', () => {
    it('should return a callback function return a object with Interval an id', () => {
      const actionMiddleware = actionInterval();
      const startDate = 12_334;
      const endDate = 12_335;
      const deviceId = 'G-Wing';

      const expectReturn = actionMiddleware(
        [{ deviceId }, { startDate, endDate } as Interval],
        0
      );

      expect(expectReturn.start).toBe(startDate);
      expect(expectReturn.end).toBe(endDate);
      expect(expectReturn.id).toBe(deviceId);
    });
  });
});
