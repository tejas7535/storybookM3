import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

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
    imports: [MatCheckboxModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
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
      };

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        getPLsAndSeries({ customerFilters })
      );
    });
  });
});
