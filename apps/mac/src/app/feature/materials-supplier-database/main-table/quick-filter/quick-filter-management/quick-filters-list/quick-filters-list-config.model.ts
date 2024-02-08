import { Observable } from 'rxjs';

import { QuickFilter } from '@mac/feature/materials-supplier-database/models';

import { TableConfig } from './quick-filters-list.component';

export interface QuickFiltersListConfig {
  icon: string;
  titleTranslationKeySuffix: string;
  tableConfig?: TableConfig;
  searchable: boolean;
  search?: (searchExpression: string) => void;
  actions: QuickFiltersListAction[];
  quickFilters$: Observable<QuickFilter[]>;
}

interface QuickFiltersListAction {
  icon: string;
  tooltipTranslationKeySuffix: string;
  shouldDisable: (quickFilter: QuickFilter) => Observable<boolean>;
  shouldHide: (quickFilter: QuickFilter) => Observable<boolean>;
  onClick: (quickFilter: QuickFilter) => void;
}
