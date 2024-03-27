import {
  DoughnutConfig,
  DoughnutSeriesConfig,
} from '../../../shared/charts/models';
import { Color } from '../../../shared/models';
import * as utils from './overview-selector-utils';

describe('OverviewSelectorUtils', () => {
  const selectedOrgUnit = 'Schaeffler_IT';

  describe('createDoughnutConfig', () => {
    test('should create doughnut config', () => {
      const name = selectedOrgUnit;

      const result = utils.createDoughnutConfig(1, 2, name);

      const internalLabel = 'internal';
      const externalLabel = 'external';
      expect(result).toEqual(
        new DoughnutConfig(name, [
          new DoughnutSeriesConfig([{ value: 1 }], internalLabel, Color.LIME),
          new DoughnutSeriesConfig(
            [{ value: 2 }],
            externalLabel,
            Color.LIGHT_BLUE
          ),
        ])
      );
    });
  });
});
