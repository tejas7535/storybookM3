import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { getPLsAndSeries } from '../../../../core/store';
import { SalesIndication } from '../../../../core/store/reducers/transactions/models/sales-indication.enum';
import { PLsSeriesRequest } from '../../../../shared/services/rest-services/search-service/models/pls-series-request.model';
import { MaterialSelectionComponent } from './material-selection.component';

describe('MaterialSelectionComponent', () => {
  let component: MaterialSelectionComponent;
  let spectator: Spectator<MaterialSelectionComponent>;
  let mockStore: MockStore;
  const createComponent = createComponentFactory({
    component: MaterialSelectionComponent,
    imports: [
      MatCheckboxModule,
      MatSelectModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createCopy', () => {
    test('should create copy', () => {
      const result = component.createDefaultSelectionCopy();
      expect(result).toEqual(component.defaultSelection);
    });
  });
  describe('updateSelection', () => {
    test('should update selection', () => {
      component.selectionItems = [
        { id: 1, checked: false },
        { id: 2, checked: false },
      ] as any;

      component.updateSelection({ checked: true } as any, 1);

      expect(component.allComplete).toBeFalsy();
      expect(component.someComplete).toBeTruthy();
    });
  });

  describe('selectAll', () => {
    test('should select all', () => {
      component.selectionItems = [
        { id: 1, checked: false },
        { id: 2, checked: false },
      ] as any;

      component.selectAll({ checked: true } as any);

      expect(
        component.selectionItems.every((item) => item.checked)
      ).toBeTruthy();
    });
  });

  describe('resetAll', () => {
    test('should resetAll', () => {
      component.resetAll();

      expect(component.allComplete).toBeFalsy();
      expect(component.someComplete).toBeTruthy();
      expect(component.selectionItems).toEqual(component.defaultSelection);
    });
  });

  describe('triggerPLsAndSeriesRequest', () => {
    test('should dispatch action', () => {
      component.customerId = '1235321';
      component.salesOrg = '0615';
      mockStore.dispatch = jest.fn();
      component.selectionItems = [
        { value: true, checked: true },
        { value: SalesIndication.INVOICE, checked: true },
      ] as any;

      component.triggerPLsAndSeriesRequest();
      const customerFilters: PLsSeriesRequest = {
        customer: {
          customerId: component.customerId,
          salesOrg: component.salesOrg,
        },
        includeQuotationHistory: true,
        salesIndications: [SalesIndication.INVOICE],
        historicalDataLimitInYear: 2,
      };

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getPLsAndSeries({ customerFilters })
      );
    });
  });

  describe('availableYears', () => {
    test('should return available years for 2022', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2022, 1, 1));
      spectator.detectChanges();

      expect(component.availableYears).toEqual([0, 1, 2, 3, 4]);
      jest.useRealTimers();
    });

    test('should return available years for 2024', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 1, 1));
      spectator.detectChanges();

      expect(component.availableYears).toEqual([0, 1, 2, 3, 4, 5, 6]);
      jest.useRealTimers();
    });
  });

  describe('numberOfYears', () => {
    test('should send correct number of years on dispatch', () => {
      mockStore.dispatch = jest.fn();
      component.customerId = '1235321';
      component.salesOrg = '0615';
      mockStore.dispatch = jest.fn();
      component.selectionItems = [
        { value: true, checked: true },
        { value: SalesIndication.INVOICE, checked: true },
      ] as any;

      component.numberOfYears = 4;
      const customerFilters: PLsSeriesRequest = {
        customer: {
          customerId: component.customerId,
          salesOrg: component.salesOrg,
        },
        includeQuotationHistory: true,
        salesIndications: [SalesIndication.INVOICE],
        historicalDataLimitInYear: 4,
      };

      component.triggerPLsAndSeriesRequest();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getPLsAndSeries({ customerFilters })
      );
    });
  });

  describe('onHistoricalDataLimitChanged', () => {
    test('should update numberOfYears', () => {
      spectator.detectChanges();
      expect(component.numberOfYears).toEqual(2);

      component.onHistoricalDataLimitChanged({ value: 3 } as any);
      expect(component.numberOfYears).toEqual(3);
    });

    test('should call triggerPLsAndSeriesRequest', () => {
      component.triggerPLsAndSeriesRequest = jest.fn();
      spectator.detectChanges();

      component.onHistoricalDataLimitChanged({ value: 3 } as any);

      expect(component.triggerPLsAndSeriesRequest).toHaveBeenCalledTimes(1);
    });
  });
});
