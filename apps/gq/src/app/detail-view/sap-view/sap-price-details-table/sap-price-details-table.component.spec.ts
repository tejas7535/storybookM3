import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import { MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ColumnHeadersModule } from '../../../shared/ag-grid/column-headers/column-headers.module';
import { HelperService } from '../../../shared/services/helper-service/helper-service.service';
import { SapPriceDetailsTableComponent } from './sap-price-details-table.component';

describe('SapConditionsTableComponent', () => {
  let component: SapPriceDetailsTableComponent;
  let spectator: Spectator<SapPriceDetailsTableComponent>;

  const createComponent = createComponentFactory({
    component: SapPriceDetailsTableComponent,
    imports: [
      AgGridModule,
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
      ColumnHeadersModule,
    ],
    providers: [
      { provide: HelperService, useValue: {} },
      MockProvider(TranslocoLocaleService),
      MockProvider(ApplicationInsightsService),
      provideMockStore({}),
    ],
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
        columnApi: {
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
        columnApi: {
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
      expect(event.columnApi.applyColumnState).toHaveBeenCalledTimes(1);
    });
    test('should not set columnState', () => {
      const event = {
        columnApi: {
          applyColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].getColumnStateForCurrentView = jest.fn();
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
      expect(event.columnApi.applyColumnState).toHaveBeenCalledTimes(0);
    });
  });
});
