import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TextareaFormFieldComponent } from './textarea-form-field.component';

describe('TextareaFormFieldComponent', () => {
  let component: TextareaFormFieldComponent;
  let spectator: Spectator<TextareaFormFieldComponent>;

  const createComponent = createComponentFactory({
    component: TextareaFormFieldComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [MockProvider(TranslocoService)],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onPaste method test', () => {
    test('should handle pasted text exceeding max length', () => {
      const pastedText = 'a'.repeat(component.inputMaxLength() + 1);

      const event = {
        clipboardData: {
          getData: jest.fn().mockReturnValue(pastedText), // Mock clipboard data to return value longer then max_length
        },
      } as any;

      // Mock setTimeout
      jest.useFakeTimers();

      // Mock changeDetectorRef
      const changeDetectorRefMock = {
        detectChanges: jest.fn(),
      };
      Object.defineProperty(component, 'changeDetectorRef', {
        value: changeDetectorRefMock,
      });

      // Invoke the onPaste method
      component.onPaste(event);

      // Assertions
      expect(component.isInvalidInput).toBe(true);

      // Advance timers by 3000 ms to trigger setTimeout callback
      jest.advanceTimersByTime(3000);

      // Fast-forward timers to the end
      jest.runAllTimers();

      expect(component.isInvalidInput).toBe(false);
      expect(changeDetectorRefMock.detectChanges).toHaveBeenCalledTimes(1);
      expect(event.clipboardData.getData).toHaveBeenCalledWith('text/plain');
      expect(event.clipboardData.getData).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });

    test('should handle pasted text within max length', () => {
      const pastedText = 'a'.repeat(component.inputMaxLength() - 1);

      const event = {
        clipboardData: {
          getData: jest.fn().mockReturnValue(pastedText), // Mock clipboard data to return value longer then max_length
        },
      } as any;

      // Invoke the onPaste method
      component.onPaste(event);

      // Assertions
      expect(component.isInvalidInput).toBe(false);
    });
  });

  describe('AccessorFunctions', () => {
    test('writeValue should set components value', () => {
      const newValue = 'New value';
      component.writeValue(newValue);
      expect(component['value']).toEqual(newValue);
    });

    test('should register onChange callback function', () => {
      const callback = jest.fn();
      component.registerOnChange(callback);
      expect(component['onChange']).toEqual(callback);
    });

    test('should register onTouched callback function', () => {
      const callback = jest.fn();
      component.registerOnTouched(callback);
      expect(component['onTouched']).toEqual(callback);
    });
  });

  describe('onInputChange method test', () => {
    test('should call writeValue', () => {
      const spy = jest.spyOn(component, 'writeValue');
      component.onInputChange({
        target: { value: 'New value' },
      } as unknown as Event);
      expect(spy).toHaveBeenCalled();
    });
  });
});
