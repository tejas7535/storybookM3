import moment from 'moment';

import {
  DoughnutConfig,
  DoughnutSeriesConfig,
} from '../../../shared/charts/models';
import { Color } from '../../../shared/models';
import * as utils from './overview-selector-utils';

describe('OverviewSelectorUtils', () => {
  const selectedOrgUnit = 'Schaeffler_IT';

  describe('isDateInTimeRange', () => {
    const timeRange = '1577863715|1609399715'; // 01.01.2020 - 31.12.2020

    test('should return true when data in range', () => {
      const date = moment({ year: 2020, month: 5, date: 5 })
        .valueOf()
        .toString();

      const result = utils.isDateInTimeRange(timeRange, date);

      expect(result).toBeTruthy();
    });

    test('should return false when data out of range', () => {
      const date = moment({
        year: 2021,
        month: 5,
        date: 15,
      })
        .valueOf()
        .toString();

      const result = utils.isDateInTimeRange(timeRange, date);

      expect(result).toBeFalsy();
    });
  });

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
