import { AgGridModule } from '@ag-grid-community/angular';
import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HelperService } from '../../../shared/services/helper-service/helper-service.service';
import { SapPriceDetailsTableComponent } from './sap-price-details-table.component';

describe('SapConditionsTableComponent', () => {
  let component: SapPriceDetailsTableComponent;
  let spectator: Spectator<SapPriceDetailsTableComponent>;

  const createComponent = createComponentFactory({
    component: SapPriceDetailsTableComponent,
    imports: [
      AgGridModule.withComponents({}),
      provideTranslocoTestingModule({}),
      PushModule,
    ],
    providers: [{ provide: HelperService, useValue: {} }],
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
      component['agGridStateService'].setColumnState = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledTimes(1);
    });
  });
  describe('onGridReady', () => {
    test('should set columnState', () => {
      const event = {
        columnApi: {
          setColumnState: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnState = jest
        .fn()
        .mockReturnValue('state');
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(event.columnApi.setColumnState).toHaveBeenCalledTimes(1);
    });
    test('should not set columnState', () => {
      const event = {
        columnApi: {
          setColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].getColumnState = jest.fn();
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(event.columnApi.setColumnState).toHaveBeenCalledTimes(0);
    });
  });
});
