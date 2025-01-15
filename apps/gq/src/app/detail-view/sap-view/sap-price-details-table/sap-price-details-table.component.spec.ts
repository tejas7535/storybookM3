import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LocalizationService } from '@gq/shared/ag-grid/services';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SapPriceDetailsColumnDefService } from './config';
import { SapPriceDetailsTableComponent } from './sap-price-details-table.component';

describe('SapConditionsTableComponent', () => {
  let component: SapPriceDetailsTableComponent;
  let spectator: Spectator<SapPriceDetailsTableComponent>;

  const createComponent = createComponentFactory({
    component: SapPriceDetailsTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      MockProvider(LocalizationService),
      MockProvider(SapPriceDetailsColumnDefService),
      MockProvider(AgGridStateService),
      provideMockStore({}),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onColumnChange', () => {
    test('should set column state', () => {
      const event = {
        api: {
          getColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].setColumnStateForCurrentView = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
    });
  });
  describe('onGridReady', () => {
    test('should set columnState', () => {
      const event = {
        api: {
          applyColumnState: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnStateForCurrentView = jest
        .fn()
        .mockReturnValue('state');
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
      expect(event.api.applyColumnState).toHaveBeenCalledTimes(1);
    });
    test('should not set columnState', () => {
      const event = {
        api: {
          applyColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].getColumnStateForCurrentView = jest.fn();
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
      expect(event.api.applyColumnState).toHaveBeenCalledTimes(0);
    });
  });
});
