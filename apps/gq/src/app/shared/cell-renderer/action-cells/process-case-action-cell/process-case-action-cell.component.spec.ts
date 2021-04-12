import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { deleteAddMaterialRowDataItem } from '../../../../core/store/actions';
import { dummyRowData } from '../../../../core/store/reducers/create-case/config/dummy-row-data';
import { ProcessCaseActionCellComponent } from './process-case-action-cell.component';

describe('ActionCellComponent', () => {
  let component: ProcessCaseActionCellComponent;
  let spectator: Spectator<ProcessCaseActionCellComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ProcessCaseActionCellComponent,
    declarations: [ProcessCaseActionCellComponent],
    imports: [MatIconModule],
    providers: [provideMockStore({})],
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
        data: dummyRowData,
      };
      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.isDummy).toBeTruthy();
    });
  });

  describe('deleteItem', () => {
    test('should dispatch deleteAddMaterialRowDataItem action', () => {
      mockStore.dispatch = jest.fn();

      component.params = {
        data: {
          materialNumber: '1234',
          quantity: 10,
        },
        colDef: {},
      } as any;

      component.deleteItem();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        deleteAddMaterialRowDataItem({ materialNumber: '1234', quantity: 10 })
      );
    });
  });
});
