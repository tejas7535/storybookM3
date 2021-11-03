import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ColumnFields } from '../../../services/column-utility-service/column-fields.enum';
import { EditDiscountComponent } from './edit-discount.component';

describe('EditDiscountComponent', () => {
  let component: EditDiscountComponent;
  let spectator: Spectator<EditDiscountComponent>;

  const createComponent = createComponentFactory({
    component: EditDiscountComponent,
    imports: [MatIconModule],
    providers: [
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
      const sapGrossPrice = 100;
      const params = {
        data: { sapGrossPrice },
        valueFormatted: '10.01 %',
      } as any;

      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.value).toEqual(params.valueFormatted);
      expect(component.sapGrossPrice).toEqual(sapGrossPrice);
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
        colKey: ColumnFields.DISCOUNT,
        rowPinned: undefined,
        charPress: undefined,
        keyPress: undefined,
      });
    });
  });
});
