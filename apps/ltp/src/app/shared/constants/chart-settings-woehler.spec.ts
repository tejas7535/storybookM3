import { CHART_SETTINGS_WOEHLER } from './chart-settings-woehler';

describe('CHART_SETTINGS_WOEHLER', () => {
  describe('custonPointFn', () => {
    it('should exist', () => {
      expect(CHART_SETTINGS_WOEHLER.customPointFn).toBeDefined();
    });

    it('should return object with visible false', () => {
      const customPoint = CHART_SETTINGS_WOEHLER.customPointFn();

      expect(customPoint['visible']).toEqual(false);
    });
  });
});
