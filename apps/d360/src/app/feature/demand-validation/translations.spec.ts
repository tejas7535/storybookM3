import {
  getDateFormatString,
  getMonthYearFormatString,
} from '../../shared/utils/date-format';
import { ValidationHelper } from '../../shared/utils/validation/validation-helper';
import {
  SelectedKpisAndMetadata,
  SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES,
} from './model';
import { getTranslationsForExport } from './translations';

describe('getTranslationsForExport', () => {
  beforeEach(() => {
    jest
      .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
      .mockReturnValue('PERIOD');
  });

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

  it('should translate the decimalSeparator', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    expect(result).toHaveProperty('decimalSeparator', 'PERIOD');
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
      'headerCalendarWeek',
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
    expect(result).toHaveProperty(
      'sum',
      'validation_of_demand.exportModal.sum'
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

  it('should include portfolio status translations', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    // Test that portfolio status translations are included
    expect(result).toHaveProperty('portfolioStatus_PI');
    expect(result).toHaveProperty('portfolioStatus_PO');
    expect(result).toHaveProperty('portfolioStatus_SP');
    expect(result).toHaveProperty('portfolioStatus_SE');
    expect(result).toHaveProperty('portfolioStatus_SI');
    expect(result).toHaveProperty('portfolioStatus_SB');
    expect(result).toHaveProperty('portfolioStatus_IA');
    expect(result).toHaveProperty('portfolioStatus_AC');

    // Verify the translation keys are correct
    expect(result.portfolioStatus_PI).toBe(
      'material_customer.portfolio_status.PI'
    );
    expect(result.portfolioStatus_AC).toBe(
      'material_customer.portfolio_status.AC'
    );
  });

  it('should include forecast maintained boolean translations', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    // Test that forecast maintained translations are included
    expect(result).toHaveProperty('forecastMaintained_true');
    expect(result).toHaveProperty('forecastMaintained_false');

    // Verify the translation keys are correct
    expect(result.forecastMaintained_true).toBe(
      'field.forecastMaintained.value.true'
    );
    expect(result.forecastMaintained_false).toBe(
      'field.forecastMaintained.value.false'
    );
  });

  it('should include all portfolio status values in translations', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    const expectedPortfolioStatuses = [
      'PI',
      'PO',
      'SP',
      'SE',
      'SI',
      'SB',
      'IA',
      'AC',
    ];

    expectedPortfolioStatuses.forEach((status) => {
      const key = `portfolioStatus_${status}`;
      expect(result).toHaveProperty(key);
      expect(result[key]).toBe(`material_customer.portfolio_status.${status}`);
    });
  });

  it('should work correctly with different locales for new translations', () => {
    const locales = ['en', 'de', 'fr', 'es'];

    locales.forEach((locale) => {
      const result = getTranslationsForExport(true, locale);

      // Portfolio status translations should be present regardless of locale
      expect(result).toHaveProperty('portfolioStatus_PI');
      expect(result).toHaveProperty('portfolioStatus_AC');

      // Forecast maintained translations should be present regardless of locale
      expect(result).toHaveProperty('forecastMaintained_true');
      expect(result).toHaveProperty('forecastMaintained_false');
    });
  });
});
