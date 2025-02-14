import { GlobalSelectionStateService } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';

export interface CustomerEntry {
  salesOrg?: string;
  customerNumber: string;
  customerName?: string;
  planningCurrency?: string;
}

export type GlobalSelectionCriteriaFilters = Partial<
  Record<(typeof GlobalSelectionStateService.stateKeys)[number], string[]>
>;

export type GlobalSelectionCriteriaFields = Partial<
  Record<
    (typeof GlobalSelectionStateService.stateKeys)[number],
    SelectableValue[]
  >
>;

export enum GlobalSelectionStatus {
  DATA_AVAILABLE = 'DATA_AVAILABLE',
  DATA_NO_RESULTS = 'DATA_NO_RESULTS',
  DATA_LOADING = 'DATA_LOADING',
  DATA_ERROR = 'DATA_ERROR',
  DATA_NOTHING_SELECTED = 'DATA_NOTHING_SELECTED',
}

export enum Region {
  Europe = 'EU',
  GreaterChina = 'GC',
  AsiaPacific = 'AP',
  Americas = 'AM',
}
