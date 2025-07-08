import { translate } from '@jsverse/transloco';

import {
  getDateFormatString,
  getMonthYearFormatString,
} from '../../shared/utils/date-format';
import { ValidationHelper } from '../../shared/utils/validation/validation-helper';
import {
  SelectedKpisAndMetadata,
  SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES,
} from './model';

export function getTranslationsForExport(
  activeAndPredecessor: boolean,
  locale: string
): any {
  const translateKey = (key: string, options?: any) =>
    translate(`validation_of_demand.${key}`, options);

  const translateConcept = (stochasticType: string, options?: any) =>
    translateKey(`supply_concept.${stochasticType}`, options);

  const translateAdditionalProps = (key: string, options?: any) =>
    translate(
      `material_customer.column.${key === 'currentRLTSchaeffler' ? 'currentRLTSchaefflerWithTransitTime' : key}`,
      options
    );

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

  const kpiTranslations: Partial<Record<SelectedKpisAndMetadata, string>> = {
    [SelectedKpisAndMetadata.ActiveAndPredecessor]: translateKey(
      'menu_item.activeAndPredecessor'
    ),
    [SelectedKpisAndMetadata.SalesPlan]: translateKey('menu_item.salesPlan'),
    [SelectedKpisAndMetadata.DemandRelevantSales]: translateKey(
      'menu_item.demandRelevantSales'
    ),
    [SelectedKpisAndMetadata.OnTopCapacityForecast]: translateKey(
      'menu_item.onTopCapacityForecast'
    ),
    [SelectedKpisAndMetadata.OnTopOrder]: translateKey('menu_item.onTopOrder'),
    [SelectedKpisAndMetadata.SalesAmbition]: translateKey(
      'menu_item.salesAmbition'
    ),
    [SelectedKpisAndMetadata.ValidatedForecast]: translateKey(
      'menu_item.validatedForecast'
    ),
    [SelectedKpisAndMetadata.Deliveries]: activeAndPredecessor
      ? translateKey('menu_item.deliveriesCombined')
      : translateKey('menu_item.deliveriesActive'),
    [SelectedKpisAndMetadata.FirmBusiness]: activeAndPredecessor
      ? translateKey('menu_item.firmBusinessCombined')
      : translateKey('menu_item.firmBusiness'),
    [SelectedKpisAndMetadata.Opportunities]: translateKey(
      'menu_item.opportunities'
    ),
    [SelectedKpisAndMetadata.ForecastProposal]: translateKey(
      'menu_item.forecastProposal'
    ),
    [SelectedKpisAndMetadata.ForecastProposalDemandPlanner]: translateKey(
      'menu_item.forecastProposalDemandPlanner'
    ),
  };

  const additionalPropsTranslations: Partial<
    Record<SelectedKpisAndMetadata, string>
  > = Object.fromEntries(
    [
      'customerName',
      'customerNumber',
      'materialDescription',
      'materialNumber',
      'packageSize',
      SelectedKpisAndMetadata.AccountOwner,
      SelectedKpisAndMetadata.CurrentRLTSchaeffler,
      SelectedKpisAndMetadata.CustomerClassification,
      SelectedKpisAndMetadata.CustomerCountry,
      SelectedKpisAndMetadata.CustomerMaterialNumber,
      SelectedKpisAndMetadata.DeliveryPlant,
      SelectedKpisAndMetadata.DemandCharacteristic,
      SelectedKpisAndMetadata.DemandPlanner,
      SelectedKpisAndMetadata.ForecastMaintained,
      SelectedKpisAndMetadata.ForecastValidatedAt,
      SelectedKpisAndMetadata.ForecastValidatedBy,
      SelectedKpisAndMetadata.ForecastValidatedFrom,
      SelectedKpisAndMetadata.ForecastValidatedTo,
      SelectedKpisAndMetadata.FrozenZone,
      SelectedKpisAndMetadata.GKAM,
      SelectedKpisAndMetadata.GKAMName,
      SelectedKpisAndMetadata.GKAMNumber,
      SelectedKpisAndMetadata.Gpsd,
      SelectedKpisAndMetadata.GpsdName,
      SelectedKpisAndMetadata.InternalSales,
      SelectedKpisAndMetadata.KAM,
      SelectedKpisAndMetadata.MainCustomerName,
      SelectedKpisAndMetadata.MainCustomerNumber,
      SelectedKpisAndMetadata.MaterialClassification,
      SelectedKpisAndMetadata.MaterialNumberS4,
      SelectedKpisAndMetadata.MrpGroup,
      SelectedKpisAndMetadata.PackagingSize,
      SelectedKpisAndMetadata.PlanningPlant,
      SelectedKpisAndMetadata.PortfolioStatus,
      SelectedKpisAndMetadata.PortfolioStatusDate,
      SelectedKpisAndMetadata.ProductCluster,
      SelectedKpisAndMetadata.ProductionLine,
      SelectedKpisAndMetadata.ProductionPlant,
      SelectedKpisAndMetadata.ProductionPlantName,
      SelectedKpisAndMetadata.ProductionSegment,
      SelectedKpisAndMetadata.ProductLine,
      SelectedKpisAndMetadata.ProductLineText,
      SelectedKpisAndMetadata.Region,
      SelectedKpisAndMetadata.SalesArea,
      SelectedKpisAndMetadata.SalesOrg,
      SelectedKpisAndMetadata.Sector,
      SelectedKpisAndMetadata.SectorManagement,
      SelectedKpisAndMetadata.SubKeyAccount,
      SelectedKpisAndMetadata.SubKeyAccountName,
      SelectedKpisAndMetadata.SuccessorCustomerMaterialDescription,
      SelectedKpisAndMetadata.SuccessorCustomerMaterialPackagingSize,
      SelectedKpisAndMetadata.SuccessorMaterialCustomer,
      SelectedKpisAndMetadata.SuccessorSchaefflerMaterial,
      SelectedKpisAndMetadata.SuccessorSchaefflerMaterialDescription,
      SelectedKpisAndMetadata.SuccessorSchaefflerMaterialPackagingSize,
      SelectedKpisAndMetadata.SupplyConcept,
    ].map((column) => [column, translateAdditionalProps(column)])
  );

  return {
    ...conceptTranslations,
    ...kpiTranslations,
    ...additionalPropsTranslations,
    'supplyConcept.ELSE': translateKey('supply_concept.ELSE'),
    confirmed: translate('planningType.title.CONFIRMED'),
    dateFormatMonth: getMonthYearFormatString(locale),
    dateFormatWeek: getDateFormatString(locale),
    headerCalendarWeek: translateKey(
      'planningTable.calendarWeekTableHeaderKw',
      { calendar_week: '{}' }
    ),
    headerPartialWeek: translateKey(
      'planningTable.calendarWeekTableHeaderPartWeek',
      { days: '{}' }
    ),
    kpi: translateKey('planningTable.kpi'),
    productLineAndText: translateKey('more_information.product_line_and_text'),
    requested: translate('planningType.title.REQUESTED'),
    supplyConcept: translateKey('supply_concept.title'),
    viewType: translateKey('exportModal.excelHeaderView'),
    sum: translateKey('exportModal.sum'),
    decimalSeparator: ValidationHelper.getDecimalSeparatorForActiveLocale(),
  };
}
