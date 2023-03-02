import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { deleteRowDataItem } from '@gq/core/store/actions';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CreateCaseActionCellComponent } from './create-case-action-cell.component';

describe('ActionCellComponent', () => {
  let component: CreateCaseActionCellComponent;
  let spectator: Spectator<CreateCaseActionCellComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: CreateCaseActionCellComponent,
    declarations: [CreateCaseActionCellComponent],
    imports: [MatIconModule],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      const params: any = {
        test: '123',
        data: [],
      };
      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component).toBeTruthy();
    });
  });

  describe('deleteItem', () => {
    test('should dispatch deleteRowData action', () => {
      mockStore.dispatch = jest.fn();

      component.params = {
        data: {
          materialNumber: '1234',
          quantity: 10,
        },
        colDef: {
          cellRendererParams: 'createCase',
        },
      } as any;

      component.deleteItem();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        deleteRowDataItem({ materialNumber: '1234', quantity: 10 })
      );
    });
  });
});
