import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { GridApi, IServerSideGetRowsParams } from 'ag-grid-community';
import { MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  SAPMaterial,
  SapMaterialsDatabaseUploadStatus,
} from '@mac/feature/materials-supplier-database/models';
import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
  MsdAgGridStateService,
  MsdDataService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { QuickFilterFacade } from '@mac/feature/materials-supplier-database/store/facades/quickfilter';

import { SapMaterialDatagridComponent } from './sap-material-datagrid.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../../util', () => ({
  getStatus: jest.fn(),
}));

describe('SapMaterialDatagridComponent', () => {
  let component: SapMaterialDatagridComponent;
  let spectator: Spectator<SapMaterialDatagridComponent>;
  const uploadStatusSubject = new Subject();

  const createComponent = createComponentFactory({
    component: SapMaterialDatagridComponent,
    imports: [
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      {
        provide: MsdAgGridConfigService,
        useValue: {
          columnDefinitions$: new Subject(),
        },
      },
      {
        provide: DataFacade,
        useValue: {
          agGridFilter$: new Subject(),
          hasEditorRole$: of(true),
          result$: new Subject(),
          setAgGridFilter: jest.fn(),
          setAgGridColumns: jest.fn(),
        },
      },
      {
        provide: DialogFacade,
        useValue: {
          sapMaterialsDatabaseUploadStatus$: uploadStatusSubject,
        },
      },
      MockProvider(MsdDataService),
      MockProvider(MsdAgGridStateService),
      MockProvider(MsdAgGridReadyService),
      MockProvider(QuickFilterFacade),
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

  describe('onGridReady', () => {
    it('should set params for cell renderer', () => {
      const gridApi = {
        updateGridOptions: jest.fn(),
        addEventListener: jest.fn(),
      } as unknown as GridApi;
      component.onGridReady({ api: gridApi });

      expect(gridApi.updateGridOptions).toHaveBeenCalledWith({
        serverSideDatasource: {
          getRows: expect.any(Function),
          destroy: expect.any(Function),
        },
      });
    });

    it('should react to drag events', () => {
      const nextSpy = jest.spyOn(component.activeDrag, 'set');

      const gridApi = {
        updateGridOptions: jest.fn(),
        addEventListener: jest.fn((_event, callback) => callback()),
        refreshHeader: jest.fn(),
      } as unknown as GridApi;
      component.onGridReady({ api: gridApi });

      expect(gridApi.refreshHeader).toHaveBeenCalledTimes(2);
      expect(nextSpy).toHaveBeenCalledWith(true);
      expect(nextSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('getCellRendererParams', () => {
    it('should set params for cell renderer', () => {
      expect(component['getCellRendererParams']()).toStrictEqual({});
    });
  });

  describe('createServerSideDataSource', () => {
    it('should return a serverSide dataSource with functions calling setParams and unsetParams of the service', () => {
      component['agGridReadyService'].setParams = jest.fn();
      component['agGridReadyService'].unsetParams = jest.fn();
      const mockParams = {} as IServerSideGetRowsParams<SAPMaterial>;

      const datasource = component['createServerSideDataSource']();

      expect(datasource).toBeDefined();

      datasource.getRows(mockParams);

      expect(component['agGridReadyService'].setParams).toHaveBeenCalledWith(
        mockParams
      );

      datasource.destroy();

      expect(component['agGridReadyService'].unsetParams).toHaveBeenCalled();
    });
  });

  describe('reloadDataOnSapMaterialsDatabaseUploadSuccess', () => {
    it('should refresh server side', () => {
      const mockapi = { refreshServerSide: jest.fn() } as unknown as GridApi;
      component['agGridApi'] = mockapi;
      uploadStatusSubject.next(SapMaterialsDatabaseUploadStatus.RUNNING);
      expect(mockapi.refreshServerSide).not.toHaveBeenCalled();
    });
    it('should refresh server side_1', () => {
      const mockapi = { refreshServerSide: jest.fn() } as unknown as GridApi;
      component['agGridApi'] = mockapi;
      uploadStatusSubject.next(SapMaterialsDatabaseUploadStatus.DONE);
      expect(mockapi.refreshServerSide).not.toHaveBeenCalled();
    });
    it('should refresh server side_2', () => {
      const mockapi = { refreshServerSide: jest.fn() } as unknown as GridApi;
      component['agGridApi'] = mockapi;
      uploadStatusSubject.next(SapMaterialsDatabaseUploadStatus.FAILED);
      expect(mockapi.refreshServerSide).not.toHaveBeenCalled();
    });
  });
});
