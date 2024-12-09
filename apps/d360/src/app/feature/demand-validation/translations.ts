import { translate } from '@jsverse/transloco';

import {
  getDateFormatString,
  getMonthYearFormatString,
} from '../../shared/utils/date-format';
import { SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES } from './model';

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
      'planning_table.calendar_week_table_header_kw',
      {
        calendar_week: '{}',
      }
    ),
    headerPartialWeek: translateKey(
      'planning_table.calendar_week_table_header_part_week',
      { days: '{}' }
    ),
    productLineAndText: translateKey('more_information.product_line_and_text'),
    supplyConcept: translateKey('supply_concept.title'),
    kpi: translateKey('planning_table.kpi'),
    validatedForecast: translateKey('planning_table.validated_forecast'),
    'supplyConcept.ELSE': translateKey('supply_concept.ELSE'),
    deliveries: activeAndPredecessor
      ? translateKey('planning_table.deliveries_combined')
      : translateKey('planning_table.deliveries'),
    firmBusiness: activeAndPredecessor
      ? translateKey('planning_table.firm_business_combined')
      : translateKey('planning_table.firm_business'),
    opportunities: translateKey('planning_table.opportunities'),
    forecastProposal: translateKey('planning_table.forecast_proposal'),
    forecastProposalDemandPlanner: translateKey(
      'planning_table.forecast_proposal_demand_planner'
    ),
    currentDemandPlan: translateKey('planning_table.demand_plan'),
    opAdjustment: translateKey('menu_item.opAdjustment'),
  };
}
