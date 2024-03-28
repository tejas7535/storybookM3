import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { PurchaseOrderTypeModule } from '@gq/core/store/purchase-order-type/purchase-order-type.module';
import { PurchaseOrderType } from '@gq/shared/models';
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
        value: component.NO_ENTRY,
      } as MatSelectChange;
      component.purchaseOrderTypeSelected.emit = jest.fn();
      component.selectionChange(event);
      expect(component.purchaseOrderTypeSelected.emit).toHaveBeenCalledWith(
        undefined
      );
    });

    test('should call onChange and onTouch if set', () => {
      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();
      component.selectionChange({ value: 'test' } as MatSelectChange);
      expect(component['onChange']).toHaveBeenCalledWith('test');
      expect(component['onTouched']).toHaveBeenCalled();
    });
  });

  describe('compareFn', () => {
    test('should return true for same id', () => {
      const result = component.compareFn(
        { id: 'test' } as PurchaseOrderType,
        { id: 'test' } as PurchaseOrderType
      );
      expect(result).toEqual(true);
    });

    test('should return false for different id', () => {
      const result = component.compareFn(
        { id: 'test' } as PurchaseOrderType,
        { id: 'test2' } as PurchaseOrderType
      );
      expect(result).toEqual(false);
    });
  });

  describe('Accessor functions', () => {
    test('writeValue should set components selectedType', () => {
      component.writeValue({ name: 'test', id: 'test' } as PurchaseOrderType);
      expect(component['selectedType']).toEqual({ name: 'test', id: 'test' });
    });

    test('registerOnChange should set onChange', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      expect(component['onChange']).toEqual(onChange);
    });

    test('registerOnTouched should set onTouched', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);
      expect(component['onTouched']).toEqual(onTouched);
    });

    test('setDisabledState should set the disabled state to true of the formControl', () => {
      component.setDisabledState(true);
      expect(component.purchaseOrderTypeControl.disabled).toEqual(true);
    });
    test('setDisabledState should set the disabled state to false of the formControl', () => {
      component.setDisabledState(false);
      expect(component.purchaseOrderTypeControl.disabled).toEqual(false);
    });
  });
});
