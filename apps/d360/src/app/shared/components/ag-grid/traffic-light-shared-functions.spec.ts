import {
  trafficLightValueFormatter,
  trafficLightValues,
} from './traffic-light-shared-functions';

describe('Traffic Light Shared Functions', () => {
  describe('trafficLightValues', () => {
    it('should contain the expected values', () => {
      expect(trafficLightValues).toEqual(['GREEN', 'YELLOW', 'RED', 'GREY']);
    });
  });

  describe('trafficLightValueFormatter', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      ['GREEN', 'GREEN'],
      ['YELLOW', 'YELLOW'],
      ['RED', 'RED'],
      ['GREY', 'GREY'],
    ])('should format %s value correctly', (value, expectedKey) => {
      const params = { value };

      const result = trafficLightValueFormatter(params);

      expect(result).toBe(`traffic_light.${expectedKey}`);
    });

    it('should handle undefined value', () => {
      const params = { value: undefined } as any;

      const result = trafficLightValueFormatter(params);

      expect(result).toBe(`traffic_light.undefined`);
    });
  });
});
