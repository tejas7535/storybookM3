import { translate } from '@jsverse/transloco';

import {
  getDateFormatString,
  getMonthYearFormatString,
} from '../../shared/utils/date-format';
import { KpiType, SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES } from './model';

export function getTranslationsForExport(
  activeAndPredecessor: boolean,
  locale: string
): any {
  const translateKey = (key: string, options?: any) =>
    translate(`validation_of_demand.${key}`, options);

  const translateConcept = (stochasticType: string, options?: any) =>
    translateKey(`supply_concept.${stochasticType}`, options);

  // eslint-disable-next-line unicorn/no-array-reduce
  const conceptTranslations = SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES.reduce(
    (acc, stochasticType) => {
      acc[`supplyConcept.${stochasticType}.csss`] = translateConcept(
        `${stochasticType}.csss`,
        { fixHor: '{fixHor}', safetyStock: '{safetyStock}' }
      );
      acc[`supplyConcept.${stochasticType}.ss`] = translateConcept(
        `${stochasticType}.ss`,
        { fixHor: '{fixHor}', safetyStock: '{safetyStock}' }
      );
      acc[`supplyConcept.${stochasticType}`] = translateConcept(
        `${stochasticType}.rootString`,
        { fixHor: '{fixHor}' }
      );

      return acc;
    },
    {} as any
  );

  const kpiTranslations: Partial<Record<KpiType, string>> = {
    [KpiType.ActiveAndPredecessor]: translateKey(
      'menu_item.activeAndPredecessor'
    ),
    [KpiType.SalesPlan]: translateKey('menu_item.salesPlan'),
    [KpiType.DemandRelevantSales]: translateKey(
      'menu_item.demandRelevantSales'
    ),
    [KpiType.OnTopCapacityForecast]: translateKey(
      'menu_item.onTopCapacityForecast'
    ),
    [KpiType.OnTopOrder]: translateKey('menu_item.onTopOrder'),
    [KpiType.SalesAmbition]: translateKey('menu_item.salesAmbition'),
    [KpiType.ValidatedForecast]: translateKey('menu_item.validatedForecast'),
    [KpiType.Deliveries]: activeAndPredecessor
      ? translateKey('menu_item.deliveriesCombined')
      : translateKey('menu_item.deliveriesActive'),
    [KpiType.FirmBusiness]: activeAndPredecessor
      ? translateKey('menu_item.firmBusinessCombined')
      : translateKey('menu_item.firmBusiness'),
    [KpiType.Opportunities]: translateKey('menu_item.opportunities'),
    [KpiType.ForecastProposal]: translateKey('menu_item.forecastProposal'),
    [KpiType.ForecastProposalDemandPlanner]: translateKey(
      'menu_item.forecastProposalDemandPlanner'
    ),
  };

  return {
    ...conceptTranslations,
    requested: translate('planing_type.title.REQUESTED'),
    confirmed: translate('planing_type.title.CONFIRMED'),
    salesOrg: translate('material_customer.column.salesOrg'),
    customerNumber: translate('material_customer.column.customerNumber'),
    customerName: translate('material_customer.column.customerName'),
    materialNumber: translate('material_customer.column.materialNumber'),
    materialDescription: translate(
      'material_customer.column.materialDescription'
    ),
    customerMaterialNumber: translate(
      'material_customer.column.customerMaterialNumber'
    ),
    packageSize: translate('material_customer.column.packagingSize'),
    materialClassification: translate(
      'material_customer.column.materialClassification'
    ),
    currentRltSchaeffler: translate(
      'material_customer.column.currentRLTSchaeffler'
    ),
    productionSegment: translate('material_customer.column.productionSegment'),
    productionLine: translate('material_customer.column.productionLine'),
    dateFormatWeek: getDateFormatString(locale),
    dateFormatMonth: getMonthYearFormatString(locale),
    viewType: translateKey('export_modal.excel_header_view'),
    headerCalenderWeek: translateKey(
      'planningTable.calendarWeekTableHeaderKw',
      { calendar_week: '{}' }
    ),
    headerPartialWeek: translateKey(
      'planningTable.calendarWeekTableHeaderPartWeek',
      { days: '{}' }
    ),
    productLineAndText: translateKey('more_information.product_line_and_text'),
    supplyConcept: translateKey('supply_concept.title'),
    kpi: translateKey('planningTable.kpi'),
    'supplyConcept.ELSE': translateKey('supply_concept.ELSE'),
    ...kpiTranslations,
  };
}
