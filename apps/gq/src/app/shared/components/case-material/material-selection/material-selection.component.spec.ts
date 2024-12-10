import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { BehaviorSubject, take } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { SalesIndication } from '@gq/core/store/reducers/models';
import { CustomerId } from '@gq/shared/models';
import { PLsSeriesRequest } from '@gq/shared/services/rest/search/models/pls-series-request.model';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialSelectionComponent } from './material-selection.component';

describe('MaterialSelectionComponent', () => {
  let component: MaterialSelectionComponent;
  let spectator: Spectator<MaterialSelectionComponent>;
  const customerSubject: BehaviorSubject<CustomerId> =
    new BehaviorSubject<CustomerId>({
      customerId: '1235321',
      salesOrg: '0615',
    });

  const createComponent = createComponentFactory({
    component: MaterialSelectionComponent,
    imports: [
      MatCheckboxModule,
      MatSelectModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      mockProvider(CreateCaseFacade, {
        customerIdentifier$: customerSubject.asObservable(),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
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
      component.numberOfYears = 5;
      component.triggerPLsAndSeriesRequest = jest.fn();
      component.resetAll();

      expect(component.allComplete).toBeFalsy();
      expect(component.someComplete).toBeTruthy();
      expect(component.numberOfYears).toEqual(
        component['DEFAULT_SELECTED_YEARS']
      );
      expect(component.selectionItems).toEqual(component.defaultSelection);
      expect(component.triggerPLsAndSeriesRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerPLsAndSeriesRequest', () => {
    test('should dispatch action', () => {
      component.customerIdentifier$.pipe(take(1)).subscribe();
      component['createCaseFacade'].getPLsAndSeries = jest.fn();
      customerSubject.next({
        customerId: '1235321',
        salesOrg: '0615',
      });

      component.selectionItems = [
        { value: true, checked: true },
        { value: SalesIndication.INVOICE, checked: true },
      ] as any;

      component.triggerPLsAndSeriesRequest();
      const customerFilters: PLsSeriesRequest = {
        customer: {
          customerId: component.customerIdentifier.customerId,
          salesOrg: component.customerIdentifier.salesOrg,
        },
        includeQuotationHistory: true,
        salesIndications: [SalesIndication.INVOICE],
        historicalDataLimitInYear: 2,
      };

      expect(
        component['createCaseFacade'].getPLsAndSeries
      ).toHaveBeenCalledWith(customerFilters);
    });
  });

  describe('availableYears', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    test('should return available years for 2022', () => {
      jest.setSystemTime(new Date(2022, 1, 1));
      const result = component['getAvailableYears']();
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    test('should return available years for 2024', () => {
      jest.setSystemTime(new Date(2024, 1, 1));
      const result = component['getAvailableYears']();
      expect(result).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });
  });

  describe('numberOfYears', () => {
    test('should send correct number of years on dispatch', () => {
      component.customerIdentifier$.pipe(take(1)).subscribe();
      component['createCaseFacade'].getPLsAndSeries = jest.fn();
      customerSubject.next({
        customerId: '1235321',
        salesOrg: '0615',
      });

      component.selectionItems = [
        { value: true, checked: true },
        { value: SalesIndication.INVOICE, checked: true },
      ] as any;

      component.numberOfYears = 4;
      const customerFilters: PLsSeriesRequest = {
        customer: {
          customerId: component.customerIdentifier.customerId,
          salesOrg: component.customerIdentifier.salesOrg,
        },
        includeQuotationHistory: true,
        salesIndications: [SalesIndication.INVOICE],
        historicalDataLimitInYear: 4,
      };

      component.triggerPLsAndSeriesRequest();
      expect(
        component['createCaseFacade'].getPLsAndSeries
      ).toHaveBeenCalledWith(customerFilters);
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
      jest.restoreAllMocks();
      component.triggerPLsAndSeriesRequest = jest.fn();
      spectator.detectChanges();

      component.onHistoricalDataLimitChanged({ value: 3 } as any);

      expect(component.triggerPLsAndSeriesRequest).toHaveBeenCalled();
    });
  });
});
