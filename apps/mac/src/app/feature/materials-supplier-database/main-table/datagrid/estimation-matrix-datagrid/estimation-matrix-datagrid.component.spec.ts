import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { GridApi, IServerSideGetRowsParams } from 'ag-grid-community';
import { MockComponent, MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  EstimationMatrix,
  EstimationMatrixResponse,
  EstimationMatrixResult,
  VitescoMaterial,
} from '@mac/feature/materials-supplier-database/models';
import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
  MsdAgGridStateService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { QuickFilterFacade } from '@mac/feature/materials-supplier-database/store/facades/quickfilter';

import { EstimationMatrixDatagridComponent } from './estimation-matrix-datagrid.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../../util', () => ({
  getStatus: jest.fn(),
}));

describe('RawMaterialDatagridComponent', () => {
  let component: EstimationMatrixDatagridComponent;
  let spectator: Spectator<EstimationMatrixDatagridComponent>;
  const rowDataResult = new Subject();

  const createComponent = createComponentFactory({
    component: EstimationMatrixDatagridComponent,
    imports: [
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(AgGridAngular),
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
          agGridFilter$: of(),
          estimationMatrixResult$: rowDataResult,
          fetchEstimationMatrix: jest.fn(),
          setAgGridFilter: jest.fn(),
          setAgGridColumns: jest.fn(),
        },
      },
      MockProvider(MsdAgGridStateService),
      MockProvider(MsdAgGridReadyService),
      MockProvider(QuickFilterFacade),
      MockProvider(AgGridModule),
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
    it('subscribe to row data response', () => {
      const params = {
        success: jest.fn(),
      } as unknown as IServerSideGetRowsParams<EstimationMatrix>;
      component['params'] = params;
      const data = {
        data: [{ mappingId: '1234' } as EstimationMatrix],
        lastRow: -1,
        totalRows: 55,
        subTotalRows: 45,
      } as EstimationMatrixResponse;

      rowDataResult.next(data);

      expect(component['params']).toBeUndefined();
      expect(params.success).toHaveBeenCalledWith({
        rowData: data.data,
        rowCount: data.subTotalRows,
      } as EstimationMatrixResult);
    });
  });

  describe('onGridReady', () => {
    it('should set params for cell renderer', () => {
      const gridApi = {
        updateGridOptions: jest.fn(),
      } as unknown as GridApi;
      component.onGridReady({ api: gridApi });

      expect(gridApi.updateGridOptions).toHaveBeenCalledWith({
        serverSideDatasource: {
          getRows: expect.any(Function),
          destroy: expect.any(Function),
        },
      });
    });
  });

  describe('getCellRendererParams', () => {
    it('should set params for cell renderer', () => {
      expect(component['getCellRendererParams']()).toStrictEqual({});
    });
  });

  describe('createServerSideDataSource', () => {
    it('should return a serverSide dataSource with functions calling setParams and unsetParams of the service', () => {
      const mockParams = {
        fail: jest.fn(),
        request: {},
      } as unknown as IServerSideGetRowsParams<VitescoMaterial>;

      const datasource = component['createServerSideDataSource']();
      expect(datasource).toBeDefined();

      datasource.getRows(mockParams);
      expect(
        component['dataFacade'].fetchEstimationMatrix
      ).toHaveBeenCalledWith(mockParams.request);
      expect(component['params']).toBeDefined();

      datasource.destroy();
      expect(component['params']).toBeUndefined();
      expect(mockParams.fail).toHaveBeenCalled();
    });
  });
});
