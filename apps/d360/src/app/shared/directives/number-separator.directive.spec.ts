import { Component, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { Stub } from '../test/stub.class';
import * as Helper from '../utils/number';
import { NumberSeparatorDirective } from './number-separator.directive';

@Component({
  selector: 'd360-app-test',
  template: `
    <mat-form-field [formGroup]="formGroup" appearance="outline">
      <mat-label>Label</mat-label>
      <input
        d360NumberSeparator
        matInput
        [formControl]="formControl"
        [allowDecimalPlaces]="allowDecimalPlaces"
        [allowNegativeNumbers]="allowNegativeNumbers"
      />
    </mat-form-field>
  `,
  imports: [MatInputModule, NumberSeparatorDirective, ReactiveFormsModule],
})
class TestComponent {
  public allowDecimalPlaces = input(false);
  public allowNegativeNumbers = input(false);

  public formControl = new FormControl(null);
  public formGroup = new FormGroup({
    threshold2: this.formControl,
  });
}

describe('NumberSeparatorDirective', () => {
  let directive: NumberSeparatorDirective;

  beforeEach(() => {
    Stub.getForEffect<TestComponent>({
      component: TestComponent,
      providers: [provideNoopAnimations()],
    });

    const debugElement = Stub.getFixture().debugElement.query(
      By.directive(NumberSeparatorDirective)
    );
    directive = debugElement.injector.get(NumberSeparatorDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set element type to text', () => {
      (directive as any)['elementRef'] = {
        nativeElement: { type: 'number' },
      } as any;
      directive.ngOnInit();
      expect(directive['elementRef'].nativeElement.type).toBe('text');
    });
  });

  describe('onInput', () => {
    it('should patch the control value with formatted value', () => {
      const formattedValue = '1,000';
      const patchValueSpy = jest.fn();

      (directive as any)['elementRef'] = {
        nativeElement: { value: '1000' },
      } as any;
      (directive as any)['ngControl'] = {
        control: { patchValue: patchValueSpy },
      } as any;

      jest
        .spyOn(directive, 'getFormattedValue')
        .mockReturnValue(formattedValue);

      directive.onInput();

      expect(patchValueSpy).toHaveBeenCalledWith(formattedValue, {
        emitEvent: false,
        onlySelf: true,
      });
    });
  });

  describe('getFormattedValue', () => {
    beforeEach(() => {
      (directive as any)['translocoLocaleService'] = {
        getLocale: jest.fn().mockReturnValue('en-US'),
        localizeNumber: jest.fn((num) => num.toString()),
      } as any;
    });

    it('should return empty string for non-numeric values', () => {
      jest
        .spyOn<any, any>(Helper, 'getNumberFromLocale')
        .mockReturnValue(Number.NaN);
      expect(directive.getFormattedValue('abc')).toBe('');
    });

    it('should handle negative sign when negative numbers are allowed', () => {
      Stub.setInputs([
        { property: 'allowNegativeNumbers', value: true },
        { property: 'allowDecimalPlaces', value: true },
      ]);
      Stub.detectChanges();

      expect(directive.getFormattedValue('-')).toBe('-');
    });

    it('should not allow negative sign when negative numbers are not allowed', () => {
      Stub.setInputs([
        { property: 'allowNegativeNumbers', value: false },
        { property: 'allowDecimalPlaces', value: false },
      ]);
      Stub.detectChanges();

      jest
        .spyOn<any, any>(Helper, 'getNumberFromLocale')
        .mockReturnValue(Number.NaN);
      expect(directive.getFormattedValue('-')).toBe('-');
    });

    it('should format numbers correctly', () => {
      jest.spyOn<any, any>(Helper, 'getNumberFromLocale').mockReturnValue(1000);
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('1,000');
      expect(directive.getFormattedValue('1000')).toBe('1,000');
    });

    it('should append decimal separator when user is entering decimal and decimals are allowed', () => {
      Stub.setInputs([
        { property: 'allowNegativeNumbers', value: false },
        { property: 'allowDecimalPlaces', value: true },
      ]);
      Stub.detectChanges();

      jest.spyOn<any, any>(Helper, 'getNumberFromLocale').mockReturnValue(123);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(true);
      jest.spyOn<any, any>(Helper, 'getDecimalSeparator').mockReturnValue('.');
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('123');

      expect(directive.getFormattedValue('123.')).toBe('123.');
    });

    it('should not append decimal separator when decimals are not allowed', () => {
      Stub.setInputs([
        { property: 'allowNegativeNumbers', value: false },
        { property: 'allowDecimalPlaces', value: false },
      ]);
      Stub.detectChanges();

      jest.spyOn<any, any>(Helper, 'getNumberFromLocale').mockReturnValue(123);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(true);
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('123');

      expect(directive.getFormattedValue('123.')).toBe('123.');
    });

    it('should use correct decimal places based on allowDecimalPlaces setting', () => {
      Stub.setInputs([
        { property: 'allowNegativeNumbers', value: false },
        { property: 'allowDecimalPlaces', value: true },
      ]);
      Stub.detectChanges();

      jest
        .spyOn<any, any>(Helper, 'getNumberFromLocale')
        .mockReturnValue(123.45);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(false);

      directive.getFormattedValue('123.45');

      expect(
        directive['translocoLocaleService'].localizeNumber
      ).toHaveBeenCalledWith(123.45, 'decimal', 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    });

    it('should use zero decimal places when allowDecimalPlaces is false', () => {
      Stub.setInputs([
        { property: 'allowNegativeNumbers', value: false },
        { property: 'allowDecimalPlaces', value: false },
      ]);
      Stub.detectChanges();

      jest
        .spyOn<any, any>(Helper, 'getNumberFromLocale')
        .mockReturnValue(123.45);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(false);

      directive.getFormattedValue('123.45');

      expect(
        directive['translocoLocaleService'].localizeNumber
      ).toHaveBeenCalledWith(123.45, 'decimal', 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    });

    it('should properly format decimal values when decimals are allowed', () => {
      Stub.setInputs([
        { property: 'allowNegativeNumbers', value: false },
        { property: 'allowDecimalPlaces', value: true },
      ]);
      Stub.detectChanges();

      jest
        .spyOn<any, any>(Helper, 'getNumberFromLocale')
        .mockReturnValue(123.45);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(false);
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('123.45');

      expect(directive.getFormattedValue('123.45')).toBe('123.45');
    });

    it('should properly format negative values when negative numbers are allowed', () => {
      Stub.setInputs([
        { property: 'allowNegativeNumbers', value: true },
        { property: 'allowDecimalPlaces', value: false },
      ]);
      Stub.detectChanges();

      jest.spyOn<any, any>(Helper, 'getNumberFromLocale').mockReturnValue(-123);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(false);
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('-123');

      expect(directive.getFormattedValue('-123')).toBe('-123');
    });

    it('should handle both negative and decimal values when both are allowed', () => {
      Stub.setInputs([
        { property: 'allowNegativeNumbers', value: true },
        { property: 'allowDecimalPlaces', value: true },
      ]);
      Stub.detectChanges();

      jest
        .spyOn<any, any>(Helper, 'getNumberFromLocale')
        .mockReturnValue(-123.45);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(false);
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('-123.45');

      expect(directive.getFormattedValue('-123.45')).toBe('-123.45');
    });

    it('should handle zero values correctly', () => {
      jest.spyOn<any, any>(Helper, 'getNumberFromLocale').mockReturnValue(0);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(false);
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('0');

      expect(directive.getFormattedValue('0')).toBe('0');
    });

    it('should handle large numbers with proper formatting', () => {
      const largeNumber = 1_234_567.89;
      jest
        .spyOn<any, any>(Helper, 'getNumberFromLocale')
        .mockReturnValue(largeNumber);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(false);
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('1,234,567.89');

      expect(directive.getFormattedValue(largeNumber.toString())).toBe(
        '1,234,567.89'
      );
    });

    it('should respect different locale settings', () => {
      jest
        .spyOn<any, any>(Helper, 'getNumberFromLocale')
        .mockReturnValue(1234.56);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(false);

      // Change locale to German
      jest
        .spyOn(directive['translocoLocaleService'], 'getLocale')
        .mockReturnValue('de-DE');
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('1.234,56');

      expect(directive.getFormattedValue('1234.56')).toBe('1.234,56');
    });

    it('should handle empty string input', () => {
      jest
        .spyOn<any, any>(Helper, 'getNumberFromLocale')
        .mockReturnValue(Number.NaN);
      expect(directive.getFormattedValue('')).toBe('');
    });

    it('should handle input with only decimal separator', () => {
      Stub.setInputs([{ property: 'allowDecimalPlaces', value: true }]);
      Stub.detectChanges();

      jest.spyOn<any, any>(Helper, 'getNumberFromLocale').mockReturnValue(0);
      jest
        .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
        .mockReturnValue(true);
      jest.spyOn<any, any>(Helper, 'getDecimalSeparator').mockReturnValue('.');
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('0');

      expect(directive.getFormattedValue('.')).toBe('0.');
    });

    it('should handle mixed non-numeric characters', () => {
      jest.spyOn<any, any>(Helper, 'getNumberFromLocale').mockReturnValue(123);
      jest
        .spyOn(directive['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('123');

      expect(directive.getFormattedValue('a123b')).toBe('123');
    });

    describe('directive integration', () => {
      beforeEach(() => {
        jest
          .spyOn<any, any>(Helper, 'getNumberFromLocale')
          .mockImplementation((val) =>
            val
              ? // eslint-disable-next-line unicorn/no-nested-ternary
                typeof val === 'string' && val.includes('.')
                ? Number.parseFloat(val)
                : Number.parseInt(val as any, 10)
              : Number.NaN
          );
        jest
          .spyOn<any, any>(Helper, 'numberIsAtStartOfDecimal')
          .mockImplementation(
            (val) => typeof val === 'string' && val.endsWith('.')
          );
      });

      it('should properly format number and update form control', () => {
        Stub.setInputs([
          { property: 'allowDecimalPlaces', value: true },
          { property: 'allowNegativeNumbers', value: true },
        ]);
        Stub.detectChanges();

        const patchValueSpy = jest.fn();
        (directive as any)['elementRef'] = {
          nativeElement: { value: '1234.5' },
        } as any;
        (directive as any)['ngControl'] = {
          control: { patchValue: patchValueSpy },
        } as any;

        jest
          .spyOn(directive['translocoLocaleService'], 'localizeNumber')
          .mockReturnValue('1,234.5');

        directive.onInput();

        expect(patchValueSpy).toHaveBeenCalledWith('1,234.5', {
          emitEvent: false,
          onlySelf: true,
        });
      });

      it('should enforce maximum of 2 decimal places when decimals are allowed', () => {
        Stub.setInputs([{ property: 'allowDecimalPlaces', value: true }]);
        Stub.detectChanges();

        jest
          .spyOn<any, any>(Helper, 'getNumberFromLocale')
          .mockReturnValue(123.456);

        directive.getFormattedValue('123.456');

        expect(
          directive['translocoLocaleService'].localizeNumber
        ).toHaveBeenCalledWith(123.456, 'decimal', expect.any(String), {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      });
    });
  });

  describe('conditionallyAppendDecimalSeparator', () => {
    it('should append decimal separator when allowed and user is entering decimal', () => {
      (directive as any)['allowDecimalPlaces'] = signal(true);

      jest.spyOn<any, any>(Helper, 'getDecimalSeparator').mockReturnValue('.');

      const result = directive['conditionallyAppendDecimalSeparator'](true);
      expect(result).toBe('.');
    });

    it('should not append decimal separator when not allowed', () => {
      (directive as any)['allowDecimalPlaces'] = signal(false);

      const result = directive['conditionallyAppendDecimalSeparator'](true);
      expect(result).toBe('');
    });

    it('should not append decimal separator when user is not entering decimal', () => {
      (directive as any)['allowDecimalPlaces'] = signal(true);

      const result = directive['conditionallyAppendDecimalSeparator'](false);
      expect(result).toBe('');
    });
  });
});
