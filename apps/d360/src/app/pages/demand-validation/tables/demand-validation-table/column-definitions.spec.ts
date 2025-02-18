import { KpiType } from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { getColumnDefinitions } from './column-definitions';

describe('getColumnDefinitions', () => {
  describe('when planningView is CONFIRMED', () => {
    const config = { planningView: PlanningView.CONFIRMED };

    it('should return column definitions with the correct keys and titles for confirmed view', async () => {
      const columns = getColumnDefinitions(config);

      expect(
        columns[0].key({ expanded: true, [KpiType.Deliveries]: true } as any)
      ).toBe('confirmedDeliveriesCombined');

      expect(
        columns[0].title({ expanded: false, [KpiType.Deliveries]: true } as any)
      ).toBe('validation_of_demand.planningTable.deliveries');
    });
  });

  describe('when planningView is REQUESTED', () => {
    const config = { planningView: PlanningView.REQUESTED };

    it('should return column definitions with the correct keys and titles for requested view', async () => {
      const columns = getColumnDefinitions(config);

      expect(
        columns[0].key({ expanded: false, [KpiType.Deliveries]: true } as any)
      ).toBe('deliveriesActive');
    });
  });

  describe('when filter options are provided', () => {
    it('should return only the visible column definitions based on the filter options', async () => {
      const config = { planningView: PlanningView.CONFIRMED };
      const columns = getColumnDefinitions(config);
      const filterOptions = {
        [KpiType.Deliveries]: true,
        [KpiType.FirmBusiness]: false,
      } as any;

      const visibleColumns = columns.filter((column) =>
        column.visible(filterOptions)
      );

      expect(visibleColumns).toHaveLength(4);
    });
  });
});
