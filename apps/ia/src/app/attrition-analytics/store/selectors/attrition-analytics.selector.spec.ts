import { NavItem } from '../../../shared/nav-buttons/models';
import { AttritionAnalyticsState } from '..';
import { getAvailableClusters } from './attrition-analytics.selector';
import { createFakeState } from './attrition-analytics.selector.spec.factory';

describe('attrition analytics selector', () => {
  const fakeState: AttritionAnalyticsState = createFakeState();

  describe('getAvailableClusters', () => {
    test('should return available clusters', () => {
      expect(getAvailableClusters.projector(fakeState)).toEqual([
        {
          label: 'Personal',
          badge: '7/10',
          tooltipTranslation:
            'attritionAnalytics.cluster.moreFeaturesAvailableTooltip',
        },
        {
          label: 'Time Management',
          badge: '3/7',
          tooltipTranslation:
            'attritionAnalytics.cluster.moreFeaturesAvailableTooltip',
        },
      ] as NavItem[]);
    });
  });
});
