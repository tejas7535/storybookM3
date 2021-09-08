import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import * as utils from './reasons-and-counter-measures.selector.utils';

describe('mapReasonsToTableData', () => {
  test('should map reasons to data', () => {
    const data: ReasonForLeavingStats[] = [
      { detailedReason: 'Family', leavers: 23 },
      { detailedReason: 'Work Life Balance', leavers: 50 },
    ];

    const result = utils.mapReasonsToTableData(data);

    expect(result).toHaveLength(2);

    expect(result[0].detailedReason).toEqual(data[0].detailedReason);
    expect(result[0].leavers).toEqual(data[0].leavers);
    expect(result[0].percentage).toEqual(31.5);
    expect(result[0].position).toEqual(2);

    expect(result[1].detailedReason).toEqual(data[1].detailedReason);
    expect(result[1].leavers).toEqual(data[1].leavers);
    expect(result[1].percentage).toEqual(68.5);
    expect(result[1].position).toEqual(1);
  });

  test('should return undefined when data undefined', () => {
    const data: ReasonForLeavingStats[] = undefined;

    const result = utils.mapReasonsToTableData(data);

    expect(result).toBeUndefined();
  });
});
