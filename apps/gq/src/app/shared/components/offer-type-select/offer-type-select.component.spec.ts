/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { OfferTypeModule } from '@gq/core/store/offer-type/offer-type.module';
import { OfferType } from '@gq/shared/models/offer-type.interface';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { OfferTypeSelectComponent } from './offer-type-select.component';

describe('OfferTypeSelectComponent', () => {
  let component: OfferTypeSelectComponent;
  let spectator: Spectator<OfferTypeSelectComponent>;

  const createComponent = createComponentFactory({
    component: OfferTypeSelectComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatSelectModule,
      PushPipe,
    ],
    providers: [provideMockStore({})],
    overrideComponents: [
      [
        OfferTypeSelectComponent,
        {
          remove: { imports: [OfferTypeModule] },
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
    test('should emit offerTypeSelected', () => {
      const offerType = { name: 'test', id: 'test' };
      const event = {
        value: offerType,
      } as MatSelectChange;
      component.offerTypeSelected.emit = jest.fn();
      component.selectionChange(event);
      expect(component.offerTypeSelected.emit).toHaveBeenCalledWith(
        event.value
      );
    });

    test('should emit undefined for emptyValue', () => {
      const event = {
        value: component.NO_ENTRY,
      } as MatSelectChange;
      component.offerTypeSelected.emit = jest.fn();
      component.selectionChange(event);
      expect(component.offerTypeSelected.emit).toHaveBeenCalledWith(undefined);
    });

    test('should call onChange and onTouched when defined', () => {
      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();
      component.selectionChange({ value: 'test' } as MatSelectChange);
      expect(component['onChange']).toHaveBeenCalledWith('test');
      expect(component['onTouched']).toHaveBeenCalled();
    });
  });

  describe('compareFn', () => {
    test('should return true if id is equal', () => {
      const optionOne = { id: 1 } as OfferType;
      const optionTwo = { id: 1 } as OfferType;
      expect(component.compareFn(optionOne, optionTwo)).toBe(true);
    });

    test('should return false if id is not equal', () => {
      const optionOne = { id: 1 } as OfferType;
      const optionTwo = { id: 2 } as OfferType;
      expect(component.compareFn(optionOne, optionTwo)).toBe(false);
    });
  });

  describe('AccessorFunctions', () => {
    test('writeValue should set components selectedOfferType', () => {
      const offerType = { id: 1 } as OfferType;
      component.writeValue(offerType);
      expect(component['selectedOfferType']).toEqual(offerType);
    });

    test('should register onChange callback', () => {
      const callback = jest.fn();
      component.registerOnChange(callback);
      expect(component['onChange']).toEqual(callback);
    });

    test('should register onTouched callback', () => {
      const callback = jest.fn();
      component.registerOnTouched(callback);
      expect(component['onTouched']).toEqual(callback);
    });

    test('setDisabledState should set the disabled state to true of the formControl', () => {
      component.setDisabledState(true);
      expect(component.offerTypeControl.disabled).toEqual(true);
    });
    test('setDisabledState should set the disabled state to false of the formControl', () => {
      component.setDisabledState(false);
      expect(component.offerTypeControl.disabled).toEqual(false);
    });
  });
});
