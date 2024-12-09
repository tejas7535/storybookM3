import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TargetPriceSourceSelectComponent } from './target-price-source-select.component';

describe('TargetPriceSourceComponent', () => {
  let component: TargetPriceSourceSelectComponent;
  let spectator: Spectator<TargetPriceSourceSelectComponent>;

  const createComponent = createComponentFactory({
    component: TargetPriceSourceSelectComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatSelectModule,
      PushPipe,
    ],
    providers: [provideMockStore({})],
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
    test('should emit targetPriceSourceSelected', () => {
      const targetPriceSource = TargetPriceSource.CUSTOMER;
      const event = {
        value: targetPriceSource,
      } as MatSelectChange;
      component.targetPriceSourceSelected.emit = jest.fn();
      component.selectionChange(event);
      expect(component.targetPriceSourceSelected.emit).toHaveBeenCalledWith(
        event.value
      );
    });

    test('should emit undefined for emptyValue', () => {
      const event = {
        value: undefined,
      } as MatSelectChange;
      component.targetPriceSourceSelected.emit = jest.fn();
      component.selectionChange(event);
      expect(component.targetPriceSourceSelected.emit).toHaveBeenCalledWith(
        undefined
      );
    });
  });

  describe('focus', () => {
    test('should focus the field', () => {
      component.valueInput.focus = jest.fn();
      component.focus();
      expect(component.valueInput.focus).toHaveBeenCalled();
    });
  });
  describe('Accessor functions', () => {
    test('writeValue should set components selectedType', () => {
      component.writeValue(TargetPriceSource.CUSTOMER);
      expect(component['selectedTargetPriceSource']).toEqual(
        TargetPriceSource.CUSTOMER
      );
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
      expect(component.targetPriceSourceFormControl.disabled).toEqual(true);
    });
    test('setDisabledState should set the disabled state to false of the formControl', () => {
      component.setDisabledState(false);
      expect(component.targetPriceSourceFormControl.disabled).toEqual(false);
    });
  });
});
