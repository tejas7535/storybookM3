import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import {
  ColDef,
  ColumnEvent,
  ColumnState,
  IStatusPanelParams,
  RowSelectedEvent,
} from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { configureTestSuite } from 'ng-bullet';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { REFERENCE_TYPE_MOCK } from '../../../testing/mocks';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service';
import { SharedModule } from '../../shared/shared.module';
import { columnDefinitionToReferenceTypeProp } from '../../shared/table';
import { BomViewButtonComponent } from '../../shared/table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CompareViewButtonComponent } from '../../shared/table/custom-status-bar/compare-view-button/compare-view-button.component';
import { CustomStatusBarModule } from '../../shared/table/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../shared/table/custom-status-bar/detail-view-button/detail-view-button.component';
import { ColumnDefinitionService } from './config';
import { ReferenceTypesTableComponent } from './reference-types-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ReferenceTypesTableComponent', () => {
  let component: ReferenceTypesTableComponent;
  let fixture: ComponentFixture<ReferenceTypesTableComponent>;
  let columDefinitionService: ColumnDefinitionService;

  let stateService: AgGridStateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTranslocoModule,
        SharedModule,
        AgGridModule.withComponents([
          DetailViewButtonComponent,
          BomViewButtonComponent,
          CompareViewButtonComponent,
        ]),
        MatIconModule,
        RouterTestingModule,
        provideTranslocoTestingModule({}),
        CustomStatusBarModule,
      ],
      declarations: [ReferenceTypesTableComponent],
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
    fixture = TestBed.createComponent(ReferenceTypesTableComponent);
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
      const mock = { ...REFERENCE_TYPE_MOCK };
      const update = [mock];

      // delete two props
      delete mock.netSales;
      delete mock.productLine;

      const result = component['getUpdatedDefaultColumnDefinitions'](update);

      let size: any[] = [];

      Object.keys(mock).forEach((key: string) => {
        size = [...size, key];
      });

      const mapDefaultColumnDefinitions = new Map<string, string>();
      Object.keys(columDefinitionService.COLUMN_DEFINITIONS).forEach(
        (key: string) => {
          mapDefaultColumnDefinitions.set(
            columnDefinitionToReferenceTypeProp(key),
            key
          );
        }
      );

      expect(Object.keys(result).length).toBeGreaterThanOrEqual(size.length);
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
      expect(Object.keys(result).includes('checkbox')).toBeTruthy();
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

  describe('onFirstDataRendered', () => {
    it('should call autoSizeAllColumns', () => {
      const params = ({
        columnApi: {
          autoSizeAllColumns: jest.fn(),
          setColumnVisible: jest.fn(),
        },
      } as unknown) as IStatusPanelParams;

      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeAllColumns).toHaveBeenCalledWith(false);
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
    });

    it('should remove from selectedRows if there are to many entries', () => {
      component.selectedRows = [1, 3];

      component.onRowSelected(event);

      expect(component.selectedRows).toStrictEqual([3, 2]);
      expect(component.selectedRows).toHaveLength(2);

      expect(event.api.deselectIndex).toHaveBeenCalledWith(1);
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
});
