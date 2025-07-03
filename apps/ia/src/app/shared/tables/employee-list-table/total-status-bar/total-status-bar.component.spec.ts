import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IStatusPanelParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TotalStatusBarComponent } from './total-status-bar.component';

describe('TotalStatusBarComponent', () => {
  let component: TotalStatusBarComponent;
  let spectator: Spectator<TotalStatusBarComponent>;

  const createComponent = createComponentFactory({
    component: TotalStatusBarComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.params = {
      api: { removeEventListener(_eventType: any, _listener: any) {} },
    } as any;
  });

  test('should create', () => {
    component.params = {
      api: { removeEventListener(_eventType: any, _listener: any) {} },
    } as any;
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should add rowDataUpdated event listener', () => {
      const params = {
        api: {
          addEventListener(_eventType, _listener) {},
          removeEventListener(_eventType, _listener) {},
        },
      } as IStatusPanelParams;
      params.api.addEventListener = jest.fn();

      component.agInit(params);

      expect(params.api.addEventListener).toHaveBeenCalled();
    });
  });

  describe('onRowDataUpdated', () => {
    test('should set total count', () => {
      const total = 578_123;
      component.params = {
        api: {
          getDisplayedRowCount: () => total,
          removeEventListener(_eventType, _listener) {},
        },
      } as IStatusPanelParams;
      component['ref'].markForCheck = jest.fn();

      component.onRowDataUpdated();

      expect(component.total).toEqual(total);
      expect(component['ref'].markForCheck).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    test('should remove event listeners', () => {
      component.params = {
        api: {
          removeEventListener: jest.fn(),
        },
      } as any;

      component.ngOnDestroy();

      expect(component.params.api.removeEventListener).toHaveBeenCalledWith(
        'rowDataUpdated',
        component.onRowDataUpdated
      );
      expect(component.params.api.removeEventListener).toHaveBeenCalledWith(
        'filterChanged',
        component.onFilterChanged
      );
    });
  });

  describe('onFilterChanged', () => {
    test('should set filtered count when filter is applied', () => {
      const filtered = 578_123;
      component.params = {
        api: {
          getDisplayedRowCount: () => filtered,
          isAnyFilterPresent: () => true,
        },
      } as IStatusPanelParams;
      component['ref'].markForCheck = jest.fn();

      component.onFilterChanged();

      expect(component.filtered).toEqual(filtered);
      expect(component.isAnyFilterPresent).toBeTruthy();
      expect(component['ref'].markForCheck).toHaveBeenCalled();
    });

    test('should set filtered count as undefined when filter is not applied', () => {
      component.params = {
        api: {
          getDisplayedRowCount: () => 31,
          isAnyFilterPresent: () => false,
        },
      } as IStatusPanelParams;
      component['ref'].markForCheck = jest.fn();

      component.onFilterChanged();

      expect(component.filtered).toBeUndefined();
      expect(component.isAnyFilterPresent).toBeFalsy();
      expect(component['ref'].markForCheck).toHaveBeenCalled();
    });
  });
});
