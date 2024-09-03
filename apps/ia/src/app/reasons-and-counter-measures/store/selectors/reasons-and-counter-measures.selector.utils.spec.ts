import { Reason, ReasonImpact } from '../../models';
import * as utils from './reasons-and-counter-measures.selector.utils';

describe('mapReasonsToTableData', () => {
  test('should map reasons to data', () => {
    const reasonA = 'Reason A';
    const reasonB = 'Reason B';
    const reasonC = 'Reason C';
    const reasonD = 'Reason D';
    const reasonE = 'Reason E';
    const reasonF = 'Reason F';
    const data: Reason[] = [
      {
        impact: ReasonImpact.HIGH,
        reason: reasonA,
        detailedReason: 'Detailed Reason A1',
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonA,
        detailedReason: 'Detailed Reason A2',
      },
      {
        impact: ReasonImpact.LOW,
        reason: reasonB,
        detailedReason: 'Detailed Reason B1',
      },
      {
        impact: ReasonImpact.MEDIUM,
        reason: reasonB,
        detailedReason: 'Detailed Reason B2',
      },
      {
        impact: ReasonImpact.MEDIUM,
        reason: reasonA,
        detailedReason: 'Detailed Reason A3',
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonC,
        detailedReason: 'Detailed Reason C1',
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonC,
        detailedReason: 'Detailed Reason C2',
      },
      {
        impact: ReasonImpact.LOW,
        reason: reasonD,
        detailedReason: 'Detailed Reason D1',
      },
      {
        impact: ReasonImpact.MEDIUM,
        reason: reasonE,
        detailedReason: 'Detailed Reason E1',
      },
      {
        impact: ReasonImpact.MEDIUM,
        reason: reasonE,
        detailedReason: 'Detailed Reason E1',
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonF,
        detailedReason: 'Detailed Reason F1',
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonF,
        detailedReason: 'Detailed Reason F2',
      },
    ];

    const result = utils.mapReasonsToTableData(data);

    expect(result).toEqual([
      { reason: reasonA, leavers: 3, rank: 1, percentage: 25 },
      { reason: reasonB, leavers: 2, rank: 2, percentage: 16.7 },
      { reason: reasonC, leavers: 2, rank: 2, percentage: 16.7 },
      { reason: reasonE, leavers: 2, rank: 2, percentage: 16.7 },
      { reason: reasonF, leavers: 2, rank: 2, percentage: 16.7 },
      { reason: reasonD, leavers: 1, rank: 6, percentage: 8.3 },
    ]);
  });

  describe('getPercentageValue', () => {
    test('should get percentage value', () => {
      const part = 2;
      const total = 11;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(18.2);
    });

    test('should not add decimal numbers for integer', () => {
      const part = 1;
      const total = 1;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(100);
    });

    test('should return 0 when total 0', () => {
      const part = 1;
      const total = 0;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(0);
    });

    test('should return 0 when part 0', () => {
      const part = 0;
      const total = 1;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(0);
    });
  });
});
