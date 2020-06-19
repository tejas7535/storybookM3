import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ColDef,
  ColumnEvent,
  GetMainMenuItemsParams,
  MenuItemDef,
  SortChangedEvent,
} from '@ag-grid-community/core';
import { configureTestSuite } from 'ng-bullet';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { REFRENCE_TYPE_MOCK } from '../../../testing/mocks/reference-type.mock';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service';
import { SharedModule } from '../../shared/shared.module';
import { ColumnState } from './column-state';
import { COLUMN_DEFINITIONS } from './config';
import { columnDefinitionToReferenceTypeProp } from './config/column-utils';
import { ReferenceTypesTableComponent } from './reference-types-table.component';
import { DetailViewButtonComponent } from './status-bar/detail-view-button/detail-view-button.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ReferenceTypesTableComponent', () => {
  let component: ReferenceTypesTableComponent;
  let fixture: ComponentFixture<ReferenceTypesTableComponent>;

  let stateService: AgGridStateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTranslocoModule,
        SharedModule,
        AgGridModule.withComponents([DetailViewButtonComponent]),
        MatIconModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [ReferenceTypesTableComponent, DetailViewButtonComponent],
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
    fixture = TestBed.createComponent(ReferenceTypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    stateService = TestBed.inject(AgGridStateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getUpdatedDefaultColumnDefinitions', () => {
    it('should only contain columns that are part of provided update', () => {
      const mock = { ...REFRENCE_TYPE_MOCK };
      const update = [mock];

      // delete two props
      delete mock.netSales;
      delete mock.productLine;

      const result = ReferenceTypesTableComponent[
        'getUpdatedDefaultColumnDefinitions'
      ](update);

      let size: any[] = [];

      Object.keys(mock).forEach((key: string) => {
        size = [...size, key];
      });

      const mapDefaultColumnDefinitions = new Map<string, string>();
      Object.keys(COLUMN_DEFINITIONS).forEach((key: string) => {
        mapDefaultColumnDefinitions.set(
          columnDefinitionToReferenceTypeProp(key),
          key
        );
      });

      expect(Object.keys(result).length).toBeGreaterThanOrEqual(size.length);
      size.forEach((elem: string) => {
        if (!result[mapDefaultColumnDefinitions.get(elem)]) {
          expect(Object.keys(COLUMN_DEFINITIONS).includes(elem)).toBeFalsy();
        } else {
          expect(result[mapDefaultColumnDefinitions.get(elem)]).toBeDefined();
        }
      });
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      ReferenceTypesTableComponent[
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
        ReferenceTypesTableComponent['getUpdatedDefaultColumnDefinitions']
      ).toHaveBeenCalled();
    });

    it('should do nothing when change is not rowData', () => {
      const change = { anyThing: new SimpleChange(undefined, [], true) };

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges(change);

      expect(component['setColumnDefinitions']).not.toHaveBeenCalled();
      expect(
        ReferenceTypesTableComponent['getUpdatedDefaultColumnDefinitions']
      ).not.toHaveBeenCalled();
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
        'referenceTypes',
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
        'referenceTypes',
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
});
