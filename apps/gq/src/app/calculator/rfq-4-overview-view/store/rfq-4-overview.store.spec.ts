import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { Rfq4CalculatorService } from '@gq/calculator/service/rfq-4-calculator.service';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CalculatorTab } from '../models/calculator-tab.enum';
import { Rfq4OverviewStore } from './rfq-4-overview.store';

describe('Rfq4OverviewStore', () => {
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

  const calculatorService = {
    loadCount: jest.fn(() => of(loadCountResult)),
    loadDataForTab: jest.fn(() => of(['some', 'values'])),
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
  });
  test('should be created', () => {
    const store = TestBed.inject(Rfq4OverviewStore);
    expect(store).toBeTruthy();
  });
  describe('computed', () => {
    const items = {
      activeTab: CalculatorTab.OPEN,
      [CalculatorTab.OPEN]: ['I', 'Have', 'Some'],
      [CalculatorTab.IN_PROGRESS]: ['Me', 'Too'],
      [CalculatorTab.DONE]: ['I', 'Am', 'Done'],
    };
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
    describe('getItemsForTab', () => {
      test('should return the correct value for OPEN', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), { items });
        expect(store.getItemsForTab()).toEqual(['I', 'Have', 'Some']);
      });
      test('should return the correct value for IN_PROGRESS', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items: { ...items, activeTab: CalculatorTab.IN_PROGRESS },
        });
        expect(store.getItemsForTab()).toEqual(['Me', 'Too']);
      });
      test('should return the correct value for DONE', () => {
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items: { ...items, activeTab: CalculatorTab.DONE },
        });
        expect(store.getItemsForTab()).toEqual(['I', 'Am', 'Done']);
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
          [CalculatorTab.OPEN]: ['I', 'Have', 'Some'],
          [CalculatorTab.IN_PROGRESS]: ['Me', 'Too'],
          [CalculatorTab.DONE]: ['I', 'Am', 'Done'],
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
    test('should process updateActiveTab', () => {
      const store = TestBed.inject(Rfq4OverviewStore);
      const activeTab = CalculatorTab.IN_PROGRESS;
      patchState(unprotected(store), {
        items: {
          activeTab: CalculatorTab.OPEN,
          [CalculatorTab.OPEN]: ['I', 'Have', 'Some'],
          [CalculatorTab.IN_PROGRESS]: ['Me', 'Too'],
          [CalculatorTab.DONE]: ['I', 'Am', 'Done'],
        },
      });
      store.updateActiveTab(activeTab);
      expect(store.items().activeTab).toEqual(CalculatorTab.IN_PROGRESS);
    });
    describe('rxMethods', () => {
      beforeEach(() => {
        jest.restoreAllMocks();
        const store = TestBed.inject(Rfq4OverviewStore);
        patchState(unprotected(store), {
          items: {
            activeTab: CalculatorTab.OPEN,
            [CalculatorTab.OPEN]: ['I', 'Have', 'Some'],
            [CalculatorTab.IN_PROGRESS]: ['Me', 'Too'],
            [CalculatorTab.DONE]: ['I', 'Am', 'Done'],
          },
          tabCounts: initialCount,
        });
      });
      describe('loadCountFromInterval', () => {
        test('should call loadCount every five seconds', () => {
          jest.useFakeTimers();

          const signalStore = TestBed.inject(Rfq4OverviewStore);

          signalStore.loadCountFromInterval();

          jest.advanceTimersByTime(10_000);
          expect(calculatorService.loadCount).toHaveBeenCalledTimes(2);
          expect(calculatorService.loadDataForTab).toHaveBeenCalledTimes(2);
          expect(signalStore.tabCounts()).toEqual(loadCountResult);
          jest.useRealTimers();
        });
        test('should handle error', () => {
          jest.resetAllMocks();
          jest.useFakeTimers();
          const signalStore = TestBed.inject(Rfq4OverviewStore);
          calculatorService.loadCount.mockReturnValueOnce(
            throwError(() => 'error')
          );
          signalStore.loadCountFromInterval();
          jest.advanceTimersByTime(5000);

          expect(calculatorService.loadCount).toHaveBeenCalledTimes(1);
          expect(calculatorService.loadDataForTab).toHaveBeenCalledTimes(0);
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
              [CalculatorTab.OPEN]: ['I', 'Have', 'Some'],
              [CalculatorTab.IN_PROGRESS]: ['Me', 'Too'],
              [CalculatorTab.DONE]: ['I', 'Am', 'Done'],
            },
          });

          const tab = CalculatorTab.DONE;
          calculatorService.loadDataForTab = jest
            .fn()
            .mockReturnValueOnce(of(['some', 'values']));
          signalStore.loadDataForTab(tab);
          expect(calculatorService.loadDataForTab).toHaveBeenCalled();
          expect(signalStore.items()[tab]).toEqual(['some', 'values']);
        });
        test('should handle error', () => {
          const signalStore = TestBed.inject(Rfq4OverviewStore);
          calculatorService.loadDataForTab.mockReturnValueOnce(
            throwError(() => 'error')
          );
          const tab = CalculatorTab.OPEN;
          signalStore.loadDataForTab(tab);
          expect(calculatorService.loadDataForTab).toHaveBeenCalled();
        });
      });
    });
  });
});
