import { ColDef } from 'ag-grid-enterprise';

import { KpiType } from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
export interface FilterValues {
  [KpiType.Deliveries]: boolean;
  [KpiType.FirmBusiness]: boolean;
  [KpiType.ForecastProposal]: boolean;
  [KpiType.ForecastProposalDemandPlanner]: boolean;
  [KpiType.ValidatedForecast]: boolean;
  [KpiType.DemandRelevantSales]: boolean;
  [KpiType.SalesAmbition]: boolean;
  [KpiType.Opportunities]: boolean;
  [KpiType.DailyRollingSalesForecast]: boolean;
}

type FilterProps = FilterValues & {
  expanded: boolean;
};

export interface CustomTreeDataAutoGroupColumnDef extends ColDef {
  key: (options: FilterProps) => string | undefined;
  title: (options: FilterProps) => string;
  visible: (options: FilterValues) => boolean;
  path: string[];
  titleStyle?: string;
  dotStyle?: string;
  color?: string;
}

export function getColumnDefinitions(config: {
  planningView: PlanningView;
}): CustomTreeDataAutoGroupColumnDef[] {
  const isConfirmed = config.planningView === PlanningView.CONFIRMED;

  const uppercase = (baseKey: string) =>
    baseKey.charAt(0).toUpperCase() + baseKey.slice(1);

  const createKey = (baseKey: string) =>
    `${isConfirmed ? `confirmed${uppercase(baseKey)}` : baseKey}`;

  const createToggleKey = (baseKey: string, options: FilterProps) =>
    `${createKey(baseKey)}${options.expanded ? 'Combined' : 'Active'}`;

  const createToggleTitle = (baseKey: string, options: FilterProps) =>
    `${key}.${baseKey}${options.expanded ? 'Combined' : ''}`;

  const createColumnDef = ({
    key,
    title,
    visible,
    additionalProps,
  }: {
    key: (options: FilterProps) => string;
    title: (options: FilterProps) => string;
    visible: (options: FilterValues) => boolean;
    additionalProps?: Partial<CustomTreeDataAutoGroupColumnDef>;
  }): CustomTreeDataAutoGroupColumnDef => ({
    key,
    title,
    visible,
    path: [],
    ...additionalProps,
  });
  const key = 'validation_of_demand.planningTable';

  return [
    // ////////////////////////
    // Deliveries (Active / Combined) | CONFIRMED & REQUESTED
    createColumnDef({
      key: (options) => createToggleKey(KpiType.Deliveries, options),
      title: (options) => createToggleTitle(KpiType.Deliveries, options),
      visible: (options) => options[KpiType.Deliveries],
      additionalProps: {
        color: 'dimmed-grey',
        path: [KpiType.Deliveries],
      },
    }),
    // Extended: Active
    createColumnDef({
      key: () => `${createKey(KpiType.Deliveries)}Active`,
      title: () => `${key}.${KpiType.Deliveries}Active`,
      visible: (options) => options[KpiType.Deliveries],
      additionalProps: {
        titleStyle: 'indented',
        path: [KpiType.Deliveries, 'active'],
      },
    }),
    // Extended: Predecessor
    createColumnDef({
      key: () => `${createKey(KpiType.Deliveries)}Predecessor`,
      title: () => `${key}.${KpiType.Deliveries}Predecessor`,
      visible: (options) => options[KpiType.Deliveries],
      additionalProps: {
        titleStyle: 'indented',
        path: [KpiType.Deliveries, 'predecessor'],
      },
    }),
    // ////////////

    // ////////////////////////
    // Firm Business (Active / Combined) | CONFIRMED & REQUESTED
    createColumnDef({
      key: (options) => createToggleKey(KpiType.FirmBusiness, options),
      title: (options) => createToggleTitle(KpiType.FirmBusiness, options),
      visible: (options) => options[KpiType.FirmBusiness],
      additionalProps: {
        color: 'dimmed-yellow',
        path: [KpiType.FirmBusiness],
      },
    }),
    // Extended: Active
    createColumnDef({
      key: () => `${createKey(KpiType.FirmBusiness)}Active`,
      title: () => `${key}.${KpiType.FirmBusiness}`,
      visible: (options) => options[KpiType.FirmBusiness],
      additionalProps: {
        titleStyle: 'indented',
        path: [KpiType.FirmBusiness, 'active'],
      },
    }),
    // Extended: Predecessor
    createColumnDef({
      key: () => `${createKey(KpiType.FirmBusiness)}Predecessor`,
      title: () => `${key}.${KpiType.FirmBusiness}Predecessor`,
      visible: (options) => options[KpiType.FirmBusiness],
      additionalProps: {
        titleStyle: 'indented',
        path: [KpiType.FirmBusiness, 'predecessor'],
      },
    }),
    // ////////////

    // ////////////////////////
    // Forecast Proposal (ADD*ONE) | CONFIRMED (inactive) & REQUESTED
    createColumnDef({
      key: () => (isConfirmed ? undefined : KpiType.ForecastProposal),
      title: () => `${key}.${KpiType.ForecastProposal}`,
      visible: (options) => options[KpiType.ForecastProposal],
      additionalProps: {
        titleStyle: isConfirmed ? 'pseudo-deactivated' : '',
        path: [KpiType.ForecastProposal],
      },
    }),
    // ////////////

    // ////////////////////////
    // Forecast Proposal (Demand Planner) | CONFIRMED (inactive) & REQUESTED
    createColumnDef({
      key: () =>
        isConfirmed ? undefined : KpiType.ForecastProposalDemandPlanner,
      title: () => `${key}.${KpiType.ForecastProposalDemandPlanner}`,
      visible: (options) => options[KpiType.ForecastProposalDemandPlanner],
      additionalProps: {
        titleStyle: isConfirmed ? 'pseudo-deactivated' : '',
        path: [KpiType.ForecastProposalDemandPlanner],
      },
    }),
    // ////////////

    // ////////////////////////
    // Validated Customer Forecast | CONFIRMED (inactive) & REQUESTED
    createColumnDef({
      key: () => (isConfirmed ? undefined : KpiType.ValidatedForecast),
      title: () => `${key}.${KpiType.ValidatedForecast}`,
      visible: () => true,
      additionalProps: {
        titleStyle: isConfirmed ? 'pseudo-deactivated' : 'highlighted',
        editable: !isConfirmed,
        path: [KpiType.ValidatedForecast],
      },
    }),
    // ////////////

    // ////////////////////////
    // Demand Relevant Sales | CONFIRMED & REQUESTED
    createColumnDef({
      key: () => createKey(KpiType.DemandRelevantSales),
      title: () => `${key}.${KpiType.DemandRelevantSales}`,
      visible: (options) => options[KpiType.DemandRelevantSales],
      additionalProps: { path: [KpiType.DemandRelevantSales] },
    }),
    // Extended: Firm Business (Active)
    createColumnDef({
      key: () => `${createKey(KpiType.FirmBusiness)}Active`,
      title: (options) => `${createToggleTitle(KpiType.FirmBusiness, options)}`,
      visible: (options) => options[KpiType.DemandRelevantSales],
      additionalProps: {
        dotStyle: 'indented',
        color: 'dimmed-yellow',
        path: [KpiType.DemandRelevantSales, KpiType.FirmBusiness],
      },
    }),
    // Extended: On Top Order in Production
    createColumnDef({
      key: () => createKey(KpiType.OnTopOrder),
      title: () => `${key}.${KpiType.OnTopOrder}`,
      visible: (options) => options[KpiType.DemandRelevantSales],
      additionalProps: {
        dotStyle: 'indented',
        color: 'dimmed-green',
        path: [KpiType.DemandRelevantSales, KpiType.OnTopOrder],
      },
    }),
    // Extended: On Top Capacity Forecast for Production
    createColumnDef({
      key: () => createKey(KpiType.OnTopCapacityForecast),
      title: () => `${key}.${KpiType.OnTopCapacityForecast}`,
      visible: (options) => options[KpiType.DemandRelevantSales],
      additionalProps: {
        dotStyle: 'indented',
        color: 'dimmed-blue',
        path: [KpiType.DemandRelevantSales, KpiType.OnTopCapacityForecast],
      },
    }),
    // ////////////

    // ////////////////////////
    // Sales Ambition | CONFIRMED & REQUESTED
    createColumnDef({
      key: () => createKey(KpiType.SalesAmbition),
      title: () => `${key}.${KpiType.SalesAmbition}`,
      visible: (options) => options[KpiType.SalesAmbition],
      additionalProps: {
        color: 'dimmed-pink',
        path: [KpiType.SalesAmbition],
      },
    }),
    // ////////////

    // ////////////////////////
    // Opportunities | CONFIRMED & REQUESTED
    createColumnDef({
      key: () => createKey(KpiType.Opportunities),
      title: () => `${key}.${KpiType.Opportunities}`,
      visible: (options) => options[KpiType.Opportunities],
      additionalProps: {
        color: 'dimmed-red',
        path: [KpiType.Opportunities],
      },
    }),
    // ////////////

    // ////////////////////////
    // Daily Rolling Sales Forecast | CONFIRMED & REQUESTED
    createColumnDef({
      key: () => createKey(KpiType.DailyRollingSalesForecast),
      title: () => `${key}.${KpiType.DailyRollingSalesForecast}`,
      visible: (options) => options[KpiType.DailyRollingSalesForecast],
      additionalProps: { path: [KpiType.DailyRollingSalesForecast] },
    }),
    // ////////////
  ];
}
