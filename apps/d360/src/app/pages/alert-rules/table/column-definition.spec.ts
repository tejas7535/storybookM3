import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { GridTooltipComponent } from '../../../shared/components/ag-grid/grid-tooltip/grid-tooltip.component';
import { AgGridLocalizationService } from '../../../shared/services/ag-grid-localization.service';
import {
  alertRuleColumnDefinitions,
  dateFilterCellValueComparator,
} from './column-definition';

describe('AlertRule ColumnDefinition', () => {
  let spectator: SpectatorService<AgGridLocalizationService>;

  const createService = createServiceFactory({
    service: AgGridLocalizationService,
  });

  beforeEach(() => (spectator = createService()));

  describe('dateFilterCellValueComparator', () => {
    it('should return -1 when cellDate is less than filterLocalDateAtMidnight', () => {
      const result = dateFilterCellValueComparator(
        new Date(2023, 0, 2),
        '2022-12-31T14:00:00Z'
      );

      expect(result).toEqual(-1);
    });

    it('should return 1 when cellDate is greater than filterLocalDateAtMidnight', () => {
      const result = dateFilterCellValueComparator(
        new Date(2022, 0, 2),
        '2023-01-01T14:00:00Z'
      );

      expect(result).toEqual(1);
    });

    it('should return 0 when cellDate is equal to filterLocalDateAtMidnight', () => {
      const result = dateFilterCellValueComparator(
        new Date('2023-01-01T14:00:00Z'),
        '2023-01-01T14:00:00Z'
      );

      expect(result).toEqual(0);
    });

    it('should return 0 when dateAsString is null', () => {
      const result = dateFilterCellValueComparator(new Date(), null);

      expect(result).toEqual(0);
    });
  });

  describe('alertRuleColumnDefinitions', () => {
    it('should return an array of column definitions with correct properties', () => {
      // Act
      const result = alertRuleColumnDefinitions(spectator.service);

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);

      result.forEach((column) => {
        expect(column).toHaveProperty('colId');
        expect(typeof column.colId).toEqual('string');
        expect(column).toHaveProperty('title');
        expect(typeof column.title).toEqual('string');

        // Hint: Add more assertions for other properties, if required
      });
    });

    it('should have a column definition with correct tooltipComponent and tooltipComponentParams', () => {
      // Act
      const result = alertRuleColumnDefinitions(spectator.service);

      // Assert
      const alertCommentColumn = result.find(
        (column) => column.colId === 'alertComment'
      );
      expect(alertCommentColumn).toBeTruthy();
      expect(alertCommentColumn?.tooltipComponent).toEqual(
        GridTooltipComponent
      );
      expect(alertCommentColumn?.maxWidth).toEqual(375);
      expect(alertCommentColumn?.tooltipComponentParams).toEqual({
        wide: true,
        lineBreaks: true,
        textLeft: true,
      });
    });
  });
});
