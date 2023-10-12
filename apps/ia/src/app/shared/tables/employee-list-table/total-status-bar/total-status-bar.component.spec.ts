import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IRowModel, IStatusPanelParams } from 'ag-grid-community';

import { TotalStatusBarComponent } from './total-status-bar.component';

describe('TotalStatusBarComponent', () => {
  let component: TotalStatusBarComponent;
  let spectator: Spectator<TotalStatusBarComponent>;

  const createComponent = createComponentFactory({
    component: TotalStatusBarComponent,
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

  describe('ngOnDestroy', () => {
    test('should remove event listener', () => {
      component.params = {
        api: {
          removeEventListener: jest.fn(),
        },
      } as any;

      component.ngOnDestroy();

      expect(component.params.api.removeEventListener).toHaveBeenCalledWith(
        'rowDataUpdated',
        component.onGridReady
      );
    });
  });
});
