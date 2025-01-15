import { ColDef } from 'ag-grid-enterprise';

export interface FilterValues {
  deliveries: boolean;
  firmBusiness: boolean;
  opportunities: boolean;
  forecastProposal: boolean;
  forecastProposalDemandPlanner: boolean;
  indicativeDemandPlanning: boolean;
  currentDemandPlan: boolean;
  activeAndPredecessor: boolean;
}

export type DemandValidationTableColDef = ColDef & {
  key: (
    options: FilterValues,
    materialClassification?: string
  ) => string | undefined;
  title: (options: FilterValues, materialClassification?: string) => string;
  visible: (options: FilterValues, materialClassification?: string) => boolean;
  titleStyle: () => string;
  color?: (materialClassification?: string) => string;
};

export const kpiColumnDefinitionsRequested: DemandValidationTableColDef[] = [
  {
    key: (options: FilterValues) =>
      options.activeAndPredecessor ? 'deliveriesCombined' : 'deliveriesActive',
    title: (options: FilterValues) =>
      options.activeAndPredecessor
        ? 'validation_of_demand.planning_table.deliveries_combined'
        : 'validation_of_demand.planning_table.deliveries',
    visible: (options: FilterValues) => options.deliveries,
    titleStyle: () => 'font-weight-bold',
    editable: false,
    color: () => 'dimmed-grey',
  },
  {
    key: () => 'deliveriesActive',
    title: () => 'validation_of_demand.planning_table.deliveries_active',
    visible: (options: FilterValues) =>
      options.deliveries && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'deliveriesPredecessor',
    title: () => 'validation_of_demand.planning_table.deliveries_predecessor',
    visible: (options: FilterValues) =>
      options.deliveries && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: (options: FilterValues) =>
      options.activeAndPredecessor
        ? 'firmBusinessCombined'
        : 'firmBusinessActive',
    title: (options: FilterValues) =>
      options.activeAndPredecessor
        ? 'validation_of_demand.planning_table.firm_business_combined'
        : 'validation_of_demand.planning_table.firm_business',
    visible: (options: FilterValues) => options.firmBusiness,
    titleStyle: () => 'font-weight-bold',
    editable: false,
    color: () => 'dimmed-yellow',
  },
  {
    key: () => 'firmBusinessActive',
    title: () => 'validation_of_demand.planning_table.firm_business_active',
    visible: (options: FilterValues) =>
      options.firmBusiness && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'firmBusinessPredecessor',
    title: () =>
      'validation_of_demand.planning_table.firm_business_predecessor',
    visible: (options: FilterValues) =>
      options.firmBusiness && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'opportunities',
    title: () => 'validation_of_demand.planning_table.opportunities',
    visible: (options: FilterValues) => options.opportunities,
    titleStyle: () => 'font-weight-bold',
    editable: false,
    color: () => 'dimmed-red',
  },
  {
    key: () => 'forecastProposal',
    title: () => 'validation_of_demand.planning_table.forecast_proposal',
    visible: (options: FilterValues) => options.forecastProposal,
    titleStyle: () => 'font-weight-bold',
    editable: false,
  },
  {
    key: () => 'forecastProposalDemandPlanner',
    title: () =>
      'validation_of_demand.planning_table.forecast_proposal_demand_planner',
    visible: (options: FilterValues) => options.forecastProposalDemandPlanner,
    titleStyle: () => 'font-weight-bold',
    editable: false,
  },
  {
    key: () => 'validatedForecast',
    title: () => 'validation_of_demand.planning_table.validated_forecast',
    visible: () => true,
    titleStyle: () => 'highlighted',
    editable: true,
  },
  {
    key: () => 'indicativeDemandPlan',
    title: () => 'validation_of_demand.planning_table.indicative_demand_plan',
    visible: (options: FilterValues) => options.indicativeDemandPlanning,
    titleStyle: () => 'font-weight-bold',
    editable: false,
  },
  {
    key: () => 'currentDemandPlan',
    title: (_: FilterValues, materialClassification?: string) =>
      materialClassification === 'OP'
        ? 'validation_of_demand.menu_item.opAdjustment'
        : 'validation_of_demand.planning_table.demand_plan',
    visible: (options: FilterValues) => options.currentDemandPlan,
    titleStyle: () => 'font-weight-bold',
    editable: false,
    color: (materialClassification?: string) =>
      materialClassification === 'OP' ? 'dimmed-blue' : 'dimmed-green',
  },
];

export const kpiColumnDefinitionsConfirmed: DemandValidationTableColDef[] = [
  {
    key: (options: FilterValues) =>
      options.activeAndPredecessor
        ? 'confirmedDeliveriesCombined'
        : 'confirmedDeliveriesActive',
    title: (options: FilterValues) =>
      options.activeAndPredecessor
        ? 'validation_of_demand.planning_table.deliveries_combined'
        : 'validation_of_demand.planning_table.deliveries',
    visible: (options: FilterValues) => options.deliveries,
    titleStyle: () => 'font-weight-bold',
    editable: false,
    color: () => 'dimmed-grey',
  },
  {
    key: () => 'confirmedDeliveriesActive',
    title: () => 'validation_of_demand.planning_table.deliveries_active',
    visible: (options: FilterValues) =>
      options.deliveries && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'confirmedDeliveriesPredecessor',
    title: () => 'validation_of_demand.planning_table.deliveries_predecessor',
    visible: (options: FilterValues) =>
      options.deliveries && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: (options: FilterValues) =>
      options.activeAndPredecessor
        ? 'confirmedFirmBusinessCombined'
        : 'confirmedFirmBusinessActive',
    title: (options: FilterValues) =>
      options.activeAndPredecessor
        ? 'validation_of_demand.planning_table.firm_business_combined'
        : 'validation_of_demand.planning_table.firm_business',
    visible: (options: FilterValues) => options.firmBusiness,
    titleStyle: () => 'font-weight-bold',
    editable: false,
    color: () => 'dimmed-yellow',
  },
  {
    key: () => 'confirmedFirmBusinessActive',
    title: () => 'validation_of_demand.planning_table.firm_business_active',
    visible: (options: FilterValues) =>
      options.firmBusiness && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'confirmedFirmBusinessPredecessor',
    title: () =>
      'validation_of_demand.planning_table.firm_business_predecessor',
    visible: (options: FilterValues) =>
      options.firmBusiness && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: undefined,
    title: () => 'validation_of_demand.planning_table.opportunities',
    visible: (options: FilterValues) => options.opportunities,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: undefined,
    title: () => 'validation_of_demand.planning_table.forecast_proposal',
    visible: (options: FilterValues) => options.forecastProposal,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: undefined,
    title: () =>
      'validation_of_demand.planning_table.forecast_proposal_demand_planner',
    visible: (options: FilterValues) => options.forecastProposalDemandPlanner,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: undefined,
    title: () => 'validation_of_demand.planning_table.validated_forecast',
    visible: () => true,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: undefined,
    title: () => 'validation_of_demand.planning_table.indicative_demand_plan',
    visible: (options: FilterValues) => options.indicativeDemandPlanning,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: (_: FilterValues, materialClassification?: string) =>
      materialClassification === 'OP' ? undefined : 'confirmedDemandPlan',
    title: (_: FilterValues, materialClassification?: string) =>
      materialClassification === 'OP'
        ? 'validation_of_demand.menu_item.opAdjustment'
        : 'validation_of_demand.planning_table.demand_plan',
    visible: (options: FilterValues) => options.currentDemandPlan,
    titleStyle: (materialClassification?: string) =>
      materialClassification === 'OP' ? 'gray' : 'font-weight-bold',
    editable: false,
    color: (materialClassification?: string) =>
      materialClassification === 'OP' ? '' : 'dimmed-green',
  },
];
