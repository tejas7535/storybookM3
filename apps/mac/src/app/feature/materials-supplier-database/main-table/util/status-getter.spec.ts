import { Status } from '@mac/msd/constants';

import { getRecentlyChanged, getStatus, RECENT_DAYS } from './status-getter';

describe('status getter', () => {
  describe('getStatus', () => {
    it('should return blocked if blocked is true', () => {
      const result = getStatus(true, Date.now());

      expect(result).toEqual(Status.BLOCKED);
    });

    it('should return changed if the date modified is within RECENT_DAYS', () => {
      const result = getStatus(false, Date.now() - 1);

      expect(result).toEqual(Status.CHANGED);
    });

    it('should return default', () => {
      const result = getStatus(
        false,
        (Date.now() - (RECENT_DAYS + 10) * 24 * 3600 * 1000) / 1000
      );

      expect(result).toEqual(Status.DEFAULT);
    });
  });

  describe('getRecentlyChanged', () => {
    it('should return true if lastModified is within RECENT_DAYS', () => {
      const result = getRecentlyChanged(
        (Date.now() - (RECENT_DAYS - 1) * 24 * 3600 * 1000) / 1000
      );

      expect(result).toBe(true);
    });

    it('should return false if lastModified is not within RECENT_DAYS', () => {
      const result = getRecentlyChanged(
        (Date.now() - (RECENT_DAYS + 1) * 24 * 3600 * 1000) / 1000
      );

      expect(result).toBe(false);
    });
  });
});
