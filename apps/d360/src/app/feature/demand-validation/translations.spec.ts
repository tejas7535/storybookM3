import {
  getDateFormatString,
  getMonthYearFormatString,
} from '../../shared/utils/date-format';
import { KpiType, SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES } from './model';
import { getTranslationsForExport } from './translations';

describe('getTranslationsForExport', () => {
  it('should return translations for activeAndPredecessor as true', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    expect(result).toHaveProperty('requested', 'planing_type.title.REQUESTED');
    expect(result).toHaveProperty('confirmed', 'planing_type.title.CONFIRMED');
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
      KpiType.Deliveries,
      'validation_of_demand.menu_item.deliveriesCombined'
    );
  });

  it('should return translations for activeAndPredecessor as false', () => {
    const locale = 'en';
    const result = getTranslationsForExport(false, locale);

    expect(result).toHaveProperty(
      KpiType.Deliveries,
      'validation_of_demand.menu_item.deliveriesActive'
    );
    expect(result).toHaveProperty(
      KpiType.FirmBusiness,
      'validation_of_demand.menu_item.firmBusiness'
    );
  });

  it('should include translations for supply concepts', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES.forEach(() => {
      expect(result).toHaveProperty(
        `supplyConcept`,
        `validation_of_demand.supply_concept.title`
      );
    });
  });

  it('should include translations for KPIs', () => {
    const locale = 'en';
    const result = getTranslationsForExport(true, locale);

    Object.values(KpiType).forEach((kpi) => {
      if (
        [
          KpiType.ConfirmedDeliveries,
          KpiType.ConfirmedFirmBusiness,
          KpiType.ConfirmedDemandRelevantSales,
          KpiType.ConfirmedOnTopOrder,
          KpiType.ConfirmedOnTopCapacityForecast,
          KpiType.ConfirmedSalesAmbition,
          KpiType.ConfirmedOpportunities,
          KpiType.ConfirmedSalesPlan,
        ].includes(kpi)
      ) {
        return;
      }

      expect(result).toHaveProperty(
        kpi,
        `validation_of_demand.menu_item.${kpi}${
          [KpiType.Deliveries, KpiType.FirmBusiness].includes(kpi)
            ? 'Combined'
            : ''
        }`
      );
    });
  });
});
