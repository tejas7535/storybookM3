import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IStatusPanelParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ExcelExportStatusBarComponent } from './excel-export-status-bar.component';

describe('ExcelExportStatusBarComponent', () => {
  let component: ExcelExportStatusBarComponent;
  let spectator: Spectator<ExcelExportStatusBarComponent>;

  const createComponent = createComponentFactory({
    component: ExcelExportStatusBarComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.api = {
      removeEventListener(_eventType: any, _listener: any) {},
    } as any;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should add rowDataUpdated event listener', () => {
      const params = {
        api: {
          addEventListener(_eventType, _listener) {},
          removeEventListener(_eventType: any, _listener: any) {},
        },
      } as IStatusPanelParams;
      params.api.addEventListener = jest.fn();

      component.agInit(params);

      expect(params.api.addEventListener).toHaveBeenCalled();
    });
  });

  describe('exportToExcel', () => {
    test('should export data to excel', () => {
      component.api = {
        exportDataAsExcel: jest.fn(),
        removeEventListener(_eventType: any, _listener: any) {},
      } as any;

      component.exportToExcel();

      expect(component.api.exportDataAsExcel).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    test('should remove event listener', () => {
      component.api = {
        removeEventListener: jest.fn(),
      } as any;

      component.ngOnDestroy();

      expect(component.api.removeEventListener).toHaveBeenCalledWith(
        'rowDataUpdated',
        component.onGridReady
      );
    });
  });
});
