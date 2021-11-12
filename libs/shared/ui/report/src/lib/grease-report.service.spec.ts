import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { activeGreaseJson, formattedGreaseJson, greaseReport } from '../mocks';
import { GreaseReportService } from './grease-report.service';
import { TitleId } from './models';

describe('ReportService testing', () => {
  let spectator: SpectatorService<GreaseReportService>;
  const createService = createServiceFactory({
    service: GreaseReportService,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => (spectator = createService()));

  describe('formatGreaseReport', () => {
    it('should format a grease report', () => {
      const mockGreaseReport = greaseReport.subordinates;

      const result = spectator.service.formatGreaseReport(mockGreaseReport);

      expect(result).toStrictEqual(formattedGreaseJson);
    });
  });

  describe('toggleShowValues', () => {
    it('should toggle the display property', () => {
      const selectedColumn = 1;

      const mockSubordinate = (formattedGreaseJson as any).find(
        ({ titleID }: any) => titleID === TitleId.STRING_OUTP_RESULTS
      ).subordinates[selectedColumn];

      const result = spectator.service.toggleShowValues(
        mockSubordinate,
        formattedGreaseJson
      );

      const mockSubordinateShowValues = mockSubordinate.greaseResult.showValues;

      const resultShowValues = (result as any).find(
        ({ titleID }: any) => titleID === TitleId.STRING_OUTP_RESULTS
      ).subordinates[selectedColumn].greaseResult.showValues;

      expect(resultShowValues).toBe(!mockSubordinateShowValues);
    });
  });

  describe('checkSuitablity', () => {
    it('should return a level description', () => {
      const mockLevel = '++';

      const result = spectator.service.checkSuitablity(mockLevel);

      expect(result).toBeTruthy();
      expect(result).toBe('extremely suitable');
    });
  });

  describe('showActiveData', () => {
    it('should return only grease table entries that should be displayed', () => {
      const result = spectator.service.showActiveData(formattedGreaseJson);

      expect(result).toStrictEqual(activeGreaseJson);
    });
  });
});
