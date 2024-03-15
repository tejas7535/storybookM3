import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-community';
import { MockDirective } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TotalRowCountComponent } from './total-row-count.component';

describe('TotalRowCountComponent', () => {
  let component: TotalRowCountComponent;
  let spectator: Spectator<TotalRowCountComponent>;
  let params: IStatusPanelParams;
  const expectedRowCount = 1;

  const createComponent = createComponentFactory({
    component: TotalRowCountComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockDirective(LetDirective),
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = {
      api: {
        addEventListener: jest.fn(),
        getDisplayedRowCount: jest.fn(() => expectedRowCount),
        getSelectedRows: jest.fn(() => [1]),
      },
    } as any as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and add event listener', () => {
      component.agInit(params);

      expect(component['params']).toEqual(params);
      expect(component['params'].api.addEventListener).toHaveBeenCalledTimes(2);
      expect(component.simulationModeEnabled$).toBeDefined();
    });
  });

  describe('onGridReady', () => {
    test('should set totalRows', () => {
      component['params'] = params;
      component.onGridReady();

      expect(
        component['params'].api.getDisplayedRowCount
      ).toHaveBeenCalledTimes(1);
      expect(component.totalRowCount).toEqual(expectedRowCount);
    });
  });
  describe('onSelectionChange', () => {
    test('should set selectedRowCount', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(component['params'].api.getSelectedRows).toHaveBeenCalledTimes(1);
      expect(component.selectedRowCount).toEqual(expectedRowCount);
    });
  });
});
