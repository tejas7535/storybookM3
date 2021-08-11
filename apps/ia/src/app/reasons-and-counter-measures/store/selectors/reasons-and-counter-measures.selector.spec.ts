import { ReasonsAndCounterMeasuresState } from '..';
import { SelectedFilter, TimePeriod } from '../../../shared/models';
import {
  getComparedSelectedOrgUnit,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
  getReasonsData,
  getReasonsLoading,
} from './reasons-and-counter-measures.selector';

describe('ReasonsAndCounterMeasures Selector', () => {
  const leaverStats = [
    {
      position: 1,
      detailedReason: 'Family',
      leavers: 10,
      percentage: 0.38,
    },
    {
      position: 2,
      detailedReason: 'Private',
      leavers: 5,
      percentage: 0.19,
    },
    {
      position: 3,
      detailedReason: 'Opportunity',
      leavers: 4,
      percentage: 0.15,
    },
    {
      position: 4,
      detailedReason: 'Leadership',
      leavers: 3,
      percentage: 0.12,
    },
    {
      position: 5,
      detailedReason: 'Team spirit',
      leavers: 2,
      percentage: 0.77,
    },
    {
      position: 6,
      detailedReason: 'Perspective',
      leavers: 1,
      percentage: 0.04,
    },
    {
      position: 7,
      detailedReason: 'Atmosphere',
      leavers: 1,
      percentage: 0.04,
    },
  ];
  const fakeState: ReasonsAndCounterMeasuresState = {
    reasonsForLeaving: {
      comparedSelectedOrgUnit: new SelectedFilter(
        'Schaeffler 1',
        'Schaeffler1'
      ),
      comparedSelectedTimePeriod: TimePeriod.YEAR,
      comparedSelectedTimeRange: '0|1',
      reasons: {
        data: leaverStats,
        loading: false,
        errorMessage: undefined,
      },
      comparedReasons: {
        data: undefined,
        loading: false,
        errorMessage: undefined,
      },
    },
  };

  describe('getComparedSelectedOrgUnit', () => {
    test('should return selected org unit', () => {
      expect(getComparedSelectedOrgUnit.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedSelectedOrgUnit.value
      );
    });
  });

  describe('getComparedSelectedTimePeriod', () => {
    test('should return selected time period', () => {
      expect(getComparedSelectedTimePeriod.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedSelectedTimePeriod
      );
    });
  });

  describe('getComparedSelectedTimeRange', () => {
    test('should return selected time range', () => {
      expect(getComparedSelectedTimeRange.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.comparedSelectedTimeRange
      );
    });
  });

  describe('getReasonsData', () => {
    test('should return data for reasons', () => {
      expect(getReasonsData.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.reasons.data
      );
    });
  });

  describe('getReasonsLoading', () => {
    test('should return loading status of reasons data', () => {
      expect(getReasonsLoading.projector(fakeState)).toEqual(
        fakeState.reasonsForLeaving.reasons.loading
      );
    });
  });
});
