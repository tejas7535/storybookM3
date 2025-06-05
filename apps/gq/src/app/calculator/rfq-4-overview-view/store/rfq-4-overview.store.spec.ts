import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { CalculatorPaths } from '@gq/calculator/routing/calculator-paths.enum';
import { RfqRequest } from '@gq/calculator/service/models/get-rfq-requests-response.interface';
import { Rfq4CalculatorService } from '@gq/calculator/service/rfq-4-calculator.service';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CalculatorTab } from '../models/calculator-tab.enum';
import { Rfq4OverviewStore } from './rfq-4-overview.store';
describe('Rfq4OverviewStore', () => {
  let location: Location;
  const loadCountResult = {
    [CalculatorTab.OPEN]: 4,
    [CalculatorTab.IN_PROGRESS]: 1,
    [CalculatorTab.DONE]: 6,
  };
  const initialCount = {
    [CalculatorTab.OPEN]: 3,
    [CalculatorTab.IN_PROGRESS]: 2,
    [CalculatorTab.DONE]: 3,
  };
  const dataOfOpenTab: RfqRequest[] = [
    { rfqId: 1 } as RfqRequest,
    { rfqId: 2 } as RfqRequest,
    { rfqId: 3 } as RfqRequest,
  ];
  const dataOfInProgressTab: RfqRequest[] = [
    { rfqId: 4 } as RfqRequest,
    { rfqId: 5 } as RfqRequest,
  ];
  const dataOfDoneTab: RfqRequest[] = [
    { rfqId: 6 } as RfqRequest,
    { rfqId: 7 } as RfqRequest,
    { rfqId: 8 } as RfqRequest,
  ];

  const calculatorService = {
    loadRfqRequestsCount: jest.fn(() => of(loadCountResult)),
    getRfqRequests: jest.fn(() => of(dataOfDoneTab)),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Rfq4OverviewStore,
        provideMockStore({
          initialState: {
            router: {
              state: {
                params: {},
              },
            },
          },
        }),
        { provide: Rfq4CalculatorService, useValue: calculatorService },
      ],
    });

    location = TestBed.inject(Location);
  });
  test('should be created', () => {
    const store = TestBed.inject(Rfq4OverviewStore);
    expect(store).toBeTruthy();
  });
  describe('computed', () => {
    const items = {
      activeTab: CalculatorTab.OPEN,
      [CalculatorTab.OPEN]: dataOfOpenTab,
      [CalculatorTab.IN_PROGRESS]: dataOfInProgressTab,
      [CalculatorTab.DONE]: dataOfDoneTab,
    };
    describe('getViewToggles', () => {
      test('should return the correct value for getViewToggles length of displayItems', () => {
        const tabsCount = {
          [CalculatorTab.OPEN]: 0,
          [CalculatorTab.IN_PROGRESS]: 0,
          [CalculatorTab.DONE]: 0,
        };

        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items,
          tabCounts: tabsCount,
        });
        expect(store.getViewToggles()).toEqual([
          {
            id: 0,
            tab: CalculatorTab.OPEN,

            active: true,
            title: 'translate it',
          },
          {
            id: 1,
            tab: CalculatorTab.IN_PROGRESS,

            active: false,
            title: 'translate it',
          },
          {
            id: 2,
            tab: CalculatorTab.DONE,

            active: false,
            title: 'translate it',
          },
        ]);
      });
      test('should return the correct value for getViewToggles', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items,
          tabCounts: initialCount,
        });
        expect(store.getViewToggles()).toEqual([
          {
            id: 0,
            tab: CalculatorTab.OPEN,

            active: true,
            title: 'translate it',
          },
          {
            id: 1,
            tab: CalculatorTab.IN_PROGRESS,

            active: false,
            title: 'translate it',
          },
          {
            id: 2,
            tab: CalculatorTab.DONE,

            active: false,
            title: 'translate it',
          },
        ]);
      });
    });
    describe('getItemsForTab', () => {
      test('should return the correct value for OPEN', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), { items });
        expect(store.getItemsForTab()).toEqual(dataOfOpenTab);
      });
      test('should return the correct value for IN_PROGRESS', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items: { ...items, activeTab: CalculatorTab.IN_PROGRESS },
        });
        expect(store.getItemsForTab()).toEqual(dataOfInProgressTab);
      });
      test('should return the correct value for DONE', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items: { ...items, activeTab: CalculatorTab.DONE },
        });
        expect(store.getItemsForTab()).toEqual(dataOfDoneTab);
      });
    });
    describe('getTabCountsOfDisplayedItems', () => {
      test('should return the count of displayed items for each tab', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), { items });
        expect(store.getTabCountsOfDisplayedItems()).toEqual(initialCount);
      });
    });
    describe('tabCountsOfActiveTabDiffer', () => {
      test('should return true when the counts differ', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items,
          tabCounts: loadCountResult,
        });
        expect(store.tabCountsOfActiveTabDiffer()).toBe(true);
      });
      test('should return false when the counts are equal', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items,
          tabCounts: initialCount,
        });
        expect(store.tabCountsOfActiveTabDiffer()).toBe(false);
      });
    });
  });

  describe('methods', () => {
    test('should process updateActiveTabByViewId', () => {
      const store = TestBed.inject(Rfq4OverviewStore);
      const viewId = 1;
      patchState(unprotected(store), {
        items: {
          activeTab: CalculatorTab.OPEN,
          [CalculatorTab.OPEN]: dataOfOpenTab,
          [CalculatorTab.IN_PROGRESS]: dataOfInProgressTab,
          [CalculatorTab.DONE]: dataOfDoneTab,
        },
        tabCounts: {
          [CalculatorTab.OPEN]: 3,
          [CalculatorTab.IN_PROGRESS]: 2,
          [CalculatorTab.DONE]: 3,
        },
      });
      store.updateActiveTabByViewId(viewId);
      expect(store.items().activeTab).toEqual(CalculatorTab.IN_PROGRESS);
    });
    describe('rxMethods', () => {
      beforeEach(() => {
        jest.restoreAllMocks();
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items: {
            activeTab: CalculatorTab.OPEN,
            [CalculatorTab.OPEN]: dataOfOpenTab,
            [CalculatorTab.IN_PROGRESS]: dataOfInProgressTab,
            [CalculatorTab.DONE]: dataOfDoneTab,
          },
          tabCounts: initialCount,
        });
      });
      describe('loadCountFromInterval', () => {
        test('should call loadCount every 30 seconds', () => {
          jest.useFakeTimers();

          const signalStore = TestBed.inject(Rfq4OverviewStore);
          signalStore.loadCountFromInterval();

          jest.advanceTimersByTime(60_000);
          expect(calculatorService.loadRfqRequestsCount).toHaveBeenCalledTimes(
            2
          );
          expect(signalStore.tabCounts()).toEqual(loadCountResult);
          jest.useRealTimers();
        });
        test('should handle error', () => {
          jest.resetAllMocks();
          jest.useFakeTimers();
          const signalStore = TestBed.inject(Rfq4OverviewStore);
          calculatorService.loadRfqRequestsCount.mockReturnValueOnce(
            throwError(() => 'error')
          );
          signalStore.loadCountFromInterval();
          jest.advanceTimersByTime(30_000);

          expect(calculatorService.loadRfqRequestsCount).toHaveBeenCalledTimes(
            1
          );
          expect(calculatorService.getRfqRequests).toHaveBeenCalledTimes(0);
          expect(signalStore.tabCounts()).toEqual(initialCount);
          jest.useRealTimers();
        });
      });

      describe('loadDataForTab', () => {
        test('should call loadDataForTab and update the store', () => {
          const signalStore = TestBed.inject(Rfq4OverviewStore);
          patchState(unprotected(signalStore), {
            items: {
              activeTab: CalculatorTab.DONE,
              [CalculatorTab.OPEN]: dataOfOpenTab,
              [CalculatorTab.IN_PROGRESS]: dataOfInProgressTab,
              [CalculatorTab.DONE]: dataOfDoneTab,
            },
          });

          const tab = CalculatorTab.DONE;
          calculatorService.getRfqRequests = jest
            .fn()
            .mockReturnValueOnce(of(dataOfDoneTab));
          signalStore.loadDataForCalculatorTab(tab);
          expect(calculatorService.getRfqRequests).toHaveBeenCalled();
          expect(signalStore.items()[tab]).toEqual(dataOfDoneTab);
        });
        test('should handle error', () => {
          const signalStore = TestBed.inject(Rfq4OverviewStore);
          calculatorService.getRfqRequests.mockReturnValueOnce(
            throwError(() => 'error')
          );
          const tab = CalculatorTab.OPEN;
          signalStore.loadDataForCalculatorTab(tab);
          expect(calculatorService.getRfqRequests).toHaveBeenCalled();
        });
      });

      describe('reloadTabDataWhenCountOfActiveTabHasChanged', () => {
        test('should do nothing when both counts are equal', () => {
          jest.resetAllMocks();
          const signalStore = TestBed.inject(Rfq4OverviewStore);
          patchState(unprotected(signalStore), {
            items: {
              activeTab: CalculatorTab.DONE,
              [CalculatorTab.OPEN]: dataOfOpenTab,
              [CalculatorTab.IN_PROGRESS]: dataOfInProgressTab,
              [CalculatorTab.DONE]: dataOfDoneTab,
            },
            tabCounts: initialCount,
          });
          signalStore.reloadTabDataWhenCountOfActiveTabHasChanged(null);
          expect(calculatorService.getRfqRequests).not.toHaveBeenCalled();
        });
        test('should call loadDataForTab when counts are different', () => {
          const signalStore = TestBed.inject(Rfq4OverviewStore);
          patchState(unprotected(signalStore), {
            items: {
              activeTab: CalculatorTab.DONE,
              [CalculatorTab.OPEN]: dataOfOpenTab,
              [CalculatorTab.IN_PROGRESS]: dataOfInProgressTab,
              [CalculatorTab.DONE]: dataOfDoneTab,
            },
            tabCounts: loadCountResult,
          });
          signalStore.reloadTabDataWhenCountOfActiveTabHasChanged(null);
          expect(calculatorService.getRfqRequests).toHaveBeenCalled();
        });
      });
    });

    describe('initialization', () => {
      test('should update location path when activeTab changes', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        const locationSpy = jest.spyOn(location, 'go');
        patchState(unprotected(store), {
          items: { ...store.items(), activeTab: CalculatorTab.DONE },
        });
        calculatorService.loadRfqRequestsCount = jest.fn();
        calculatorService.getRfqRequests = jest.fn();
        TestBed.flushEffects();

        expect(locationSpy).toHaveBeenCalledWith(
          `${CalculatorPaths.CalculatorOverviewPath}/${CalculatorTab.DONE}`
        );
      });
    });
  });
});
