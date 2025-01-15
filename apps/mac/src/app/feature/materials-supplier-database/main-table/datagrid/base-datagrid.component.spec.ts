import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { ColumnState, GridApi, RowClassParams } from 'ag-grid-community';
import { MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
  MsdAgGridStateService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { QuickFilterFacade } from '@mac/feature/materials-supplier-database/store/facades/quickfilter';

import { ACTION, Status } from '../../constants';
import { getStatus } from '../util';
import { BaseDatagridComponent } from './base-datagrid.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../util', () => ({
  getStatus: jest.fn(),
}));

// create a minimum class to test the abstract methods
@Component({
  selector: 'mac-xyz',
  standalone: true,
  template: '<p>test</p>',
})
class MockMaterialDatagridComponent
  extends BaseDatagridComponent
  implements OnInit, OnDestroy
{
  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridStateService: MsdAgGridStateService,
    protected readonly agGridReadyService: MsdAgGridReadyService,
    protected readonly agGridConfigService: MsdAgGridConfigService,
    protected readonly quickFilterFacade: QuickFilterFacade
  ) {
    super(
      dataFacade,
      agGridStateService,
      agGridReadyService,
      agGridConfigService,
      quickFilterFacade
    );
  }

  protected getCellRendererParams() {
    return {};
  }
}

describe('MockMaterialDatagridComponent', () => {
  let component: MockMaterialDatagridComponent;
  let spectator: Spectator<MockMaterialDatagridComponent>;

  const createComponent = createComponentFactory({
    component: MockMaterialDatagridComponent,
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
          setAgGridFilter: jest.fn(),
          setAgGridColumns: jest.fn(),
        },
      },
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

  describe('ngOnInit', () => {
    const colState = (str?: string) =>
      ({ colId: str }) as unknown as ColumnState;
    it('should set filter model for non-empty values', () => {
      component['agGridApi'] = {
        setFilterModel: jest.fn(),
      } as unknown as GridApi;

      const data = { 'some filter': 'some value' };
      (component['dataFacade'].agGridFilter$ as Subject<any>).next({
        filterModel: data,
      });

      expect(component['agGridApi'].setFilterModel).toHaveBeenCalledWith({
        filterModel: data,
      });
    });

    it('should ignore filter model for empty values', () => {
      component['agGridApi'] = {
        setFilterModel: jest.fn(),
      } as unknown as GridApi;
      const x: any = undefined;
      (component['dataFacade'].agGridFilter$ as Subject<any>).next(x);

      expect(component['agGridApi'].setFilterModel).not.toHaveBeenCalled();
    });

    it('should subscribe to the columnDefinitions', () => {
      component['getColumnDefs'] = jest.fn();
      component['agGridApi'] = {
        applyColumnState: jest.fn(),
      } as unknown as GridApi;

      jest.useFakeTimers();

      component['agGridConfigService'].columnDefinitions$.next({
        defaultColumnDefinitions: [
          { colId: 'locked', field: 'locked', lockVisible: true },
        ],
        savedColumnState: [colState('locked'), colState('plain')],
      });

      jest.advanceTimersByTime(1000);

      expect(component['getColumnDefs']).toHaveBeenCalled();
      expect(component['agGridApi'].applyColumnState).toHaveBeenCalledWith({
        state: [{ colId: 'locked', hide: false }, { colId: 'plain' }],
        applyOrder: true,
      });

      jest.useRealTimers();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the observable', () => {
      component.destroy$.next = jest.fn();
      component.destroy$.complete = jest.fn();

      component.ngOnDestroy();

      expect(component.destroy$.next).toHaveBeenCalled();
      expect(component.destroy$.complete).toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    const mockApi = {
      applyColumnState: jest.fn(),
    } as unknown as GridApi;
    beforeEach(() => {
      component['agGridApi'] = undefined;
      component['agGridReadyService'].agGridApiready = jest.fn();
    });
    it('should dispatch agGridReadyEvent', () => {
      component['restoredColumnState'] = undefined;
      component.onGridReady({
        api: mockApi,
      });

      expect(component['agGridApi']).toEqual(mockApi);
      expect(
        component['agGridReadyService'].agGridApiready
      ).toHaveBeenCalledWith(mockApi);
      expect(mockApi.applyColumnState).not.toHaveBeenCalled();
    });
    it('should dispatch agGridReadyEvent and apply columnState', () => {
      component['restoredColumnState'] = [{ a: '1' } as unknown as ColumnState];
      component.onGridReady({
        api: mockApi,
      });

      expect(component['agGridApi']).toEqual(mockApi);
      expect(
        component['agGridReadyService'].agGridApiready
      ).toHaveBeenCalledWith(mockApi);
      expect(mockApi.applyColumnState).toHaveBeenCalled();
    });
  });

  describe('onColumnChange', () => {
    it('should set the column state', () => {
      const expected = [{ id: 'sth' } as unknown as ColumnState];
      const mockApi = {
        getColumnState: jest.fn((): ColumnState[] => [
          ...expected,
          { colId: ACTION } as unknown as ColumnState,
        ]),
      };
      component['agGridStateService'].setColumnState = jest.fn();

      component.onColumnChange({
        gridApi: mockApi as unknown as GridApi,
      });

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledWith(expected);
      expect(component['dataFacade'].setAgGridColumns).toHaveBeenCalledWith(
        JSON.stringify(expected)
      );
    });
  });

  describe('onFilterChange', () => {
    it('should dispatch agGridFilter with defined filter', () => {
      const mockFilterModel = { 'some filter': 'some value' };
      const mockApi = {
        getFilterModel: jest.fn(() => mockFilterModel),
      };

      component.onFilterChange({ api: mockApi as unknown as GridApi });

      expect(mockApi.getFilterModel).toHaveBeenCalled();
      expect(component['dataFacade'].setAgGridFilter).toBeCalledWith(
        mockFilterModel
      );
    });
  });

  describe('on status check', () => {
    const v = {
      data: { blocked: true, lastModified: 1 },
    } as unknown as RowClassParams;
    it('is blocked row should return true if the status is blocked', () => {
      (getStatus as jest.Mock).mockReturnValue(Status.BLOCKED);

      expect(component.isBlockedRow(v)).toBe(true);
      expect(getStatus).toHaveBeenCalled();
    });
    it('is blocked row should return false if the status is not blocked', () => {
      (getStatus as jest.Mock).mockReturnValue(Status.DEFAULT);

      expect(component.isBlockedRow(v)).toBe(false);
      expect(getStatus).toHaveBeenCalled();
    });
    it('isRecentlyChangedRow should return true if the status is changed', () => {
      (getStatus as jest.Mock).mockReturnValue(Status.CHANGED);

      expect(component.isRecentlyChangedRow(v)).toBe(true);
      expect(getStatus).toHaveBeenCalled();
    });
    it('isRecentlyChangedRow should return false if the status is not changed', () => {
      (getStatus as jest.Mock).mockReturnValue(Status.DEFAULT);

      expect(component.isRecentlyChangedRow(v)).toBe(false);
      expect(getStatus).toHaveBeenCalled();
    });
  });

  describe('getColumnDefs', () => {
    it('should return translated column defs', () => {
      component['getCellRendererParams'] = jest.fn(() => ({ x: 1 }));
      component.defaultColumnDefs = [{ headerName: '1' }, { headerName: '2' }];
      const expected = [
        {
          headerName: 'materialsSupplierDatabase.mainTable.columns.1',
          cellRendererParams: { x: 1 },
        },
        {
          headerName: 'materialsSupplierDatabase.mainTable.columns.2',
          cellRendererParams: { x: 1 },
        },
      ];

      expect(component['getColumnDefs']()).toEqual(expected);
    });
    it('should return empty array for null value', () => {
      component.defaultColumnDefs = undefined;

      expect(component['getColumnDefs']()).toEqual([]);
    });
  });
});
