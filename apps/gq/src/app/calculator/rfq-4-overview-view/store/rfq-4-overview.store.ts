import { Location } from '@angular/common';
import { computed, effect, inject } from '@angular/core';

import { map, mergeMap, of, pipe, switchMap, tap, timer } from 'rxjs';

import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { CalculatorPaths } from '@gq/calculator/routing/calculator-paths.enum';
import { RfqRequest } from '@gq/calculator/service/models/get-rfq-requests-response.interface';
import { Rfq4CalculatorService } from '@gq/calculator/service/rfq-4-calculator.service';
import { getRouteParams } from '@gq/core/store/selectors/router/router.selector';
import { translate } from '@jsverse/transloco';
import { tapResponse } from '@ngrx/operators';
import {
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
import { ACTIONS } from './actions-const/actions.const';
interface Rfq4OverviewItems {
  activeTab: CalculatorTab;
  [CalculatorTab.OPEN]: RfqRequest[];
  [CalculatorTab.IN_PROGRESS]: RfqRequest[];
  [CalculatorTab.DONE]: RfqRequest[];
}

export interface Rfq4OverviewTabCounts {
  [CalculatorTab.OPEN]: number;
  [CalculatorTab.IN_PROGRESS]: number;
  [CalculatorTab.DONE]: number;
}

export interface Rfq4OverviewState {
  countLoading: boolean;
  loading: boolean;
  items: Rfq4OverviewItems;
  tabCounts: Rfq4OverviewTabCounts;
}

export const initialState: Rfq4OverviewState = {
  countLoading: false,
  loading: false,
  items: {
    activeTab: CalculatorTab.OPEN,
    [CalculatorTab.OPEN]: [],
    [CalculatorTab.IN_PROGRESS]: [],
    [CalculatorTab.DONE]: [],
  },
  tabCounts: {
    [CalculatorTab.OPEN]: 0,
    [CalculatorTab.IN_PROGRESS]: 0,
    [CalculatorTab.DONE]: 0,
  },
};

export const Rfq4OverviewStore = signalStore(
  withDevtools('Rfq4OverviewStore'),
  withState(initialState),
  withComputed(({ items }) => ({
    getItemsForTab: computed(() => getItemsForActiveTab(items())),
    getTabCountsOfDisplayedItems: computed(() => ({
      [CalculatorTab.OPEN]: items()[CalculatorTab.OPEN].length,
      [CalculatorTab.IN_PROGRESS]: items()[CalculatorTab.IN_PROGRESS].length,
      [CalculatorTab.DONE]: items()[CalculatorTab.DONE].length,
    })),
  })),
  withComputed(({ items, tabCounts, getTabCountsOfDisplayedItems }) => ({
    getViewToggles: computed(() =>
      getViewToggles(
        items.activeTab(),
        tabCounts(),
        getTabCountsOfDisplayedItems()
      )
    ),
    tabCountsOfActiveTabDiffer: computed(
      () =>
        tabCounts()[items.activeTab()] !==
        getTabCountsOfDisplayedItems()[items.activeTab()]
    ),
  })),
  withMethods((store, calculatorService = inject(Rfq4CalculatorService)) => {
    function updateActiveTabByViewId(viewId: number): void {
      updateState(store, ACTIONS.UPDATE_TAB_BY_ID, (state) => ({
        items: {
          ...state.items,
          activeTab: getViewToggles(
            store.items.activeTab(),
            state.tabCounts,
            store.getTabCountsOfDisplayedItems()
          )[viewId].tab,
        },
      }));
    }

    const loadCountFromInterval = rxMethod<void>(
      pipe(
        mergeMap(() =>
          timer(30_000, 30_000).pipe(
            tap(() => {
              updateState(store, ACTIONS.UPDATE_COUNT_LOADING, {
                countLoading: true,
              });
            }),
            switchMap(() =>
              calculatorService.loadRfqRequestsCount().pipe(
                tapResponse({
                  next: (loadedTabCounts) => {
                    updateState(store, ACTIONS.UPDATE_TAB_COUNTS, {
                      tabCounts: { ...loadedTabCounts },
                      countLoading: false,
                    });
                  },
                  error: () =>
                    updateState(store, ACTIONS.UPDATE_COUNT_LOADING, {
                      countLoading: false,
                    }),
                })
              )
            )
          )
        )
      )
    );

    const loadDataForCalculatorTab = rxMethod<CalculatorTab>(
      pipe(
        tap(() =>
          updateState(store, ACTIONS.UPDATE_LOADING, { loading: true })
        ),
        mergeMap((tab: CalculatorTab) =>
          calculatorService.getRfqRequests(tab).pipe(
            tapResponse({
              next: (loadedItems) => {
                updateState(store, ACTIONS.UPDATE_TAB_DATA, {
                  items: {
                    ...store.items(),
                    [tab]: loadedItems,
                  },
                  loading: false,
                });
                if (store.tabCounts() === initialState.tabCounts) {
                  updateState(store, `${ACTIONS.UPDATE_TAB_COUNTS}`, {
                    tabCounts: { ...store.getTabCountsOfDisplayedItems() },
                  });
                }
              },
              error: () =>
                updateState(store, ACTIONS.UPDATE_LOADING, { loading: false }),
            })
          )
        )
      )
    );
    const reloadTabDataWhenCountOfActiveTabHasChanged = rxMethod(
      pipe(
        map(() => {
          if (
            store.tabCounts()[store.items.activeTab()] ===
            store.getTabCountsOfDisplayedItems()[store.items.activeTab()]
          ) {
            return of(null);
          }

          return loadDataForCalculatorTab(store.items.activeTab());
        })
      )
    );

    return {
      updateActiveTabByViewId,
      loadCountFromInterval,
      loadDataForCalculatorTab,
      reloadTabDataWhenCountOfActiveTabHasChanged,
    };
  }),

  withHooks({
    onInit(store) {
      const ngrxStore = inject(Store);
      const location = inject(Location);
      ngrxStore.select(getRouteParams).subscribe((route) => {
        updateState(store, ACTIONS.INIT, (state) => ({
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

      // ########################################################
      // ###################  effects  ##########################
      // ########################################################
      // when activeTabHasChanged

      effect(() => {
        const activeTab = store.items.activeTab();
        location.go(`${CalculatorPaths.CalculatorOverviewPath}/${activeTab}`);

        store.loadDataForCalculatorTab(activeTab);
      });
      // when tabCounts have changed
      effect(() => {
        store.reloadTabDataWhenCountOfActiveTabHasChanged(
          store.tabCountsOfActiveTabDiffer()
        );
      });
    },
  })
);

const getItemsForActiveTab = (items: Rfq4OverviewItems): RfqRequest[] => {
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
  activeTab: CalculatorTab,
  tabCounts: Rfq4OverviewTabCounts,
  getTabCountsOfDisplayedItems: Rfq4OverviewTabCounts
): CalculatorViewToggle[] => [
  {
    id: 0,
    tab: CalculatorTab.OPEN,
    active: activeTab === CalculatorTab.OPEN,
    title: translate(
      'calculator.rfq4Overview.rfq4OverviewTable.viewToggle.open',
      {
        count:
          tabCounts[CalculatorTab.OPEN] > 0
            ? tabCounts[CalculatorTab.OPEN]
            : getTabCountsOfDisplayedItems[CalculatorTab.OPEN],
      }
    ),
  },
  {
    id: 1,
    tab: CalculatorTab.IN_PROGRESS,
    active: activeTab === CalculatorTab.IN_PROGRESS,
    title: translate(
      'calculator.rfq4Overview.rfq4OverviewTable.viewToggle.inProgress',
      {
        count:
          tabCounts[CalculatorTab.IN_PROGRESS] > 0
            ? tabCounts[CalculatorTab.IN_PROGRESS]
            : getTabCountsOfDisplayedItems[CalculatorTab.IN_PROGRESS],
      }
    ),
  },
  {
    id: 2,
    tab: CalculatorTab.DONE,
    active: activeTab === CalculatorTab.DONE,
    title: translate(
      'calculator.rfq4Overview.rfq4OverviewTable.viewToggle.done',
      {
        count:
          tabCounts[CalculatorTab.DONE] > 0
            ? tabCounts[CalculatorTab.DONE]
            : getTabCountsOfDisplayedItems[CalculatorTab.DONE],
      }
    ),
  },
];
