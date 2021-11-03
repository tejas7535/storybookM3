import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { HelperService } from '../../services/helper-service/helper-service.service';
import { EditingPriceComponent } from './editing-price.component';

describe('EditingPriceComponent', () => {
  let component: EditingPriceComponent;
  let spectator: Spectator<EditingPriceComponent>;

  const createComponent = createComponentFactory({
    component: EditingPriceComponent,
    imports: [MatIconModule, MatInputModule, ReactiveFormsModule],
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
    test('should set params', () => {
      component.manualPriceFormControl = { setValue: jest.fn() } as any;
      component.agInit({} as any);

      expect(component.params).toBeDefined();
      expect(component.manualPriceFormControl.setValue).toHaveBeenCalledTimes(
        1
      );
    });
  });
  describe('ngAfterViewChecked', () => {
    test('should focus inputElement', () => {
      component.inputElement = {
        nativeElement: {
          focus: jest.fn(),
        },
      };
      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngAfterViewChecked();

      expect(component.inputElement.nativeElement.focus).toHaveBeenCalledTimes(
        1
      );
    });
  });
  describe('closeEditing', () => {
    test('should stopEditing', () => {
      component.params = {
        api: {
          stopEditing: jest.fn(),
        },
      } as any;

      component.stopEditing(true);

      expect(component.params.api.stopEditing).toHaveBeenCalledTimes(1);
      expect(component.params.api.stopEditing).toHaveBeenLastCalledWith(true);
    });
  });
  describe('getValue', () => {
    test('should return value', () => {
      component.manualPriceFormControl = { value: 1 } as any;
      const result = component.getValue();
      expect(result).toEqual(1);
    });
  });

  describe('onKeyPress', () => {
    test('should call HelperService', () => {
      HelperService.validateNumberInputKeyPress = jest.fn();

      component.onKeyPress({} as any, {} as any);

      expect(HelperService.validateNumberInputKeyPress).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('onPaste', () => {
    test('should set price', () => {
      HelperService.validateNumberInputPaste = jest.fn();

      component.onPaste({} as any);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledTimes(1);
    });
  });
});
