import {
  getLoadAssessmentId,
  setLoadAssessmentDisplay,
  setLoadAssessmentInterval,
} from '..';

describe('LoadAssessment Actions', () => {
  it('getLoadAssessmentId', () => {
    const action = getLoadAssessmentId();

    expect(action).toEqual({
      type: '[Load Assessment] Load Load Assessment ID',
    });
  });
  it('setLoadAssessmentDisplay', () => {
    const loadAssessmentDisplay: any = {};
    const action = setLoadAssessmentDisplay({ loadAssessmentDisplay });

    expect(action).toEqual({
      loadAssessmentDisplay,
      type: '[Load Assessment] Set Load Assessment Display',
    });
  });

  it('setLoadAssessmentInterval', () => {
    const mockInterval = {
      startDate: 1_599_651_508,
      endDate: 1_599_651_509,
    };
    const action = setLoadAssessmentInterval({ interval: mockInterval });

    expect(action).toEqual({
      interval: mockInterval,
      type: '[Load Assessment] Set Interval',
    });
  });
});
