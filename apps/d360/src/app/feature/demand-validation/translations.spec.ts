import {
  getDateFormatString,
  getMonthYearFormatString,
} from '../../shared/utils/date-format';
import {
  SelectedKpisAndMetadata,
  SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES,
} from './model';
import { getTranslationsForExport } from './translations';

describe('getTranslationsForExport', () => {
  it('should return translations for activeAndPredecessor as true', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    expect(result).toHaveProperty('requested', 'planningType.title.REQUESTED');
    expect(result).toHaveProperty('confirmed', 'planningType.title.CONFIRMED');
    expect(result).toHaveProperty(
      'salesOrg',
      'material_customer.column.salesOrg'
    );
    expect(result).toHaveProperty(
      'dateFormatWeek',
      getDateFormatString(locale)
    );
    expect(result).toHaveProperty(
      'dateFormatMonth',
      getMonthYearFormatString(locale)
    );
    expect(result).toHaveProperty(
      'kpi',
      'validation_of_demand.planningTable.kpi'
    );
    expect(result).toHaveProperty(
      'supplyConcept',
      'validation_of_demand.supply_concept.title'
    );
    expect(result).toHaveProperty(
      SelectedKpisAndMetadata.Deliveries,
      'validation_of_demand.menu_item.deliveriesCombined'
    );
  });

  it('should return translations for activeAndPredecessor as false', () => {
    const locale = 'en';
    const result = getTranslationsForExport(false, locale);

    expect(result).toHaveProperty(
      SelectedKpisAndMetadata.Deliveries,
      'validation_of_demand.menu_item.deliveriesActive'
    );
    expect(result).toHaveProperty(
      SelectedKpisAndMetadata.FirmBusiness,
      'validation_of_demand.menu_item.firmBusiness'
    );
  });

  it('should translate additionalProps correctly', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    // Check a sample of additional properties
    expect(result).toHaveProperty(
      'customerName',
      'material_customer.column.customerName'
    );
    expect(result).toHaveProperty(
      'materialDescription',
      'material_customer.column.materialDescription'
    );
    expect(result).toHaveProperty(
      'materialNumber',
      'material_customer.column.materialNumber'
    );
    expect(result).toHaveProperty(
      'packageSize',
      'material_customer.column.packageSize'
    );
  });

  it('should translate currentRLTSchaeffler to currentRLTSchaefflerWithTransitTime', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    expect(result).toHaveProperty(
      SelectedKpisAndMetadata.CurrentRLTSchaeffler,
      'material_customer.column.currentRLTSchaefflerWithTransitTime'
    );
  });

  it('should include supply concept stochastic type translations', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES.forEach(() => {
      expect(result).toHaveProperty(
        `supplyConcept`,
        `validation_of_demand.supply_concept.title`
      );
    });
  });

  it('should include header translations', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    expect(result).toHaveProperty(
      'headerCalenderWeek',
      'validation_of_demand.planningTable.calendarWeekTableHeaderKw'
    );
    expect(result).toHaveProperty(
      'headerPartialWeek',
      'validation_of_demand.planningTable.calendarWeekTableHeaderPartWeek'
    );
    expect(result).toHaveProperty(
      'viewType',
      'validation_of_demand.exportModal.excelHeaderView'
    );
    expect(result).toHaveProperty(
      'productLineAndText',
      'validation_of_demand.more_information.product_line_and_text'
    );
  });

  it('should include translations for KPIs', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    Object.values(SelectedKpisAndMetadata).forEach((kpi) => {
      if (
        [
          SelectedKpisAndMetadata.ConfirmedDeliveries,
          SelectedKpisAndMetadata.ConfirmedFirmBusiness,
          SelectedKpisAndMetadata.ConfirmedDemandRelevantSales,
          SelectedKpisAndMetadata.ConfirmedOnTopOrder,
          SelectedKpisAndMetadata.ConfirmedOnTopCapacityForecast,
          SelectedKpisAndMetadata.ConfirmedSalesAmbition,
          SelectedKpisAndMetadata.ConfirmedOpportunities,
          SelectedKpisAndMetadata.ConfirmedSalesPlan,
          SelectedKpisAndMetadata.SupplyConcept,
          SelectedKpisAndMetadata.CurrentRLTSchaeffler,
        ].includes(kpi)
      ) {
        return;
      }

      if (
        [
          SelectedKpisAndMetadata.ActiveAndPredecessor,
          SelectedKpisAndMetadata.SalesPlan,
          SelectedKpisAndMetadata.DemandRelevantSales,
          SelectedKpisAndMetadata.OnTopCapacityForecast,
          SelectedKpisAndMetadata.OnTopOrder,
          SelectedKpisAndMetadata.SalesAmbition,
          SelectedKpisAndMetadata.ValidatedForecast,
          SelectedKpisAndMetadata.Deliveries,
          SelectedKpisAndMetadata.FirmBusiness,
          SelectedKpisAndMetadata.Opportunities,
          SelectedKpisAndMetadata.ForecastProposal,
          SelectedKpisAndMetadata.ForecastProposalDemandPlanner,
        ].includes(kpi)
      ) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(result).toHaveProperty(
          kpi,
          `validation_of_demand.menu_item.${kpi}${
            [
              SelectedKpisAndMetadata.Deliveries,
              SelectedKpisAndMetadata.FirmBusiness,
            ].includes(kpi)
              ? 'Combined'
              : ''
          }`
        );

        return;
      }
      expect(result).toHaveProperty(kpi, `material_customer.column.${kpi}`);
    });
  });
});
