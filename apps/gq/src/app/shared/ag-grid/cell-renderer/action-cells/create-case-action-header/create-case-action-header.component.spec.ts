import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HeaderClassParams, RowNode } from 'ag-grid-community';
import { marbles } from 'rxjs-marbles';

import {
  deleteRowDataItem,
  getCaseRowData,
  getCustomerConditionsValid,
} from '../../../../../core/store';
import { MaterialTableItem } from '../../../../models/table';
import { CreateCaseActionHeaderComponent } from './create-case-action-header.component';

describe('CreateCaseActionHeaderComponent', () => {
  let component: CreateCaseActionHeaderComponent;
  let spectator: Spectator<CreateCaseActionHeaderComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: CreateCaseActionHeaderComponent,
    declarations: [CreateCaseActionHeaderComponent],
    imports: [MatIconModule, PushModule],
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
        mockStore.overrideSelector(getCaseRowData, [materialTableItem]);
        mockStore.overrideSelector(getCustomerConditionsValid, true);

        component.agInit({} as HeaderClassParams);

        m.expect(component.showDeleteButton$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
    test(
      'should set to FALSE if addMaterials are empty',
      marbles((m) => {
        mockStore.overrideSelector(getCaseRowData, []);
        mockStore.overrideSelector(getCustomerConditionsValid, false);

        component.agInit({} as HeaderClassParams);

        m.expect(component.showDeleteButton$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
    test(
      'should set to TRUE if addMaterials are not empty and invalid',
      marbles((m) => {
        mockStore.overrideSelector(getCaseRowData, [materialTableItem]);
        mockStore.overrideSelector(getCustomerConditionsValid, false);

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
          data: { info: { valid: true }, materialNumber: '123', quantity: 10 },
          setSelected: jest.fn(),
        },
        {
          data: { info: { valid: false }, materialNumber: '456', quantity: 10 },
          setSelected: jest.fn(),
        },
        {
          data: { info: { valid: true }, materialNumber: '789', quantity: 10 },
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
        deleteRowDataItem({
          materialNumber: '456',
          quantity: 10,
        })
      );
    });
  });
});
