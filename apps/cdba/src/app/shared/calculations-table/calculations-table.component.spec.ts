import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import {
  ColDef,
  ColumnEvent,
  ColumnState,
  GridApi,
  IStatusPanelParams,
  RowSelectedEvent,
} from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { configureTestSuite } from 'ng-bullet';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { CALCULATIONS_MOCK } from '../../../testing/mocks';
import { AgGridStateService } from '../services/ag-grid-state.service';
import { SharedModule } from '../shared.module';
import { CustomLoadingOverlayComponent } from '../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomOverlayModule } from '../table/custom-overlay/custom-overlay.module';
import { BomViewButtonComponent } from '../table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CompareViewButtonComponent } from '../table/custom-status-bar/compare-view-button/compare-view-button.component';
import { CustomStatusBarModule } from '../table/custom-status-bar/custom-status-bar.module';
import { CalculationsTableComponent } from './calculations-table.component';
import { ColumnDefinitionService } from './config';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CalculationsTableComponent', () => {
  let component: CalculationsTableComponent;
  let fixture: ComponentFixture<CalculationsTableComponent>;
  let columDefinitionService: ColumnDefinitionService;

  let stateService: AgGridStateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTranslocoModule,
        SharedModule,
        AgGridModule.withComponents([
          BomViewButtonComponent,
          CompareViewButtonComponent,
          CustomLoadingOverlayComponent,
        ]),
        MatCardModule,
        MatIconModule,
        RouterTestingModule,
        provideTranslocoTestingModule({}),
        CustomStatusBarModule,
        CustomOverlayModule,
      ],
      declarations: [CalculationsTableComponent],
      providers: [
        ColumnDefinitionService,

        {
          provide: AgGridStateService,
          useValue: {
            getColumnState: jest.fn(),
            setColumnState: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    stateService = TestBed.inject(AgGridStateService);
    columDefinitionService = TestBed.inject(ColumnDefinitionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getUpdatedDefaultColumnDefinitions', () => {
    it('should only contain columns that are part of provided update', () => {
      const mock = CALCULATIONS_MOCK;

      const result = component['getUpdatedDefaultColumnDefinitions'](mock);

      let size: any[] = [];

      Object.keys(mock[0]).forEach((key: string) => {
        size = [...size, key];
      });

      const mapDefaultColumnDefinitions = new Map<string, string>();
      Object.keys(columDefinitionService.COLUMN_DEFINITIONS).forEach(
        (key: string) => {
          mapDefaultColumnDefinitions.set(key, key);
        }
      );

      expect(Object.keys(result).length).toBeGreaterThanOrEqual(9);
      size.forEach((elem: string) => {
        if (!result[mapDefaultColumnDefinitions.get(elem)]) {
          expect(
            Object.keys(columDefinitionService.COLUMN_DEFINITIONS).includes(
              elem
            )
          ).toBeFalsy();
        } else {
          expect(result[mapDefaultColumnDefinitions.get(elem)]).toBeDefined();
        }
      });
    });
  });

  describe('noRowsOverlayComponentParams', () => {
    it('should return errorMessage on getMessage', () => {
      component.errorMessage = 'test';
      const result = component.noRowsOverlayComponentParams.getMessage();

      expect(result).toEqual(component.errorMessage);
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component['getUpdatedDefaultColumnDefinitions'] = jest.fn(() => ({}));
      component['setColumnDefinitions'] = jest.fn();
    });

    it('should set column definitions when rowData changes', () => {
      const change = { rowData: new SimpleChange(undefined, [], true) };

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges(change);

      expect(stateService.getColumnState).toHaveBeenCalled();
      expect(component['setColumnDefinitions']).toHaveBeenCalled();
      expect(
        component['getUpdatedDefaultColumnDefinitions']
      ).toHaveBeenCalled();
    });

    it('should do nothing when change is not rowData', () => {
      const change = { anyThing: new SimpleChange(undefined, [], true) };

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges(change);

      expect(component['setColumnDefinitions']).not.toHaveBeenCalled();
      expect(
        component['getUpdatedDefaultColumnDefinitions']
      ).not.toHaveBeenCalled();
    });

    it('should showLoadingOverlay when grid loaded and isLoading active', () => {
      component['gridApi'] = ({
        showLoadingOverlay: jest.fn(),
      } as unknown) as GridApi;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        isLoading: ({
          currentValue: true,
        } as unknown) as SimpleChange,
      });

      expect(component['gridApi'].showLoadingOverlay).toHaveBeenCalled();
    });

    it('should do nothing with the overlays when gridApi is not loaded', () => {
      component['gridApi'] = undefined;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        isLoading: ({
          currentValue: true,
        } as unknown) as SimpleChange,
      });

      // should just succeed - otherwise this test should throw an error
    });

    it('should hide loading spinner and show NoRowsOverlay when loading is done', () => {
      component['gridApi'] = ({
        showLoadingOverlay: jest.fn(),
        showNoRowsOverlay: jest.fn(),
      } as unknown) as GridApi;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        isLoading: ({
          currentValue: false,
        } as unknown) as SimpleChange,
      });

      expect(component['gridApi'].showLoadingOverlay).not.toHaveBeenCalled();
      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });
  });

  describe('onRowSelected', () => {
    const event = ({
      node: {
        id: 2,
        isSelected: jest.fn(() => true),
      },
      api: {
        deselectIndex: jest.fn(),
      },
    } as unknown) as RowSelectedEvent;

    it('should fill the selectedRows if the row is selected', () => {
      component.selectedRows = [1];

      component.onRowSelected(event);

      expect(component.selectedRows).toStrictEqual([1, 2]);
      expect(component.selectedRows).toHaveLength(2);
    });

    it('should remove the selectedRows if the row is deselected', () => {
      component.selectionChange.emit = jest.fn();

      component.selectedRows = [1, 2];

      component.onRowSelected(({
        ...event,
        node: {
          ...event.node,
          isSelected: jest.fn(() => false),
        },
      } as unknown) as RowSelectedEvent);

      expect(component.selectedRows).toStrictEqual([1]);
      expect(component.selectedRows).toHaveLength(1);
      expect(component.selectionChange.emit).toHaveBeenCalled();
    });

    it('should remove from selectedRows if there are to many entries', () => {
      component.selectedRows = [1, 3];

      component.onRowSelected(event);

      expect(component.selectedRows).toStrictEqual([3, 2]);
      expect(component.selectedRows).toHaveLength(2);

      expect(event.api.deselectIndex).toHaveBeenCalledWith(1);
    });
  });

  describe('onFirstDataRendered', () => {
    let params: IStatusPanelParams;

    beforeEach(() => {
      component['gridApi'] = ({
        getRowNode: jest.fn(() => ({ setSelected: jest.fn() })),
        dispatchEvent: jest.fn(),
      } as unknown) as GridApi;

      params = ({
        columnApi: {
          getAllColumns: jest.fn(() => []),
          autoSizeColumns: jest.fn(),
        },
      } as unknown) as IStatusPanelParams;
    });

    it('should set node selected if nodeId is set', () => {
      component.selectedNodeId = '7';

      component.onFirstDataRendered(params);

      expect(component['gridApi'].getRowNode).toHaveBeenCalled();
      expect(component['gridApi'].dispatchEvent).toHaveBeenCalled();
      expect(params.columnApi.getAllColumns).toHaveBeenCalled();
      expect(params.columnApi.autoSizeColumns).toHaveBeenCalled();
    });

    it('should do nothing, if nodeId is not present', () => {
      component.selectedNodeId = undefined;

      component.onFirstDataRendered(params);

      expect(component['gridApi'].getRowNode).not.toHaveBeenCalled();
      expect(params.columnApi.getAllColumns).toHaveBeenCalled();
      expect(params.columnApi.autoSizeColumns).toHaveBeenCalled();
    });
  });

  describe('columnChange', () => {
    it('should receive current column state and set it via state service', () => {
      const mockEvent = ({
        columnApi: { getColumnState: jest.fn(() => []) },
      } as unknown) as ColumnEvent;

      component.columnChange(mockEvent);

      expect(mockEvent.columnApi.getColumnState).toHaveBeenCalled();
      expect(stateService.setColumnState).toHaveBeenCalledWith(
        'calculations',
        []
      );
    });
  });

  describe('setColumnDefinitions', () => {
    const defaultDefinitions: { [key: string]: ColDef } = {
      materialNumber: {
        field: 'materialNumber',
        checkboxSelection: true,
      },
      plant: {
        field: 'plant',
      },
    };
    const defaultState: { [key: string]: ColumnState } = {
      materialNumber: {
        colId: 'materialNumber',
        pinned: 'left',
      },
      plant: {
        colId: 'plant',
      },
    };

    let expected: ColDef[];

    it('should merge default definition and default state', () => {
      expected = [
        {
          field: 'materialNumber',
          checkboxSelection: true,
          colId: 'materialNumber',
          pinned: 'left',
        },
        { field: 'plant', colId: 'plant' },
      ];

      component['setColumnDefinitions'](
        defaultDefinitions,
        defaultState,
        undefined
      );

      expect(component.columnDefs).toEqual(expected);
    });

    it('should add column state of the user if present', () => {
      const usersColumnState = [{ colId: 'plant', pinned: 'right' }];
      expected = [
        {
          field: 'materialNumber',
          checkboxSelection: true,
          colId: 'materialNumber',
          pinned: 'left',
        },
        { field: 'plant', colId: 'plant', pinned: 'right' },
      ];

      component['setColumnDefinitions'](
        defaultDefinitions,
        defaultState,
        usersColumnState
      );

      expect(component.columnDefs).toEqual(expected);
    });
  });

  describe('onGridReady', () => {
    it('should set grid api', () => {
      const params = ({
        api: {
          showLoadingOverlay: jest.fn(),
        },
      } as unknown) as IStatusPanelParams;
      component.isLoading = true;

      component.onGridReady(params);

      expect(component['gridApi']).toEqual(params.api);
    });

    it('should hide loading spinner when data is not loading', () => {
      const params = ({
        api: {
          showNoRowsOverlay: jest.fn(),
        },
      } as unknown) as IStatusPanelParams;
      component.isLoading = false;

      component.onGridReady(params);

      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });
  });
  // tslint:disable-next-line: max-file-line-count
});
