import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IRowModel, IStatusPanelParams } from 'ag-grid-community';

import { EmployeeListStatusBarComponent } from './employee-list-status-bar.component';

describe('EmployeeListStatusBarComponent', () => {
  let component: EmployeeListStatusBarComponent;
  let spectator: Spectator<EmployeeListStatusBarComponent>;

  const createComponent = createComponentFactory({
    component: EmployeeListStatusBarComponent,
    detectChanges: false,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should add rowDataUpdated event listener', () => {
      const params = {
        api: {
          addEventListener(_eventType, _listener) {},
        },
      } as IStatusPanelParams;
      params.api.addEventListener = jest.fn();

      component.agInit(params);

      expect(params.api.addEventListener).toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    test('should set total count', () => {
      const total = 578_123;
      const model = {
        getRowCount() {
          return total;
        },
      } as IRowModel;
      component.params = {
        api: {
          getModel() {
            return model;
          },
        },
      } as IStatusPanelParams;
      component['ref'].markForCheck = jest.fn();

      component.onGridReady();

      expect(component.total).toEqual(total);
      expect(component['ref'].markForCheck).toHaveBeenCalled();
    });
  });
});
