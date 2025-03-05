import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ColDef,
  Column,
  GridApi,
  ProcessCellForExportParams,
} from 'ag-grid-community';
import { MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  EMISSION_FACTOR_KG,
  EMISSION_FACTOR_PC,
} from '@mac/feature/materials-supplier-database/constants';
import {
  MsdAgGridReadyService,
  MsdDialogService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import { SapMaterialsUploadDialogComponent } from '../../dialogs/material-input-dialog/materials/sap/sap-materials-upload-dialog.component';
import { SapMaterialsUploadStatusDialogComponent } from '../../dialogs/material-input-dialog/materials/sap/sap-materials-upload-status-dialog/sap-materials-upload-status-dialog.component';
import { SapMaterialControlPanelComponent } from './sap-material-control-panel.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../../util', () => ({
  getStatus: jest.fn(),
}));

describe('SapMaterialControlPanelComponent', () => {
  let component: SapMaterialControlPanelComponent;
  let spectator: Spectator<SapMaterialControlPanelComponent>;

  const gridApiMock = {
    refreshServerSide: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getColumnDef: jest.fn(),
    exportDataAsExcel: jest.fn(),
    setCacheBlockSize: jest.fn(),
  } as unknown as GridApi;

  const createComponent = createComponentFactory({
    component: SapMaterialControlPanelComponent,
    imports: [
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      MockProvider(
        DataFacade,
        {
          agGridFilter$: of(),
          sapMaterialsRows$: of([]),
          hasMatnrUploaderRole$: of(true),
        },
        'useValue'
      ),
      MockProvider(
        MsdAgGridReadyService,
        {
          agGridApi$: of({ gridApi: gridApiMock }),
        },
        'useValue'
      ),
      MockProvider(DatePipe),
      MockProvider(ApplicationInsightsService),
      MockProvider(
        MsdDialogService,
        {
          openSapMaterialsUploadDialog: jest.fn(),
          openSapMaterialsUploadStatusDialog: jest.fn(),
        },
        'useValue'
      ),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set agGridApi and agGridColumnApi', () => {
      expect(component['agGridApi']).toBe(gridApiMock);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the observable', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('reload', () => {
    it('should call refreshServerSide', () => {
      component.reload();
      expect(gridApiMock.refreshServerSide).toHaveBeenCalled();
    });
  });

  describe('openUploadDialog', () => {
    const mockSubjectUpload = new Subject();
    const mockSubjectUploadStatus = new Subject();
    beforeEach(() => {
      component['dialogService'].openSapMaterialsUploadDialog = jest.fn(
        () =>
          ({
            afterClosed: jest.fn(() => mockSubjectUpload),
          }) as unknown as MatDialogRef<SapMaterialsUploadDialogComponent>
      );
      component['dialogService'].openSapMaterialsUploadStatusDialog = jest.fn(
        () =>
          ({
            afterClosed: jest.fn(() => mockSubjectUploadStatus),
          }) as unknown as MatDialogRef<SapMaterialsUploadStatusDialogComponent>
      );
    });
    it('should open SAP materials upload dialog and not open status after close', waitForAsync(() => {
      component.openUploadDialog();
      expect(
        component['dialogService'].openSapMaterialsUploadDialog
      ).toHaveBeenCalledTimes(1);
      mockSubjectUpload.next({ openStatusDialog: false });
      expect(
        component['dialogService'].openSapMaterialsUploadStatusDialog
      ).not.toHaveBeenCalled();
    }));

    it('should open SAP materials upload dialog and open status after cllose', waitForAsync(() => {
      component.openUploadDialog();
      expect(
        component['dialogService'].openSapMaterialsUploadDialog
      ).toHaveBeenCalledTimes(1);
      mockSubjectUpload.next({ openStatusDialog: true });
      expect(
        component['dialogService'].openSapMaterialsUploadStatusDialog
      ).toHaveBeenCalled();
    }));

    it('should open SAP materials upload dialog and open a new upload after cllose', waitForAsync(() => {
      component['openUploadStatusDialog']();
      expect(
        component['dialogService'].openSapMaterialsUploadStatusDialog
      ).toHaveBeenCalledTimes(1);
      mockSubjectUploadStatus.next({ openNewDialog: true });
      expect(
        component['dialogService'].openSapMaterialsUploadDialog
      ).toHaveBeenCalled();
    }));

    it('should open SAP materials upload status dialog and not open a new upload after close', waitForAsync(() => {
      component['openUploadStatusDialog']();
      expect(
        component['dialogService'].openSapMaterialsUploadStatusDialog
      ).toHaveBeenCalledTimes(1);
      mockSubjectUploadStatus.next({ openStatusDialog: false });
      expect(
        component['dialogService'].openSapMaterialsUploadDialog
      ).not.toHaveBeenCalled();
    }));
  });

  describe('exportExcelSapMaterials', () => {
    const toColDef = (s: string | Column): ColDef =>
      ({
        field: s,
        headerName: s,
        headerTooltip: s,
      }) as ColDef;
    it('should register the event Listener', () => {
      const colDefs = [toColDef('a'), toColDef('b'), toColDef('c')];

      component['agGridApi'] = {} as unknown as GridApi;
      component['agGridApi'].updateGridOptions = jest.fn();
      component['agGridApi'].addEventListener = jest.fn((_str, fct) =>
        fct({} as any)
      );
      component['agGridApi'].removeEventListener = jest.fn();
      component['agGridApi'].getColumnDef = jest.fn((s) => toColDef(s));
      component['agGridApi'].getColumnDefs = jest.fn(() => colDefs);
      component['agGridApi'].exportDataAsExcel = jest.fn();
      component['getVisibleColumns'] = jest.fn(() => ['history', 'test']);

      component.exportExcelSapMaterials();

      expect(component['agGridApi'].updateGridOptions).toHaveBeenCalledWith({
        cacheBlockSize: 100,
      });
      expect(component['agGridApi'].addEventListener).toHaveBeenCalledWith(
        expect.stringMatching('modelUpdated'),
        expect.any(Function)
      );
      expect(component['agGridApi'].removeEventListener).toHaveBeenCalled();
      expect(component['agGridApi'].exportDataAsExcel).toHaveBeenCalled();
    });
  });

  describe('excelExportSapProcessCellCallback', () => {
    const p = (
      col: string,
      value: any,
      maturity: number,
      useValueFormatterForExport?: boolean
    ) =>
      ({
        column: {
          getColId: () => col,
          getColDef: () =>
            ({ useValueFormatterForExport }) as unknown as ColDef,
        } as unknown as Column,
        node: {
          data: { maturity },
        },
        value,
        formatValue: () => 'formatted',
      }) as unknown as ProcessCellForExportParams;

    it('should return pcf value (kg) for maturity greater equal 5', () => {
      const mockParams = p(EMISSION_FACTOR_KG, 12.3, 5, false);
      expect(component['getFormattedCellValueNonUploader'](mockParams)).toEqual(
        mockParams.value
      );
      expect(component['getFormattedCellValue'](mockParams)).toEqual(
        mockParams.value
      );
    });
    it('should return pcf value (pc) for maturity greater equal 5', () => {
      const mockParams = p(EMISSION_FACTOR_PC, 12.3, 8, false);
      expect(component['getFormattedCellValueNonUploader'](mockParams)).toEqual(
        mockParams.value
      );
      expect(component['getFormattedCellValue'](mockParams)).toEqual(
        mockParams.value
      );
    });
    it('should return replacement (kg) for maturity less than 5', () => {
      const mockParams = p(EMISSION_FACTOR_KG, 12.3, 3, false);
      expect(component['getFormattedCellValueNonUploader'](mockParams)).toEqual(
        '---'
      );
      expect(component['getFormattedCellValue'](mockParams)).toEqual(
        mockParams.value
      );
    });
    it('should return replacement (pc) for maturity less than 5', () => {
      const mockParams = p(EMISSION_FACTOR_PC, 12.3, 3, false);
      expect(component['getFormattedCellValueNonUploader'](mockParams)).toEqual(
        '---'
      );
      expect(component['getFormattedCellValue'](mockParams)).toEqual(
        mockParams.value
      );
    });
    it('should return param value for other columns', () => {
      const mockParams = p('test', 'testVal', 1, false);
      expect(component['getFormattedCellValueNonUploader'](mockParams)).toEqual(
        mockParams.value
      );
      expect(component['getFormattedCellValue'](mockParams)).toEqual(
        mockParams.value
      );
    });
    it('should return formated value for columns not excluding it', () => {
      const mockParams = p('test', 'testVal', 1, true);
      expect(component['getFormattedCellValueNonUploader'](mockParams)).toEqual(
        'formatted'
      );
      expect(component['getFormattedCellValue'](mockParams)).toEqual(
        'formatted'
      );
    });
    it('should return formated value for columns by default', () => {
      const mockParams = p('test', 'testVal', 1);
      expect(component['getFormattedCellValueNonUploader'](mockParams)).toEqual(
        'formatted'
      );
      expect(component['getFormattedCellValue'](mockParams)).toEqual(
        'formatted'
      );
    });
  });
});
