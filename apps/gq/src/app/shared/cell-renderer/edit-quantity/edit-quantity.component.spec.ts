import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { PROCESS_CASE_STATE_MOCK } from '../../../../testing/mocks';
import { ColumnFields } from '../../services/column-utility-service/column-fields.enum';
import { EditQuantityComponent } from './edit-quantity.component';

describe('EditQuantityComponent', () => {
  let component: EditQuantityComponent;
  let spectator: Spectator<EditQuantityComponent>;

  const createComponent = createComponentFactory({
    component: EditQuantityComponent,
    imports: [
      MatIconModule,
      MatInputModule,
      ReactiveFormsModule,
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('agInit', () => {
    test('should define params and value', () => {
      const params = { valueFormatted: 1 } as any;

      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.value).toEqual(params.valueFormatted);
    });
  });
  describe('onIconClick', () => {
    test('startEditMode', () => {
      component.params = {
        api: {
          startEditingCell: jest.fn(),
        },
        rowIndex: 1,
      } as any;

      component.onIconClick();

      expect(component.params.api.startEditingCell).toHaveBeenCalledWith({
        rowIndex: 1,
        colKey: ColumnFields.ORDER_QUANTITY,
        rowPinned: undefined,
        charPress: undefined,
        keyPress: undefined,
      });
    });
  });
});
