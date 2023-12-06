import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { PurchaseOrderTypeModule } from '@gq/core/store/purchase-order-type/purchase-order-type.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PurchaseOrderTypeSelectComponent } from './purchase-order-type-select.component';

describe('PurchaseOrderTypeSelectComponent', () => {
  let component: PurchaseOrderTypeSelectComponent;
  let spectator: Spectator<PurchaseOrderTypeSelectComponent>;

  const createComponent = createComponentFactory({
    component: PurchaseOrderTypeSelectComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatSelectModule,
      PushPipe,
    ],
    providers: [provideMockStore({})],
    overrideComponents: [
      [
        PurchaseOrderTypeSelectComponent,
        {
          remove: { imports: [PurchaseOrderTypeModule] },
        },
      ],
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectionChange', () => {
    test('should emit purchaseOrderTypeSelected', () => {
      const purchaseOrderType = { name: 'test', id: 'test' };
      const event = {
        value: purchaseOrderType,
      } as MatSelectChange;
      component.purchaseOrderTypeSelected.emit = jest.fn();
      component.selectionChange(event);
      expect(component.purchaseOrderTypeSelected.emit).toHaveBeenCalledWith(
        event.value
      );
    });

    test('should emit undefined for emptyValue', () => {
      const event = {
        value: component.emptyValue,
      } as MatSelectChange;
      component.purchaseOrderTypeSelected.emit = jest.fn();
      component.selectionChange(event);
      expect(component.purchaseOrderTypeSelected.emit).toHaveBeenCalledWith(
        undefined
      );
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
