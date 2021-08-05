import { ReasonsAndCounterMeasuresState } from '..';
import { SelectedFilter, TimePeriod } from '../../../shared/models';
import {
  getComparedSelectedOrgUnit,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
} from './reasons-and-counter-measures.selector';

describe('ReasonsAndCounterMeasures Selector', () => {
  const fakeState: ReasonsAndCounterMeasuresState = {
    reasonsForLeaving: {
      comparedSelectedOrgUnit: new SelectedFilter(
        'Schaeffler 1',
        'Schaeffler1'
      ),
      comparedSelectedTimePeriod: TimePeriod.YEAR,
      comparedSelectedTimeRange: '0|1',
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
});
