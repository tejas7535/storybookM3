/* eslint-disable max-lines */

import { ColDef } from 'ag-grid-community';

import {
  dimmedBlue,
  dimmedGreen,
  dimmedGrey,
  dimmedRed,
  dimmedYellow,
} from '../../../../shared/styles/colors';

// TODO move to toolbar-kpi-table file after implementation
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

// export function getKpiColumnDefinitionsRequested(): (ColDef & {
//   key: (options: any) => string,
//   title: (options: any) => string,
//   visible: (options: any) => boolean,
//   titleStyle: (options: any) => string,
//   color?: (materialClassification?: string) => string,
// })[] {
//   return [
//     {
//       key: (options: FilterValues) =>
//         options.activeAndPredecessor
//           ? ('deliveriesCombined' as const)
//           : ('deliveriesActive' as const),
//       title: (options: FilterValues) =>
//         options.activeAndPredecessor
//           ? ('validation_of_demand.planning_table.deliveries_combined' as const)
//           : ('validation_of_demand.planning_table.deliveries' as const),
//       visible: (options: FilterValues) => options.deliveries,
//       titleStyle: () => 'fontWeightBold',
//       editable: false,
//       color: () => dimmedGrey,
//     },
//     {
//       key: () => 'deliveriesActive' as const,
//       title: () => 'validation_of_demand.planning_table.deliveries_active' as const,
//       visible: (options: FilterValues) => options.deliveries && options.activeAndPredecessor,
//       titleStyle: () => 'indented',
//       editable: false,
//
//     },
//     {
//       key: () => 'deliveriesPredecessor' as const,
//       title: () => 'validation_of_demand.planning_table.deliveries_predecessor' as const,
//       visible: (options: FilterValues) => options.deliveries && options.activeAndPredecessor,
//       titleStyle: () => 'indented',
//       editable: false,
//
//     },
//     {
//       key: (options: FilterValues) =>
//         options.activeAndPredecessor
//           ? ('firmBusinessCombined' as const)
//           : ('firmBusinessActive' as const),
//       title: (options: FilterValues) =>
//         options.activeAndPredecessor
//           ? ('validation_of_demand.planning_table.firm_business_combined' as const)
//           : ('validation_of_demand.planning_table.firm_business' as const),
//       visible: (options: FilterValues) => options.firmBusiness,
//       titleStyle: () => 'fontWeightBold',
//       editable: false,
//       color: () => dimmedYellow,
//     },
//     {
//       key: () => 'firmBusinessActive' as const,
//       title: () => 'validation_of_demand.planning_table.firm_business_active' as const,
//       visible: (options: FilterValues) => options.firmBusiness && options.activeAndPredecessor,
//       titleStyle: () => 'indented',
//       editable: false,
//
//     },
//     {
//       key: () => 'firmBusinessPredecessor' as const,
//       title: () => 'validation_of_demand.planning_table.firm_business_predecessor' as const,
//       visible: (options: FilterValues) => options.firmBusiness && options.activeAndPredecessor,
//       titleStyle: () => 'indented',
//       editable: false,
//
//     },
//     {
//       key: () => 'opportunities' as const,
//       title: () => 'validation_of_demand.planning_table.opportunities' as const,
//       visible: (options: FilterValues) => options.opportunities,
//       titleStyle: () => 'fontWeightBold',
//       editable: false,
//       color: () => dimmedRed,
//     },
//     {
//       key: () => 'forecastProposal' as const,
//       title: () => 'validation_of_demand.planning_table.forecast_proposal' as const,
//       visible: (options: FilterValues) => options.forecastProposal,
//       titleStyle: () => 'fontWeightBold',
//       editable: false,
//
//     },
//     {
//       key: () => 'forecastProposalDemandPlanner' as const,
//       title: () => 'validation_of_demand.planning_table.forecast_proposal_demand_planner' as const,
//       visible: (options: FilterValues) => options.forecastProposalDemandPlanner,
//       titleStyle: () => 'fontWeightBold',
//       editable: false,
//
//     },
//     {
//       key: () => 'validatedForecast' as const,
//       title: () => 'validation_of_demand.planning_table.validated_forecast' as const,
//       visible: () => true,
//       titleStyle: () => 'highlighted',
//       editable: true,
//
//     },
//     {
//       key: () => 'indicativeDemandPlan' as const,
//       title: () => 'validation_of_demand.planning_table.indicative_demand_plan' as const,
//       visible: (options: FilterValues) => options.indicativeDemandPlanning,
//       titleStyle: () => 'fontWeightBold',
//       editable: false,
//
//     },
//     {
//       key: () => 'currentDemandPlan' as const,
//       title: (_options: FilterValues, materialClassification?: string) =>
//         materialClassification === 'OP'
//           ? ('validation_of_demand.menu_item.opAdjustment' as const)
//           : ('validation_of_demand.planning_table.demand_plan' as const),
//       visible: (options: FilterValues) => options.currentDemandPlan,
//       titleStyle: () => 'fontWeightBold',
//       editable: false,
//       color: (materialClassification?: string) =>
//         materialClassification === 'OP' ? dimmedBlue : dimmedGreen,
//     },
//   ];
// }
//
// export function getKpiColumnDefinitionsConfirmed(): (ColDef & {
//   key: (options: any) => string,
//   title: (options: any) => string,
//   visible: (options: any) => boolean,
//   titleStyle: (options: any) => string,
//   color?: (materialClassification?: string) => string,
// })[] {
//   return [
//     {
//       key: (options: FilterValues) =>
//         options.activeAndPredecessor
//           ? ('confirmedDeliveriesCombined' as const)
//           : ('confirmedDeliveriesActive' as const),
//       title: (options: FilterValues) =>
//         options.activeAndPredecessor
//           ? ('validation_of_demand.planning_table.deliveries_combined' as const)
//           : ('validation_of_demand.planning_table.deliveries' as const),
//       visible: (options: FilterValues) => options.deliveries,
//       titleStyle: () => 'fontWeightBold',
//       editable: false,
//       color: () => dimmedGrey,
//     },
//     {
//       key: () => 'confirmedDeliveriesActive' as const,
//       title: () => 'validation_of_demand.planning_table.deliveries_active' as const,
//       visible: (options: FilterValues) => options.deliveries && options.activeAndPredecessor,
//       titleStyle: () => 'indented',
//       editable: false,
//
//     },
//     {
//       key: () => 'confirmedDeliveriesPredecessor' as const,
//       title: () => 'validation_of_demand.planning_table.deliveries_predecessor' as const,
//       visible: (options: FilterValues) => options.deliveries && options.activeAndPredecessor,
//       titleStyle: () => 'indented',
//       editable: false,
//
//     },
//     {
//       key: (options: FilterValues) =>
//         options.activeAndPredecessor
//           ? ('confirmedFirmBusinessCombined' as const)
//           : ('confirmedFirmBusinessActive' as const),
//       title: (options: FilterValues) =>
//         options.activeAndPredecessor
//           ? ('validation_of_demand.planning_table.firm_business_combined' as const)
//           : ('validation_of_demand.planning_table.firm_business' as const),
//       visible: (options: FilterValues) => options.firmBusiness,
//       titleStyle: () => 'fontWeightBold',
//       editable: false,
//       color: () => dimmedYellow,
//     },
//     {
//       key: () => 'confirmedFirmBusinessActive' as const,
//       title: () => 'validation_of_demand.planning_table.firm_business_active' as const,
//       visible: (options: FilterValues) => options.firmBusiness && options.activeAndPredecessor,
//       titleStyle: () => 'indented',
//       editable: false,
//
//     },
//     {
//       key: () => 'confirmedFirmBusinessPredecessor' as const,
//       title: () => 'validation_of_demand.planning_table.firm_business_predecessor' as const,
//       visible: (options: FilterValues) => options.firmBusiness && options.activeAndPredecessor,
//       titleStyle: () => 'indented',
//       editable: false,
//
//     },
//     {
//       key: () => '',
//       title: () => 'validation_of_demand.planning_table.opportunities' as const,
//       visible: (options: FilterValues) => options.opportunities,
//       titleStyle: () => 'gray',
//       editable: false,
//
//     },
//     {
//       key: () => '',
//       title: () => 'validation_of_demand.planning_table.forecast_proposal' as const,
//       visible: (options: FilterValues) => options.forecastProposal,
//       titleStyle: () => 'gray',
//       editable: false,
//
//     },
//     {
//       key: () => '',
//       title: () => 'validation_of_demand.planning_table.forecast_proposal_demand_planner' as const,
//       visible: (options: FilterValues) => options.forecastProposalDemandPlanner,
//       titleStyle: () => 'gray',
//       editable: false,
//
//     },
//     {
//       key: () => '',
//       title: () => 'validation_of_demand.planning_table.validated_forecast' as const,
//       visible: () => true,
//       titleStyle: () => 'gray',
//       editable: false,
//
//     },
//     {
//       key: () => '',
//       title: () => 'validation_of_demand.planning_table.indicative_demand_plan' as const,
//       visible: (options: FilterValues) => options.indicativeDemandPlanning,
//       titleStyle: () => 'gray',
//       editable: false,
//
//     },
//     {
//       key: (materialClassification?: string) =>
//         materialClassification === 'OP' ? undefined : ('confirmedDemandPlan' as const),
//       title: (materialClassification?: string) =>
//         materialClassification === 'OP'
//           ? ('validation_of_demand.menu_item.opAdjustment' as const)
//           : ('validation_of_demand.planning_table.demand_plan' as const),
//       visible: (options: FilterValues) => options.currentDemandPlan,
//       titleStyle: (materialClassification?: string) =>
//         materialClassification === 'OP' ? ('gray' as const) : ('fontWeightBold' as const),
//       editable: false,
//       color: (materialClassification?: string) =>
//         materialClassification === 'OP' ? undefined : dimmedGreen,
//     },
//   ];
// }

export const kpiColumnDefinitionsRequested: (ColDef & {
  key: (options: FilterValues, materialClassification?: string) => string;
  title: (options: FilterValues, materialClassification?: string) => string;
  visible: (options: FilterValues, materialClassification?: string) => boolean;
  titleStyle: () => string;
  color?: (materialClassification?: string) => string;
})[] = [
  {
    key: (options: FilterValues) =>
      options.activeAndPredecessor
        ? ('deliveriesCombined' as const)
        : ('deliveriesActive' as const),
    title: (options: FilterValues) =>
      options.activeAndPredecessor
        ? ('validation_of_demand.planning_table.deliveries_combined' as const)
        : ('validation_of_demand.planning_table.deliveries' as const),
    visible: (options: FilterValues) => options.deliveries,
    titleStyle: () => 'fontWeightBold',
    editable: false,
    color: () => dimmedGrey,
  },
  {
    key: () => 'deliveriesActive' as const,
    title: () =>
      'validation_of_demand.planning_table.deliveries_active' as const,
    visible: (options: FilterValues) =>
      options.deliveries && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'deliveriesPredecessor' as const,
    title: () =>
      'validation_of_demand.planning_table.deliveries_predecessor' as const,
    visible: (options: FilterValues) =>
      options.deliveries && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: (options: FilterValues) =>
      options.activeAndPredecessor
        ? ('firmBusinessCombined' as const)
        : ('firmBusinessActive' as const),
    title: (options: FilterValues) =>
      options.activeAndPredecessor
        ? ('validation_of_demand.planning_table.firm_business_combined' as const)
        : ('validation_of_demand.planning_table.firm_business' as const),
    visible: (options: FilterValues) => options.firmBusiness,
    titleStyle: () => 'fontWeightBold',
    editable: false,
    color: () => dimmedYellow,
  },
  {
    key: () => 'firmBusinessActive' as const,
    title: () =>
      'validation_of_demand.planning_table.firm_business_active' as const,
    visible: (options: FilterValues) =>
      options.firmBusiness && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'firmBusinessPredecessor' as const,
    title: () =>
      'validation_of_demand.planning_table.firm_business_predecessor' as const,
    visible: (options: FilterValues) =>
      options.firmBusiness && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'opportunities' as const,
    title: () => 'validation_of_demand.planning_table.opportunities' as const,
    visible: (options: FilterValues) => options.opportunities,
    titleStyle: () => 'fontWeightBold',
    editable: false,
    color: () => dimmedRed,
  },
  {
    key: () => 'forecastProposal' as const,
    title: () =>
      'validation_of_demand.planning_table.forecast_proposal' as const,
    visible: (options: FilterValues) => options.forecastProposal,
    titleStyle: () => 'fontWeightBold',
    editable: false,
  },
  {
    key: () => 'forecastProposalDemandPlanner' as const,
    title: () =>
      'validation_of_demand.planning_table.forecast_proposal_demand_planner' as const,
    visible: (options: FilterValues) => options.forecastProposalDemandPlanner,
    titleStyle: () => 'fontWeightBold',
    editable: false,
  },
  {
    key: () => 'validatedForecast' as const,
    title: () =>
      'validation_of_demand.planning_table.validated_forecast' as const,
    visible: () => true,
    titleStyle: () => 'highlighted',
    editable: true,
  },
  {
    key: () => 'indicativeDemandPlan' as const,
    title: () =>
      'validation_of_demand.planning_table.indicative_demand_plan' as const,
    visible: (options: FilterValues) => options.indicativeDemandPlanning,
    titleStyle: () => 'fontWeightBold',
    editable: false,
  },
  {
    key: () => 'currentDemandPlan' as const,
    title: (_: FilterValues, materialClassification?: string) =>
      materialClassification === 'OP'
        ? ('validation_of_demand.menu_item.opAdjustment' as const)
        : ('validation_of_demand.planning_table.demand_plan' as const),
    visible: (options: FilterValues) => options.currentDemandPlan,
    titleStyle: () => 'fontWeightBold',
    editable: false,
    color: (materialClassification?: string) =>
      materialClassification === 'OP' ? dimmedBlue : dimmedGreen,
  },
] as const;

export const kpiColumnDefinitionsConfirmed: (ColDef & {
  key: (options: FilterValues, materialClassification?: string) => string;
  title: (options: FilterValues, materialClassification?: string) => string;
  visible: (options: FilterValues, materialClassification?: string) => boolean;
  titleStyle: (materialClassification?: string) => string;
  color?: (materialClassification?: string) => string;
})[] = [
  {
    key: (options: FilterValues) =>
      options.activeAndPredecessor
        ? ('confirmedDeliveriesCombined' as const)
        : ('confirmedDeliveriesActive' as const),
    title: (options: FilterValues) =>
      options.activeAndPredecessor
        ? ('validation_of_demand.planning_table.deliveries_combined' as const)
        : ('validation_of_demand.planning_table.deliveries' as const),
    visible: (options: FilterValues) => options.deliveries,
    titleStyle: () => 'fontWeightBold',
    editable: false,
    color: () => dimmedGrey,
  },
  {
    key: () => 'confirmedDeliveriesActive' as const,
    title: () =>
      'validation_of_demand.planning_table.deliveries_active' as const,
    visible: (options: FilterValues) =>
      options.deliveries && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'confirmedDeliveriesPredecessor' as const,
    title: () =>
      'validation_of_demand.planning_table.deliveries_predecessor' as const,
    visible: (options: FilterValues) =>
      options.deliveries && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: (options: FilterValues) =>
      options.activeAndPredecessor
        ? ('confirmedFirmBusinessCombined' as const)
        : ('confirmedFirmBusinessActive' as const),
    title: (options: FilterValues) =>
      options.activeAndPredecessor
        ? ('validation_of_demand.planning_table.firm_business_combined' as const)
        : ('validation_of_demand.planning_table.firm_business' as const),
    visible: (options: FilterValues) => options.firmBusiness,
    titleStyle: () => 'fontWeightBold',
    editable: false,
    color: () => dimmedYellow,
  },
  {
    key: () => 'confirmedFirmBusinessActive' as const,
    title: () =>
      'validation_of_demand.planning_table.firm_business_active' as const,
    visible: (options: FilterValues) =>
      options.firmBusiness && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: () => 'confirmedFirmBusinessPredecessor' as const,
    title: () =>
      'validation_of_demand.planning_table.firm_business_predecessor' as const,
    visible: (options: FilterValues) =>
      options.firmBusiness && options.activeAndPredecessor,
    titleStyle: () => 'indented',
    editable: false,
  },
  {
    key: undefined,
    title: () => 'validation_of_demand.planning_table.opportunities' as const,
    visible: (options: FilterValues) => options.opportunities,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: undefined,
    title: () =>
      'validation_of_demand.planning_table.forecast_proposal' as const,
    visible: (options: FilterValues) => options.forecastProposal,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: undefined,
    title: () =>
      'validation_of_demand.planning_table.forecast_proposal_demand_planner' as const,
    visible: (options: FilterValues) => options.forecastProposalDemandPlanner,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: undefined,
    title: () =>
      'validation_of_demand.planning_table.validated_forecast' as const,
    visible: () => true,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: undefined,
    title: () =>
      'validation_of_demand.planning_table.indicative_demand_plan' as const,
    visible: (options: FilterValues) => options.indicativeDemandPlanning,
    titleStyle: () => 'gray',
    editable: false,
  },
  {
    key: (_: FilterValues, materialClassification?: string) =>
      materialClassification === 'OP'
        ? undefined
        : ('confirmedDemandPlan' as const),
    title: (_: FilterValues, materialClassification?: string) =>
      materialClassification === 'OP'
        ? ('validation_of_demand.menu_item.opAdjustment' as const)
        : ('validation_of_demand.planning_table.demand_plan' as const),
    visible: (options: FilterValues) => options.currentDemandPlan,
    titleStyle: (materialClassification?: string) =>
      materialClassification === 'OP'
        ? ('gray' as const)
        : ('fontWeightBold' as const),
    editable: false,
    color: (materialClassification?: string) =>
      materialClassification === 'OP' ? undefined : dimmedGreen,
  },
] as const;
