import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import {
  getAddMaterialRowData,
  getAddMaterialRowDataValid,
  ProcessCaseActions,
} from '@gq/core/store/process-case';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HeaderClassParams, RowNode } from 'ag-grid-enterprise';
import { marbles } from 'rxjs-marbles';

import { MaterialTableItem } from '../../../../models/table';
import { ProcessCaseActionHeaderComponent } from './process-case-action-header.component';

describe('ProcessCaseActionHeaderComponent', () => {
  let component: ProcessCaseActionHeaderComponent;
  let spectator: Spectator<ProcessCaseActionHeaderComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ProcessCaseActionHeaderComponent,
    declarations: [ProcessCaseActionHeaderComponent],
    imports: [MatIconModule, PushPipe],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showDeleteButton$', () => {
    const materialTableItem = {
      materialDescription: 'description',
      materialNumber: '12345',
      quantity: 10,
      info: {
        valid: true,
      },
    } as MaterialTableItem;

    test(
      'should set to FALSE if addMaterials are valid',
      marbles((m) => {
        mockStore.overrideSelector(getAddMaterialRowData, [materialTableItem]);
        mockStore.overrideSelector(getAddMaterialRowDataValid, true);

        component.agInit({} as HeaderClassParams);

        m.expect(component.showDeleteButton$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
    test(
      'should set to FALSE if addMaterials are empty',
      marbles((m) => {
        mockStore.overrideSelector(getAddMaterialRowData, []);
        mockStore.overrideSelector(getAddMaterialRowDataValid, false);

        component.agInit({} as HeaderClassParams);

        m.expect(component.showDeleteButton$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
    test(
      'should set to TRUE if addMaterials are not empty and invalid',
      marbles((m) => {
        mockStore.overrideSelector(getAddMaterialRowData, [materialTableItem]);
        mockStore.overrideSelector(getAddMaterialRowDataValid, false);

        component.agInit({} as HeaderClassParams);

        m.expect(component.showDeleteButton$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('deleteItems', () => {
    test('should dispatch delete action for each invalid node', () => {
      mockStore.dispatch = jest.fn();

      const nodes = [
        {
          data: {
            info: { valid: true },
            id: 10,
            materialNumber: '123',
            quantity: 10,
          },
          setSelected: jest.fn(),
        },
        {
          data: {
            info: { valid: false },
            id: 20,
            materialNumber: '456',
            quantity: 10,
          },
          setSelected: jest.fn(),
        },
        {
          data: {
            info: { valid: true },
            id: 30,
            materialNumber: '789',
            quantity: 10,
          },
          setSelected: jest.fn(),
        },
      ];

      const mockParams = {
        api: {
          forEachNode: (callback: (row: RowNode) => void) =>
            nodes.forEach((element: any) => {
              callback(element);
            }),
        },
      } as any;

      component.agInit(mockParams as HeaderClassParams);
      component.deleteItems();

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ProcessCaseActions.deleteItemFromMaterialTable({
          id: 20,
        })
      );
    });
  });
});
