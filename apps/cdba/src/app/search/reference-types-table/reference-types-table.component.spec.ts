import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import {
  ColDef,
  ColumnEvent,
  ColumnState,
  IStatusPanelParams,
} from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { configureTestSuite } from 'ng-bullet';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { REFRENCE_TYPE_MOCK } from '../../../testing/mocks';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service';
import { SharedModule } from '../../shared/shared.module';
import { columnDefinitionToReferenceTypeProp } from '../../shared/table';
import { BomViewButtonComponent } from '../../shared/table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CustomStatusBarModule } from '../../shared/table/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../shared/table/custom-status-bar/detail-view-button/detail-view-button.component';
import { COLUMN_DEFINITIONS } from './config';
import { ReferenceTypesTableComponent } from './reference-types-table.component';

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
        AgGridModule.withComponents([
          DetailViewButtonComponent,
          BomViewButtonComponent,
        ]),
        MatIconModule,
        RouterTestingModule,
        provideTranslocoTestingModule({}),
        CustomStatusBarModule,
      ],
      declarations: [ReferenceTypesTableComponent],
      providers: [
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
      expect(Object.keys(result).includes('checkbox')).toBeTruthy();
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
