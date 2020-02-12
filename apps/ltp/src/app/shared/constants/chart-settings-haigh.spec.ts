import { CHART_SETTINGS_HAIGH } from './chart-settings-haigh';

describe('CHART_SETTINGS_HAIGH', () => {
  describe('custonPointFn', () => {
    it('should exist', () => {
      expect(CHART_SETTINGS_HAIGH.customPointFn).toBeDefined();
    });

    it('should return object with visible false', () => {
      const customPoint = CHART_SETTINGS_HAIGH.customPointFn() as {
        visible: boolean;
      };

      expect(customPoint.visible).toEqual(false);
    });
  });
});
