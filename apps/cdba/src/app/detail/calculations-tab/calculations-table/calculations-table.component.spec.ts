import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ColDef,
  ColumnEvent,
  GetMainMenuItemsParams,
  GridApi,
  IStatusPanelParams,
  MenuItemDef,
  SortChangedEvent,
} from '@ag-grid-community/core';
import { configureTestSuite } from 'ng-bullet';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { CALCULATIONS_TYPE_MOCK } from '../../../../testing/mocks';
import { AgGridStateService } from '../../../shared/services/ag-grid-state.service';
import { SharedModule } from '../../../shared/shared.module';
import { CustomLoadingOverlayComponent } from '../../../shared/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomOverlayModule } from '../../../shared/table/custom-overlay/custom-overlay.module';
import { BomViewButtonComponent } from '../../../shared/table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CustomStatusBarModule } from '../../../shared/table/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../../shared/table/custom-status-bar/detail-view-button/detail-view-button.component';
import { CalculationsTableComponent } from './calculations-table.component';
import { ColumnState } from './column-state';
import { COLUMN_DEFINITIONS } from './config';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CalculationsTableComponent', () => {
  let component: CalculationsTableComponent;
  let fixture: ComponentFixture<CalculationsTableComponent>;

  let stateService: AgGridStateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTranslocoModule,
        SharedModule,
        AgGridModule.withComponents([
          DetailViewButtonComponent,
          BomViewButtonComponent,
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
        {
          provide: AgGridStateService,
          useValue: {
            getColumnState: jest.fn(),
            setColumnState: jest.fn(),
            getSortState: jest.fn(),
            setSortState: jest.fn(),
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getUpdatedDefaultColumnDefinitions', () => {
    it('should only contain columns that are part of provided update', () => {
      const mock = CALCULATIONS_TYPE_MOCK;

      const result = CalculationsTableComponent[
        'getUpdatedDefaultColumnDefinitions'
      ](mock);

      let size: any[] = [];

      Object.keys(mock[0]).forEach((key: string) => {
        size = [...size, key];
      });

      const mapDefaultColumnDefinitions = new Map<string, string>();
      Object.keys(COLUMN_DEFINITIONS).forEach((key: string) => {
        mapDefaultColumnDefinitions.set(key, key);
      });

      expect(Object.keys(result).length).toBeGreaterThanOrEqual(9);
      size.forEach((elem: string) => {
        if (!result[mapDefaultColumnDefinitions.get(elem)]) {
          expect(Object.keys(COLUMN_DEFINITIONS).includes(elem)).toBeFalsy();
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
      CalculationsTableComponent[
        'getUpdatedDefaultColumnDefinitions'
      ] = jest.fn(() => ({}));
      component['setColumnDefinitions'] = jest.fn();
    });

    it('should set column definitions when rowData changes', () => {
      const change = { rowData: new SimpleChange(undefined, [], true) };

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges(change);

      expect(stateService.getColumnState).toHaveBeenCalled();
      expect(stateService.getSortState).toHaveBeenCalled();
      expect(component['setColumnDefinitions']).toHaveBeenCalled();
      expect(
        CalculationsTableComponent['getUpdatedDefaultColumnDefinitions']
      ).toHaveBeenCalled();
    });

    it('should do nothing when change is not rowData', () => {
      const change = { anyThing: new SimpleChange(undefined, [], true) };

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges(change);

      expect(component['setColumnDefinitions']).not.toHaveBeenCalled();
      expect(
        CalculationsTableComponent['getUpdatedDefaultColumnDefinitions']
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
  });

  describe('getMainMenuItems', () => {
    it('should remove default "resetColumns" menuItem', () => {
      let mockParams = ({
        defaultItems: ['foo', 'bar'],
      } as unknown) as GetMainMenuItemsParams;

      let result = component.getMainMenuItems(mockParams);

      expect(result).not.toContain('resetColumns');

      mockParams = ({
        defaultItems: ['foo', 'bar', 'resetColumns'],
      } as unknown) as GetMainMenuItemsParams;

      result = component.getMainMenuItems(mockParams);

      expect(result).not.toContain('resetColumns');
    });

    it('should add custom reset menu item', () => {
      const mockParams = ({
        defaultItems: ['foo', 'bar', 'resetColumns'],
      } as unknown) as GetMainMenuItemsParams;

      const result = component.getMainMenuItems(mockParams);

      const menuItem = result.find(
        (item: string | MenuItemDef) =>
          typeof item !== 'string' && item.name === 'Reset Table'
      );

      expect(menuItem).toBeDefined();
    });

    it('should call api to reset column state and sort state when calling the menu item action', () => {
      const mockParams = ({
        defaultItems: ['foo', 'bar', 'resetColumns'],
        api: {
          setSortModel: jest.fn(),
        },
        columnApi: { setColumnState: jest.fn() },
      } as unknown) as GetMainMenuItemsParams;

      const result = component.getMainMenuItems(mockParams);

      const menuItem: MenuItemDef = result.find(
        (item: string | MenuItemDef) =>
          typeof item !== 'string' && item.name === 'Reset Table'
      ) as MenuItemDef;

      menuItem.action();

      expect(mockParams.api.setSortModel).toHaveBeenCalled();
      expect(mockParams.columnApi.setColumnState).toHaveBeenCalled();
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

  describe('sortChange', () => {
    it('should receive current sort state and set it via state service', () => {
      const mockEvent = ({
        api: { getSortModel: jest.fn(() => []) },
      } as unknown) as SortChangedEvent;

      component.sortChange(mockEvent);

      expect(mockEvent.api.getSortModel).toHaveBeenCalled();
      expect(stateService.setSortState).toHaveBeenCalledWith(
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
        undefined,
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
        usersColumnState,
        undefined
      );

      expect(component.columnDefs).toEqual(expected);
    });

    it('should add sort state of user if present', () => {
      const usersSortState = [{ colId: 'plant', sort: 'asc' }];

      expected = [
        {
          field: 'materialNumber',
          checkboxSelection: true,
          colId: 'materialNumber',
          pinned: 'left',
        },
        { field: 'plant', colId: 'plant', sort: 'asc' },
      ];

      component['setColumnDefinitions'](
        defaultDefinitions,
        defaultState,
        undefined,
        usersSortState
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

      component.onGridReady(params);

      expect(component['gridApi']).toEqual(params.api);
    });
  });
});
