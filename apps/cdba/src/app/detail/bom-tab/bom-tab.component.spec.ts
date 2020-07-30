import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ColumnApi,
  GridApi,
  IStatusPanelParams,
  RowNode,
} from '@ag-grid-community/core';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BomItem } from '../../core/store/reducers/detail/models';
import { getBomItems } from '../../core/store/selectors/details/detail.selector';
import { BomTabComponent } from './bom-tab.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('BomTabComponent', () => {
  let component: BomTabComponent;
  let fixture: ComponentFixture<BomTabComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatIconModule,
        AgGridModule.withComponents([]),
        provideTranslocoTestingModule({}),
      ],
      declarations: [BomTabComponent],
      providers: [
        provideMockStore({
          initialState: {
            detail: {},
          },
          selectors: [
            {
              selector: getBomItems,
              value: [],
            },
          ],
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set observable', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.bomItems$).toBeDefined();
    });
  });

  describe('onGridReady', () => {
    it('should set api and event listener', () => {
      const params: IStatusPanelParams = {
        api: ({
          addEventListener: jest.fn(),
        } as unknown) as GridApi,
        columnApi: ({} as unknown) as ColumnApi,
        context: {},
      };

      component.onGridReady(params);

      expect(component['gridApi']).toEqual(params.api);
      expect(component['gridColumnApi']).toEqual(params.columnApi);
      expect(params.api.addEventListener).toHaveBeenCalled();
    });
  });

  describe('getDataPath', () => {
    it('should return predecessors of item', () => {
      const item = new BomItem(
        1,
        'c',
        '003',
        2,
        2,
        'mat',
        2,
        'mat2',
        'type',
        'act',
        2,
        2,
        2,
        2,
        'pc',
        'cost',
        'foreign',
        2,
        'mattérial',
        'parentplant',
        'date',
        'number',
        'version',
        'type',
        'entered',
        'ref',
        'variant',
        ['root', 'current']
      );

      const result = component.getDataPath(item);

      expect(result).toEqual(item.predecessorsInTree);
    });
  });

  describe('onRowGroupOpened', () => {
    it('should call autosize and redraw', () => {
      component['gridColumnApi'] = ({
        autoSizeColumn: jest.fn(),
      } as unknown) as ColumnApi;

      component['gridApi'] = ({
        redrawRows: jest.fn(),
      } as unknown) as GridApi;

      component.onRowGroupOpened();

      expect(component['gridColumnApi'].autoSizeColumn).toHaveBeenCalledWith(
        'ag-Grid-AutoColumn'
      );
      expect(component['gridApi'].redrawRows).toHaveBeenCalledTimes(1);
    });
  });

  describe('onRowClicked', () => {
    it('should update level 2 children and redraw', () => {
      component.updateNonLevel2Children = jest.fn();
      component['gridApi'] = ({
        redrawRows: jest.fn(),
      } as unknown) as GridApi;

      const evt = {
        node: {
          id: '2',
        },
      };

      component.onRowClicked(evt);

      expect(component.currentSelectedRow.node.id).toEqual(evt.node.id);
      expect(component.updateNonLevel2Children).toHaveBeenCalledWith(evt.node);
      expect(component['gridApi'].redrawRows).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateNonLevel2Children', () => {
    it('should recursively iterate through all children and add them to array', () => {
      const node = ({
        id: '0',
        parent: {
          id: '-1',
        },
        childrenAfterGroup: [
          {
            id: '1',
            parent: {
              id: '0',
            },
            childrenAfterGroup: [],
          },
          {
            id: '2',
            parent: {
              id: '0',
            },
            childrenAfterGroup: [
              {
                id: '3',
                parent: {
                  id: '2',
                },
                childrenAfterGroup: [],
              },
            ],
          },
        ],
      } as unknown) as RowNode;

      component.updateNonLevel2Children(node);

      expect(component.nonLevel2Children).toEqual(['3']);
    });
  });

  describe('getRowClass', () => {
    it('should return when unrelated row', () => {
      const params = {
        node: {
          id: '3',
          parent: {
            id: '2',
          },
        },
      };

      const result = component.getRowClass(params);

      expect(result).toEqual('');
    });

    it('should return top-level-row when selected node is give', () => {
      component.currentSelectedRow.node.id = '2';

      const params = {
        node: {
          id: '2',
          parent: {
            id: '1',
          },
        },
      };

      const result = component.getRowClass(params);

      expect(result).toEqual('top-level-row');
    });

    it('should return appropriate second-level-row if second level', () => {
      component.currentSelectedRow.node.id = '1';

      const params = {
        node: {
          id: '2',
          parent: {
            id: '1',
          },
          childIndex: 4,
        },
      };

      const result = component.getRowClass(params);

      expect(result).toEqual('second-level-row-4');
    });

    it('should return appropriate third or more row when it is a deeper child', () => {
      component.currentSelectedRow.node.id = '1';
      component.nonLevel2Children = ['3', '4'];

      const params = {
        node: {
          id: '3',
          parent: {
            id: '2',
            childIndex: 2,
            parent: {
              id: '1',
              childIndex: 5,
            },
          },
          childIndex: 3,
        },
      };

      const result = component.getRowClass(params);

      expect(result).toEqual('third-or-more-row-2');
    });
  });
});
