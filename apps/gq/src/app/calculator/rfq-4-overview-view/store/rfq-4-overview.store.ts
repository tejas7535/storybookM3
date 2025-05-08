import { computed, inject } from '@angular/core';

import { mergeMap, pipe, switchMap, tap, timer } from 'rxjs';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { Rfq4CalculatorService } from '@gq/calculator/service/rfq-4-calculator.service';
import { getRouteParams } from '@gq/core/store/selectors/router/router.selector';
import { translate } from '@jsverse/transloco';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';

import { CalculatorTab } from '../models/calculator-tab.enum';
import { CalculatorViewToggle } from '../models/calculator-view-toggle.interface';
interface Rfq4OverviewItems {
  activeTab: CalculatorTab;
  [CalculatorTab.OPEN]: string[];
  [CalculatorTab.IN_PROGRESS]: string[];
  [CalculatorTab.DONE]: string[];
}

export interface Rfq4OverviewTabCounts {
  [CalculatorTab.OPEN]: number;
  [CalculatorTab.IN_PROGRESS]: number;
  [CalculatorTab.DONE]: number;
}

interface Rfq4OverviewState {
  countLoading: boolean;
  loading: boolean;
  items: Rfq4OverviewItems;
  tabCounts: Rfq4OverviewTabCounts;
}

const initialState: Rfq4OverviewState = {
  countLoading: false,
  loading: false,
  items: {
    activeTab: CalculatorTab.OPEN,
    [CalculatorTab.OPEN]: ['I', 'Have', 'Some'],
    [CalculatorTab.IN_PROGRESS]: ['Me', 'Too'],
    [CalculatorTab.DONE]: ['I', 'Am', 'Done'],
  },
  tabCounts: {
    [CalculatorTab.OPEN]: 3,
    [CalculatorTab.IN_PROGRESS]: 2,
    [CalculatorTab.DONE]: 3,
  },
};

export const Rfq4OverviewStore = signalStore(
  withDevtools('Rfq4OverviewStore'),
  withState(initialState),

  withComputed(({ items, tabCounts }) => ({
    getViewToggles: computed(() => getViewToggles(items(), tabCounts())),
    getItemsForTab: computed(() => getItemsForActiveTab(items())),
    // TODO: this is for testing purposes only, remove it when real data is used
    getTabCountsOfDisplayedItems: computed(() => ({
      [CalculatorTab.OPEN]: items()[CalculatorTab.OPEN].length,
      [CalculatorTab.IN_PROGRESS]: items()[CalculatorTab.IN_PROGRESS].length,
      [CalculatorTab.DONE]: items()[CalculatorTab.DONE].length,
    })),
    getTabCountOfDatabaseItems: computed(() => tabCounts()),
  })),
  withMethods((store, calculatorService = inject(Rfq4CalculatorService)) => {
    function updateActiveTabByViewId(viewId: number): void {
      patchState(store, (state) => ({
        ...state,
        items: {
          ...state.items,
          activeTab: getViewToggles(state.items, state.tabCounts)[viewId].tab,
        },
      }));
    }

    function updateActiveTab(tab: CalculatorTab): void {
      patchState(store, (state) => ({
        ...state,
        items: {
          ...state.items,
          activeTab: tab,
        },
      }));
    }

    const loadCountFromInterval = rxMethod<void>(
      pipe(
        mergeMap(() =>
          timer(5000, 5000).pipe(
            tap(() => patchState(store, { countLoading: true })),
            switchMap(() =>
              calculatorService.loadCount(store.tabCounts()).pipe(
                tapResponse({
                  next: (loadedTabCounts) => {
                    patchState(store, {
                      tabCounts: loadedTabCounts,
                      countLoading: false,
                    });
                    loadDataForTab(store.items().activeTab);
                  },
                  error: () => patchState(store, { countLoading: false }),
                })
              )
            )
          )
        )
      )
    );

    const loadDataForTab = rxMethod(
      pipe(
        switchMap(() =>
          calculatorService
            .loadDataForTab(
              store.getItemsForTab(),
              store.getTabCountsOfDisplayedItems()[store.items().activeTab],
              store.getTabCountOfDatabaseItems()[store.items().activeTab]
            )
            .pipe(
              tapResponse({
                next: (loadedItems) => {
                  patchState(store, {
                    items: {
                      ...store.items(),
                      [store.items().activeTab]: loadedItems,
                    },
                    loading: false,
                  });
                },
                error: () => patchState(store, { loading: false }),
              })
            )
        )
      )
    );

    return {
      updateActiveTabByViewId,
      updateActiveTab,
      loadCountFromInterval,
      loadDataForTab,
    };
  }),
  withHooks({
    onInit(store) {
      const ngrxStore = inject(Store);
      ngrxStore.select(getRouteParams).subscribe((route) => {
        patchState(store, (state) => ({
          ...state,
          items: {
            ...state.items,
            activeTab:
              route?.calculatorTab ||
              state.items.activeTab ||
              CalculatorTab.OPEN,
          },
        }));
      });

      store.loadCountFromInterval();
    },
  })
);

const getItemsForActiveTab = (items: Rfq4OverviewItems): string[] => {
  switch (items.activeTab) {
    case CalculatorTab.OPEN: {
      return items[CalculatorTab.OPEN];
    }
    case CalculatorTab.IN_PROGRESS: {
      return items[CalculatorTab.IN_PROGRESS];
    }
    case CalculatorTab.DONE: {
      return items[CalculatorTab.DONE];
    }

    default: {
      return undefined;
    }
  }
};

const getViewToggles = (
  items: Rfq4OverviewItems,
  tabCounts: Rfq4OverviewTabCounts
): CalculatorViewToggle[] => [
  {
    id: 0,
    tab: CalculatorTab.OPEN,
    active: items.activeTab === CalculatorTab.OPEN,
    title: translate('rfq4Overview.rfq4OverviewTable.viewToggle.open', {
      count: tabCounts[CalculatorTab.OPEN],
    }),
  },
  {
    id: 1,
    tab: CalculatorTab.IN_PROGRESS,
    active: items.activeTab === CalculatorTab.IN_PROGRESS,
    title: translate('rfq4Overview.rfq4OverviewTable.viewToggle.inProgress', {
      count: tabCounts[CalculatorTab.IN_PROGRESS],
    }),
  },
  {
    id: 2,
    tab: CalculatorTab.DONE,
    active: items.activeTab === CalculatorTab.DONE,
    title: translate('rfq4Overview.rfq4OverviewTable.viewToggle.done', {
      count: tabCounts[CalculatorTab.DONE],
    }),
  },
];
