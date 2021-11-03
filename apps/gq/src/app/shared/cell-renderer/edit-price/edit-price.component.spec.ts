import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ColumnFields } from '../../services/column-utility-service/column-fields.enum';
import { EditPriceComponent } from './edit-price.component';

describe('EditPriceComponent', () => {
  let component: EditPriceComponent;
  let spectator: Spectator<EditPriceComponent>;

  const createComponent = createComponentFactory({
    component: EditPriceComponent,
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
        colKey: ColumnFields.PRICE,
        rowPinned: undefined,
        charPress: undefined,
        keyPress: undefined,
      });
    });
  });
});
