import { ColDef } from 'ag-grid-enterprise';

import { SelectedKpisAndMetadata } from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
export interface FilterValues {
  [SelectedKpisAndMetadata.Deliveries]: boolean;
  [SelectedKpisAndMetadata.FirmBusiness]: boolean;
  [SelectedKpisAndMetadata.ForecastProposal]: boolean;
  [SelectedKpisAndMetadata.ForecastProposalDemandPlanner]: boolean;
  [SelectedKpisAndMetadata.ValidatedForecast]: boolean;
  [SelectedKpisAndMetadata.DemandRelevantSales]: boolean;
  [SelectedKpisAndMetadata.SalesAmbition]: boolean;
  [SelectedKpisAndMetadata.Opportunities]: boolean;
  [SelectedKpisAndMetadata.SalesPlan]: boolean;
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
      key: (options) =>
        createToggleKey(SelectedKpisAndMetadata.Deliveries, options),
      title: (options) =>
        createToggleTitle(SelectedKpisAndMetadata.Deliveries, options),
      visible: (options) => options[SelectedKpisAndMetadata.Deliveries],
      additionalProps: {
        color: 'dimmed-grey',
        path: [SelectedKpisAndMetadata.Deliveries],
      },
    }),
    // Extended: Active
    createColumnDef({
      key: () => `${createKey(SelectedKpisAndMetadata.Deliveries)}Active`,
      title: () => `${key}.${SelectedKpisAndMetadata.Deliveries}Active`,
      visible: (options) => options[SelectedKpisAndMetadata.Deliveries],
      additionalProps: {
        titleStyle: 'indented',
        path: [SelectedKpisAndMetadata.Deliveries, 'active'],
      },
    }),
    // Extended: Predecessor
    createColumnDef({
      key: () => `${createKey(SelectedKpisAndMetadata.Deliveries)}Predecessor`,
      title: () => `${key}.${SelectedKpisAndMetadata.Deliveries}Predecessor`,
      visible: (options) => options[SelectedKpisAndMetadata.Deliveries],
      additionalProps: {
        titleStyle: 'indented',
        path: [SelectedKpisAndMetadata.Deliveries, 'predecessor'],
      },
    }),
    // ////////////

    // ////////////////////////
    // Firm Business (Active / Combined) | CONFIRMED & REQUESTED
    createColumnDef({
      key: (options) =>
        createToggleKey(SelectedKpisAndMetadata.FirmBusiness, options),
      title: (options) =>
        createToggleTitle(SelectedKpisAndMetadata.FirmBusiness, options),
      visible: (options) => options[SelectedKpisAndMetadata.FirmBusiness],
      additionalProps: {
        color: 'dimmed-yellow',
        path: [SelectedKpisAndMetadata.FirmBusiness],
      },
    }),
    // Extended: Active
    createColumnDef({
      key: () => `${createKey(SelectedKpisAndMetadata.FirmBusiness)}Active`,
      title: () => `${key}.${SelectedKpisAndMetadata.FirmBusiness}`,
      visible: (options) => options[SelectedKpisAndMetadata.FirmBusiness],
      additionalProps: {
        titleStyle: 'indented',
        path: [SelectedKpisAndMetadata.FirmBusiness, 'active'],
      },
    }),
    // Extended: Predecessor
    createColumnDef({
      key: () =>
        `${createKey(SelectedKpisAndMetadata.FirmBusiness)}Predecessor`,
      title: () => `${key}.${SelectedKpisAndMetadata.FirmBusiness}Predecessor`,
      visible: (options) => options[SelectedKpisAndMetadata.FirmBusiness],
      additionalProps: {
        titleStyle: 'indented',
        path: [SelectedKpisAndMetadata.FirmBusiness, 'predecessor'],
      },
    }),
    // ////////////

    // ////////////////////////
    // Forecast Proposal (ADD*ONE) | CONFIRMED (inactive) & REQUESTED
    createColumnDef({
      key: () =>
        isConfirmed ? undefined : SelectedKpisAndMetadata.ForecastProposal,
      title: () => `${key}.${SelectedKpisAndMetadata.ForecastProposal}`,
      visible: (options) => options[SelectedKpisAndMetadata.ForecastProposal],
      additionalProps: {
        titleStyle: isConfirmed ? 'pseudo-deactivated' : '',
        path: [SelectedKpisAndMetadata.ForecastProposal],
      },
    }),
    // ////////////

    // ////////////////////////
    // Forecast Proposal (Demand Planner) | CONFIRMED (inactive) & REQUESTED
    createColumnDef({
      key: () =>
        isConfirmed
          ? undefined
          : SelectedKpisAndMetadata.ForecastProposalDemandPlanner,
      title: () =>
        `${key}.${SelectedKpisAndMetadata.ForecastProposalDemandPlanner}`,
      visible: (options) =>
        options[SelectedKpisAndMetadata.ForecastProposalDemandPlanner],
      additionalProps: {
        titleStyle: isConfirmed ? 'pseudo-deactivated' : '',
        path: [SelectedKpisAndMetadata.ForecastProposalDemandPlanner],
      },
    }),
    // ////////////

    // ////////////////////////
    // Validated Customer Forecast | CONFIRMED (inactive) & REQUESTED
    createColumnDef({
      key: () =>
        isConfirmed ? undefined : SelectedKpisAndMetadata.ValidatedForecast,
      title: () => `${key}.${SelectedKpisAndMetadata.ValidatedForecast}`,
      visible: () => true,
      additionalProps: {
        titleStyle: isConfirmed ? 'pseudo-deactivated' : 'highlighted',
        editable: !isConfirmed,
        path: [SelectedKpisAndMetadata.ValidatedForecast],
      },
    }),
    // ////////////

    // ////////////////////////
    // Demand Relevant Sales | CONFIRMED & REQUESTED
    createColumnDef({
      key: () => createKey(SelectedKpisAndMetadata.DemandRelevantSales),
      title: () => `${key}.${SelectedKpisAndMetadata.DemandRelevantSales}`,
      visible: (options) =>
        options[SelectedKpisAndMetadata.DemandRelevantSales],
      additionalProps: { path: [SelectedKpisAndMetadata.DemandRelevantSales] },
    }),
    // Extended: Firm Business (Active)
    createColumnDef({
      key: () => `${createKey(SelectedKpisAndMetadata.FirmBusiness)}Active`,
      title: (options) =>
        `${createToggleTitle(SelectedKpisAndMetadata.FirmBusiness, options)}`,
      visible: (options) =>
        options[SelectedKpisAndMetadata.DemandRelevantSales],
      additionalProps: {
        dotStyle: 'indented',
        color: 'dimmed-yellow',
        path: [
          SelectedKpisAndMetadata.DemandRelevantSales,
          SelectedKpisAndMetadata.FirmBusiness,
        ],
      },
    }),
    // Extended: On Top Order in Production
    createColumnDef({
      key: () => createKey(SelectedKpisAndMetadata.OnTopOrder),
      title: () => `${key}.${SelectedKpisAndMetadata.OnTopOrder}`,
      visible: (options) =>
        options[SelectedKpisAndMetadata.DemandRelevantSales],
      additionalProps: {
        dotStyle: 'indented',
        color: 'dimmed-green',
        path: [
          SelectedKpisAndMetadata.DemandRelevantSales,
          SelectedKpisAndMetadata.OnTopOrder,
        ],
      },
    }),
    // Extended: On Top Capacity Forecast for Production
    createColumnDef({
      key: () => createKey(SelectedKpisAndMetadata.OnTopCapacityForecast),
      title: () => `${key}.${SelectedKpisAndMetadata.OnTopCapacityForecast}`,
      visible: (options) =>
        options[SelectedKpisAndMetadata.DemandRelevantSales],
      additionalProps: {
        dotStyle: 'indented',
        color: 'dimmed-blue',
        path: [
          SelectedKpisAndMetadata.DemandRelevantSales,
          SelectedKpisAndMetadata.OnTopCapacityForecast,
        ],
      },
    }),
    // ////////////

    // ////////////////////////
    // Sales Ambition | CONFIRMED & REQUESTED
    createColumnDef({
      key: () => createKey(SelectedKpisAndMetadata.SalesAmbition),
      title: () => `${key}.${SelectedKpisAndMetadata.SalesAmbition}`,
      visible: (options) => options[SelectedKpisAndMetadata.SalesAmbition],
      additionalProps: {
        color: 'dimmed-pink',
        path: [SelectedKpisAndMetadata.SalesAmbition],
      },
    }),
    // ////////////

    // ////////////////////////
    // Opportunities | CONFIRMED & REQUESTED
    createColumnDef({
      key: () => createKey(SelectedKpisAndMetadata.Opportunities),
      title: () => `${key}.${SelectedKpisAndMetadata.Opportunities}`,
      visible: (options) => options[SelectedKpisAndMetadata.Opportunities],
      additionalProps: {
        color: 'dimmed-red',
        path: [SelectedKpisAndMetadata.Opportunities],
      },
    }),
    // ////////////

    // ////////////////////////
    // Sales Plan | CONFIRMED & REQUESTED
    createColumnDef({
      key: () => createKey(SelectedKpisAndMetadata.SalesPlan),
      title: () => `${key}.${SelectedKpisAndMetadata.SalesPlan}`,
      visible: (options) => options[SelectedKpisAndMetadata.SalesPlan],
      additionalProps: { path: [SelectedKpisAndMetadata.SalesPlan] },
    }),
    // ////////////
  ];
}
