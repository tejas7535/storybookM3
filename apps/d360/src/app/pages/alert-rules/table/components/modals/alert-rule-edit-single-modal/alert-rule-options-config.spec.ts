import { AlertTypeDescription } from '../../../../../../feature/alert-rules/model';
import {
  execIntervalOptions,
  getThresholdRequirements,
  possibleWhenOptions,
  whenOptions,
} from './alert-rule-options-config';

describe('alertRuleOptionsConfig', () => {
  describe('getThresholdRequirements', () => {
    it('should return default values if alertRuleDescriptions is undefined', () => {
      const result = getThresholdRequirements(undefined as any);
      expect(result).toEqual([
        {
          alertType: undefined,
          threshold1: false,
          threshold2: false,
          threshold3: false,
        },
      ]);
    });

    it('should return correct threshold requirements for given alertRuleDescriptions', () => {
      const alertRuleDescriptions: AlertTypeDescription[] = [
        {
          alertType: 'type1',
          threshold1Type: '1',
          threshold2Type: '2',
          threshold3Type: '3',
        },
        {
          alertType: 'type2',
          threshold1Type: '2',
          threshold2Type: '3',
          threshold3Type: '1',
        },
      ] as any;

      const result = getThresholdRequirements(alertRuleDescriptions);

      expect(result).toEqual([
        {
          alertType: 'type1',
          threshold1: true,
          threshold2: true,
          threshold3: false,
        },
        {
          alertType: 'type2',
          threshold1: true,
          threshold2: false,
          threshold3: true,
        },
      ]);
    });

    it('should handle empty alertRuleDescriptions array', () => {
      const result = getThresholdRequirements([]);
      expect(result).toEqual([]);
    });
  });

  describe('possibleWhenOptions', () => {
    it('should have correct possible when options', () => {
      expect(possibleWhenOptions).toEqual({
        M1: ['M01', 'M15'],
        M2: ['M01', 'M15'],
        M3: ['M01', 'M15'],
        M6: ['M01', 'M15'],
        W1: ['W6'],
        D1: ['D'],
      });
    });
  });

  describe('execIntervalOptions', () => {
    it('should have correct exec interval options', () => {
      expect(execIntervalOptions).toEqual(['M1', 'M2', 'M3', 'M6', 'W1', 'D1']);
    });
  });

  describe('whenOptions', () => {
    it('should have correct when options', () => {
      expect(whenOptions).toEqual(['M01', 'M15', 'W6', 'D']);
    });
  });
});
