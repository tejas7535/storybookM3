import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ProcessCaseActions } from '@gq/core/store/process-case';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ProcessCaseActionCellComponent } from './process-case-action-cell.component';

describe('ActionCellComponent', () => {
  let component: ProcessCaseActionCellComponent;
  let spectator: Spectator<ProcessCaseActionCellComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ProcessCaseActionCellComponent,
    declarations: [ProcessCaseActionCellComponent],
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
    });
  });

  describe('deleteItem', () => {
    test('should dispatch deleteAddMaterialRowDataItem action', () => {
      mockStore.dispatch = jest.fn();

      component.params = {
        data: {
          id: 10,
          materialNumber: '1234',
          quantity: 10,
        },
        colDef: {},
      } as any;

      component.deleteItem();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ProcessCaseActions.deleteItemFromMaterialTable({ id: 10 })
      );
    });
  });
});
