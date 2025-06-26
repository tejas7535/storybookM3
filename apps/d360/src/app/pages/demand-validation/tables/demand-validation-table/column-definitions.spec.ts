import { SelectedKpisAndMetadata } from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { getColumnDefinitions } from './column-definitions';

describe('getColumnDefinitions', () => {
  describe('when planningView is CONFIRMED', () => {
    const config = { planningView: PlanningView.CONFIRMED };

    it('should return column definitions with the correct keys and titles for confirmed view', async () => {
      const columns = getColumnDefinitions(config);

      expect(
        columns[0].key({
          expanded: true,
          [SelectedKpisAndMetadata.Deliveries]: true,
        } as any)
      ).toBe('confirmedDeliveriesCombined');

      expect(
        columns[0].title({
          expanded: false,
          [SelectedKpisAndMetadata.Deliveries]: true,
        } as any)
      ).toBe('validation_of_demand.planningTable.deliveries');
    });
  });

  describe('when planningView is REQUESTED', () => {
    const config = { planningView: PlanningView.REQUESTED };

    it('should return column definitions with the correct keys and titles for requested view', async () => {
      const columns = getColumnDefinitions(config);

      expect(
        columns[0].key({
          expanded: false,
          [SelectedKpisAndMetadata.Deliveries]: true,
        } as any)
      ).toBe('deliveriesActive');
    });
  });

  describe('when filter options are provided', () => {
    it('should return only the visible column definitions based on the filter options', async () => {
      const config = { planningView: PlanningView.CONFIRMED };
      const columns = getColumnDefinitions(config);
      const filterOptions = {
        [SelectedKpisAndMetadata.Deliveries]: true,
        [SelectedKpisAndMetadata.FirmBusiness]: false,
      } as any;

      const visibleColumns = columns.filter((column) =>
        column.visible(filterOptions)
      );

      expect(visibleColumns).toHaveLength(4);
    });
  });

  describe('column properties and behaviors', () => {
    it('should create columns with correct path arrays', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      // Check Deliveries column path
      const deliveriesColumn = columns.find(
        (col) => col.key({ expanded: false } as any) === 'deliveriesActive'
      );
      expect(deliveriesColumn?.path).toEqual([
        SelectedKpisAndMetadata.Deliveries,
      ]);

      // Check Firm Business column path
      const firmBusinessColumn = columns.find(
        (col) => col.key({ expanded: false } as any) === 'firmBusinessActive'
      );
      expect(firmBusinessColumn?.path).toEqual([
        SelectedKpisAndMetadata.FirmBusiness,
      ]);
    });

    it('should assign correct colors to specific columns', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      // Check color properties
      const deliveriesColumn = columns.find(
        (col) => col.key({ expanded: false } as any) === 'deliveriesActive'
      );
      expect(deliveriesColumn?.color).toBe('dimmed-grey');

      const salesAmbitionColumn = columns.find(
        (col) => col.key({ expanded: false } as any) === 'salesAmbition'
      );
      expect(salesAmbitionColumn?.color).toBe('dimmed-pink');
    });

    it('should handle titleStyle property correctly', () => {
      const config = { planningView: PlanningView.CONFIRMED };
      const columns = getColumnDefinitions(config);

      // Check for indented title style
      const indentedColumns = columns.filter(
        (col) => col.titleStyle === 'indented'
      );
      expect(indentedColumns.length).toBeGreaterThan(0);

      // Check for pseudo-deactivated title style in CONFIRMED view
      const deactivatedColumns = columns.filter(
        (col) => col.titleStyle === 'pseudo-deactivated'
      );
      expect(deactivatedColumns.length).toBeGreaterThan(0);
    });
  });

  describe('column visibility', () => {
    it('should make ValidatedForecast column always visible', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      const validatedForecastColumn = columns.find(
        (col) =>
          col.key({} as any) === SelectedKpisAndMetadata.ValidatedForecast
      );

      expect(validatedForecastColumn?.visible({} as any)).toBe(true);
    });

    it('should respect multiple filter options', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      const filterOptions = {
        [SelectedKpisAndMetadata.Deliveries]: true,
        [SelectedKpisAndMetadata.FirmBusiness]: true,
        [SelectedKpisAndMetadata.ForecastProposal]: false,
        [SelectedKpisAndMetadata.ForecastProposalDemandPlanner]: false,
        [SelectedKpisAndMetadata.SalesAmbition]: true,
        [SelectedKpisAndMetadata.Opportunities]: false,
        [SelectedKpisAndMetadata.SalesPlan]: false,
        [SelectedKpisAndMetadata.DemandRelevantSales]: true,
      } as any;

      const visibleColumns = columns.filter((col) =>
        col.visible(filterOptions)
      );

      // Count columns that should be visible based on our filter options
      const expectedVisibleColumns = [
        SelectedKpisAndMetadata.Deliveries,
        SelectedKpisAndMetadata.FirmBusiness,
        SelectedKpisAndMetadata.ValidatedForecast, // Always visible
        SelectedKpisAndMetadata.SalesAmbition,
        SelectedKpisAndMetadata.DemandRelevantSales,
      ].length;

      // Plus additional sub-columns for expanded types
      const additionalSubColumns = 7; // Counting subcolumns for Deliveries, FirmBusiness, and DemandRelevantSales

      expect(visibleColumns.length).toBeGreaterThanOrEqual(
        expectedVisibleColumns + additionalSubColumns
      );
    });
  });

  describe('key and title generation', () => {
    it('should generate correct combined keys based on expanded state', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      const deliveriesColumn = columns[0];

      expect(
        deliveriesColumn.key({
          expanded: true,
          [SelectedKpisAndMetadata.Deliveries]: true,
        } as any)
      ).toBe('deliveriesCombined');

      expect(
        deliveriesColumn.key({
          expanded: false,
          [SelectedKpisAndMetadata.Deliveries]: true,
        } as any)
      ).toBe('deliveriesActive');
    });

    it('should add confirmed prefix to keys in CONFIRMED view', () => {
      const confirmedConfig = { planningView: PlanningView.CONFIRMED };
      const requestedConfig = { planningView: PlanningView.REQUESTED };

      const confirmedColumns = getColumnDefinitions(confirmedConfig);
      const requestedColumns = getColumnDefinitions(requestedConfig);

      // Check a specific column like SalesAmbition
      const confirmedSalesAmbitionColumn = confirmedColumns.find(
        (col) =>
          col.path.includes(SelectedKpisAndMetadata.SalesAmbition) &&
          col.path.length === 1
      );

      const requestedSalesAmbitionColumn = requestedColumns.find(
        (col) =>
          col.path.includes(SelectedKpisAndMetadata.SalesAmbition) &&
          col.path.length === 1
      );

      expect(confirmedSalesAmbitionColumn?.key({} as any)).toBe(
        'confirmedSalesAmbition'
      );
      expect(requestedSalesAmbitionColumn?.key({} as any)).toBe(
        'salesAmbition'
      );
    });

    it('should return undefined keys for inactive columns in CONFIRMED view', () => {
      const config = { planningView: PlanningView.CONFIRMED };
      const columns = getColumnDefinitions(config);

      // Find the forecast proposal column
      const forecastProposalColumn = columns.find(
        (col) =>
          col.path.includes(SelectedKpisAndMetadata.ForecastProposal) &&
          col.path.length === 1
      );

      // Check that the key is undefined in CONFIRMED view
      expect(forecastProposalColumn?.key({} as any)).toBeUndefined();
    });

    it('should generate correct titles based on expanded state', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      const deliveriesColumn = columns[0];

      expect(
        deliveriesColumn.title({
          expanded: true,
          [SelectedKpisAndMetadata.Deliveries]: true,
        } as any)
      ).toBe('validation_of_demand.planningTable.deliveriesCombined');

      expect(
        deliveriesColumn.title({
          expanded: false,
          [SelectedKpisAndMetadata.Deliveries]: true,
        } as any)
      ).toBe('validation_of_demand.planningTable.deliveries');
    });
  });

  describe('special column configurations', () => {
    it('should configure the ValidatedForecast column as editable in REQUESTED view', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      const validatedForecastColumn = columns.find(
        (col) =>
          col.key({} as any) === SelectedKpisAndMetadata.ValidatedForecast
      );

      expect(validatedForecastColumn?.editable).toBe(true);
    });

    it('should configure the ValidatedForecast column as non-editable in CONFIRMED view', () => {
      const config = { planningView: PlanningView.CONFIRMED };
      const columns = getColumnDefinitions(config);

      const validatedForecastColumn = columns.find((col) =>
        col.path.includes(SelectedKpisAndMetadata.ValidatedForecast)
      );

      expect(validatedForecastColumn?.editable).toBe(false);
    });

    it('should correctly configure the OnTopOrder column', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      const onTopOrderColumn = columns.find(
        (col) => col.key({} as any) === SelectedKpisAndMetadata.OnTopOrder
      );

      expect(onTopOrderColumn).toBeDefined();
      expect(onTopOrderColumn?.dotStyle).toBe('indented');
      expect(onTopOrderColumn?.color).toBe('dimmed-green');
      expect(onTopOrderColumn?.path).toEqual([
        SelectedKpisAndMetadata.DemandRelevantSales,
        SelectedKpisAndMetadata.OnTopOrder,
      ]);
    });

    it('should correctly configure the OnTopCapacityForecast column', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      const onTopCapacityForecastColumn = columns.find(
        (col) =>
          col.key({} as any) === SelectedKpisAndMetadata.OnTopCapacityForecast
      );

      expect(onTopCapacityForecastColumn).toBeDefined();
      expect(onTopCapacityForecastColumn?.dotStyle).toBe('indented');
      expect(onTopCapacityForecastColumn?.color).toBe('dimmed-blue');
      expect(onTopCapacityForecastColumn?.path).toEqual([
        SelectedKpisAndMetadata.DemandRelevantSales,
        SelectedKpisAndMetadata.OnTopCapacityForecast,
      ]);
    });
  });

  describe('column structure', () => {
    it('should return all expected columns for REQUESTED view', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      // Check total number of columns
      expect(columns.length).toBe(16);

      // Check that all key KPI types are represented
      const kpiTypes = [
        SelectedKpisAndMetadata.Deliveries,
        SelectedKpisAndMetadata.FirmBusiness,
        SelectedKpisAndMetadata.ForecastProposal,
        SelectedKpisAndMetadata.ForecastProposalDemandPlanner,
        SelectedKpisAndMetadata.ValidatedForecast,
        SelectedKpisAndMetadata.DemandRelevantSales,
        SelectedKpisAndMetadata.SalesAmbition,
        SelectedKpisAndMetadata.Opportunities,
        SelectedKpisAndMetadata.SalesPlan,
      ];

      kpiTypes.forEach((kpiType) => {
        const hasColumn = columns.some((col) => col.path.includes(kpiType));
        expect(hasColumn).toBe(true);
      });
    });

    it('should ensure all column definitions have the required properties', () => {
      const config = { planningView: PlanningView.REQUESTED };
      const columns = getColumnDefinitions(config);

      columns.forEach((column) => {
        expect(column).toHaveProperty('key');
        expect(column).toHaveProperty('title');
        expect(column).toHaveProperty('visible');
        expect(column).toHaveProperty('path');
        expect(Array.isArray(column.path)).toBe(true);
      });
    });
  });

  describe('title and key functions behavior', () => {
    describe('check: PlanningView.REQUESTED, should return correct title and key for options:', () => {
      const columns = getColumnDefinitions({
        planningView: PlanningView.REQUESTED,
      });

      it.each([
        [
          'deliveriesCombined',
          true,
          'validation_of_demand.planningTable.deliveriesCombined',
        ],
        [
          'deliveriesActive',
          false,
          'validation_of_demand.planningTable.deliveries',
        ],
        [
          'deliveriesActive',
          true,
          'validation_of_demand.planningTable.deliveriesActive',
        ],
        [
          'deliveriesPredecessor',
          false,
          'validation_of_demand.planningTable.deliveriesPredecessor',
        ],
        [
          'deliveriesPredecessor',
          true,
          'validation_of_demand.planningTable.deliveriesPredecessor',
        ],
        [
          'firmBusinessCombined',
          true,
          'validation_of_demand.planningTable.firmBusinessCombined',
        ],
        [
          'firmBusinessActive',
          false,
          'validation_of_demand.planningTable.firmBusiness',
        ],
        [
          'firmBusinessActive',
          true,
          'validation_of_demand.planningTable.firmBusiness',
        ],
        [
          'firmBusinessPredecessor',
          false,
          'validation_of_demand.planningTable.firmBusinessPredecessor',
        ],
        [
          'firmBusinessPredecessor',
          true,
          'validation_of_demand.planningTable.firmBusinessPredecessor',
        ],
        [
          'forecastProposalDemandPlanner',
          true,
          'validation_of_demand.planningTable.forecastProposalDemandPlanner',
        ],
        [
          'forecastProposal',
          true,
          'validation_of_demand.planningTable.forecastProposal',
        ],
        [
          'validatedForecast',
          true,
          'validation_of_demand.planningTable.validatedForecast',
        ],
        [
          'demandRelevantSales',
          true,
          'validation_of_demand.planningTable.demandRelevantSales',
        ],
        [
          'firmBusinessActive',
          true,
          'validation_of_demand.planningTable.firmBusiness',
        ],
        ['onTopOrder', true, 'validation_of_demand.planningTable.onTopOrder'],
        [
          'onTopCapacityForecast',
          true,
          'validation_of_demand.planningTable.onTopCapacityForecast',
        ],
        [
          'salesAmbition',
          true,
          'validation_of_demand.planningTable.salesAmbition',
        ],
        [
          'opportunities',
          true,
          'validation_of_demand.planningTable.opportunities',
        ],
        ['salesPlan', true, 'validation_of_demand.planningTable.salesPlan'],
      ])('key: %s, expanded: %o, title: %s', (key, expanded, title) => {
        const column = columns.find(
          (col) => col.key({ expanded } as any) === key
        );

        expect(
          column?.title({
            expanded,
          } as any)
        ).toBe(title);
      });
    });

    describe('check: PlanningView.CONFIRMED, should return correct title and key for options:', () => {
      const columns = getColumnDefinitions({
        planningView: PlanningView.CONFIRMED,
      });

      it.each([
        [
          'confirmedDeliveriesCombined',
          true,
          'validation_of_demand.planningTable.deliveriesCombined',
        ],
        [
          'confirmedDeliveriesActive',
          true,
          'validation_of_demand.planningTable.deliveriesActive',
        ],
        [
          'confirmedDeliveriesPredecessor',
          true,
          'validation_of_demand.planningTable.deliveriesPredecessor',
        ],
        [
          'confirmedFirmBusinessCombined',
          true,
          'validation_of_demand.planningTable.firmBusinessCombined',
        ],
        [
          'confirmedFirmBusinessActive',
          true,
          'validation_of_demand.planningTable.firmBusiness',
        ],
        [
          'confirmedFirmBusinessPredecessor',
          true,
          'validation_of_demand.planningTable.firmBusinessPredecessor',
        ],
        [
          'confirmedDemandRelevantSales',
          true,
          'validation_of_demand.planningTable.demandRelevantSales',
        ],
        [
          'confirmedOnTopOrder',
          true,
          'validation_of_demand.planningTable.onTopOrder',
        ],
        [
          'confirmedOnTopCapacityForecast',
          true,
          'validation_of_demand.planningTable.onTopCapacityForecast',
        ],
        [
          'confirmedSalesAmbition',
          true,
          'validation_of_demand.planningTable.salesAmbition',
        ],
        [
          'confirmedOpportunities',
          true,
          'validation_of_demand.planningTable.opportunities',
        ],
        [
          'confirmedSalesPlan',
          true,
          'validation_of_demand.planningTable.salesPlan',
        ],
        // false
        [
          'confirmedDeliveriesActive',
          false,
          'validation_of_demand.planningTable.deliveries',
        ],
        [
          'confirmedDeliveriesPredecessor',
          false,
          'validation_of_demand.planningTable.deliveriesPredecessor',
        ],
        [
          'confirmedFirmBusinessActive',
          false,
          'validation_of_demand.planningTable.firmBusiness',
        ],
        [
          'confirmedFirmBusinessActive',
          false,
          'validation_of_demand.planningTable.firmBusiness',
        ],
        [
          'confirmedFirmBusinessPredecessor',
          false,
          'validation_of_demand.planningTable.firmBusinessPredecessor',
        ],
        [
          'confirmedDemandRelevantSales',
          false,
          'validation_of_demand.planningTable.demandRelevantSales',
        ],
        [
          'confirmedFirmBusinessActive',
          false,
          'validation_of_demand.planningTable.firmBusiness',
        ],
        [
          'confirmedOnTopOrder',
          false,
          'validation_of_demand.planningTable.onTopOrder',
        ],
        [
          'confirmedOnTopCapacityForecast',
          false,
          'validation_of_demand.planningTable.onTopCapacityForecast',
        ],
        [
          'confirmedSalesAmbition',
          false,
          'validation_of_demand.planningTable.salesAmbition',
        ],
        [
          'confirmedOpportunities',
          false,
          'validation_of_demand.planningTable.opportunities',
        ],
        [
          'confirmedSalesPlan',
          false,
          'validation_of_demand.planningTable.salesPlan',
        ],
      ])('key: %s, expanded: %o, title: %s', (key, expanded, title) => {
        const column = columns.find(
          (col) => col.key({ expanded } as any) === key
        );

        expect(
          column?.title({
            expanded,
          } as any)
        ).toBe(title);
      });
    });
  });
});
