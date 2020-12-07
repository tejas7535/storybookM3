import { TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  deleteAddMaterialRowDataItem,
  deleteRowDataItem,
} from '../../../core/store/actions';
import { dummyRowData } from '../../../core/store/reducers/create-case/config/dummy-row-data';
import { ActionCellComponent } from './action-cell.component';

describe('ActionCellComponent', () => {
  let component: ActionCellComponent;
  let spectator: Spectator<ActionCellComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ActionCellComponent,
    declarations: [ActionCellComponent],
    imports: [MatIconModule],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = TestBed.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      const params: any = {
        test: '123',
        data: dummyRowData,
      };
      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.isDummy).toBeTruthy();
    });
  });

  describe('deleteItem', () => {
    test('should dispatch "[Create Case] Delete Item from Customer Table" action', () => {
      mockStore.dispatch = jest.fn();

      component.params = {
        data: {
          materialNumber: '1234',
        },
        colDef: {
          cellRendererParams: 'createCase',
        },
      };

      component.deleteItem();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        deleteRowDataItem({ materialNumber: '1234' })
      );
    });

    test('should dispatch "[Process Case] Delete Item from Material Table" action', () => {
      mockStore.dispatch = jest.fn();

      component.params = {
        data: {
          materialNumber: '1234',
        },
        colDef: {},
      };

      component.deleteItem();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        deleteAddMaterialRowDataItem({ materialNumber: '1234' })
      );
    });
  });
});
