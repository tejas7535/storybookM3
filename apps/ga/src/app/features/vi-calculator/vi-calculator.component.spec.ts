import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ViCalculatorComponent } from './vi-calculator.component';
import { viscosityTable } from './viscosity-table';

describe('ViCalculatorComponent', () => {
  let spectator: Spectator<ViCalculatorComponent>;

  const createComponent = createComponentFactory({
    component: ViCalculatorComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(spectator.component.viWert).toBeUndefined();
      expect(spectator.component.formSubmitted).toBe(false);
      expect(spectator.component.viForm).toBeDefined();
      expect(spectator.component.v40).toBeInstanceOf(FormControl);
      expect(spectator.component.v100).toBeInstanceOf(FormControl);
    });

    it('should set up form controls with proper validators', () => {
      spectator.detectChanges();

      // Test required validators
      spectator.component.v40.setValue(undefined);
      spectator.component.v100.setValue(undefined);
      expect(spectator.component.v40.hasError('required')).toBe(true);
      expect(spectator.component.v100.hasError('required')).toBe(true);

      // Test min validator on v100
      spectator.component.v100.setValue(2);
      expect(spectator.component.v100.hasError('min')).toBe(true);

      spectator.component.v100.setValue(3);
      expect(spectator.component.v100.hasError('min')).toBe(false);
    });

    it('should add relative validators in ngOnInit', () => {
      spectator.detectChanges();

      // Test v40 > v100 validation
      spectator.component.v40.setValue(50);
      spectator.component.v100.setValue(60);
      spectator.component.viForm.updateValueAndValidity();

      expect(spectator.component.v40.hasError('relativeValidatorError')).toBe(
        true
      );

      // Test v100 < v40 validation
      spectator.component.v40.setValue(80);
      spectator.component.v100.setValue(50);
      spectator.component.viForm.updateValueAndValidity();

      expect(spectator.component.v100.hasError('relativeValidatorError')).toBe(
        false
      );
      expect(spectator.component.v40.hasError('relativeValidatorError')).toBe(
        false
      );
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should validate v40 is greater than v100', () => {
      spectator.component.v40.setValue(50);
      spectator.component.v100.setValue(60);
      spectator.component.viForm.updateValueAndValidity();

      expect(spectator.component.v40.hasError('relativeValidatorError')).toBe(
        true
      );
    });

    it('should validate v100 is less than v40', () => {
      spectator.component.v40.setValue(40);
      spectator.component.v100.setValue(50);
      spectator.component.viForm.updateValueAndValidity();

      expect(spectator.component.v100.hasError('relativeValidatorError')).toBe(
        true
      );
    });

    it('should validate v100 minimum value of 3', () => {
      spectator.component.v100.setValue(2);
      expect(spectator.component.v100.hasError('min')).toBe(true);

      spectator.component.v100.setValue(3);
      expect(spectator.component.v100.hasError('min')).toBe(false);
    });

    it('should be valid with correct values', () => {
      spectator.component.v40.setValue(80);
      spectator.component.v100.setValue(50);
      spectator.component.viForm.updateValueAndValidity();

      expect(spectator.component.viForm.valid).toBe(true);
    });
  });

  describe('VI Calculation', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    describe('calculateVIFormula', () => {
      it('should return NaN for invalid inputs', () => {
        expect(spectator.component.calculateVIFormula(0, 50)).toBeNaN();
        expect(spectator.component.calculateVIFormula(50, 0)).toBeNaN();
        expect(spectator.component.calculateVIFormula(-10, 50)).toBeNaN();
        expect(spectator.component.calculateVIFormula(50, -10)).toBeNaN();
        expect(
          spectator.component.calculateVIFormula(undefined as any, 50)
        ).toBeNaN();
        expect(
          spectator.component.calculateVIFormula(50, undefined as any)
        ).toBeNaN();
      });

      it('should return NaN for v100 <= 2', () => {
        expect(spectator.component.calculateVIFormula(50, 1)).toBeNaN();
        expect(spectator.component.calculateVIFormula(50, 2)).toBeNaN();
      });

      it('should calculate VI using viscosity table for v100 <= 70', () => {
        const tableRow = viscosityTable.find((r) => r.v100 === 10);
        expect(tableRow).toBeDefined();

        const v40 = 120; // > H (82.87)
        const v100 = 10;
        const result = spectator.component.calculateVIFormula(v40, v100);

        const expectedVI =
          100 * ((tableRow.L - v40) / (tableRow.L - tableRow.H));
        expect(result).toBe(Math.round(expectedVI));
      });

      it('should calculate VI using formula for v100 > 70', () => {
        const v40 = 500;
        const v100 = 80;

        const result = spectator.component.calculateVIFormula(v40, v100);

        expect(result).toBe(244);
      });

      it('should calculate high VI when v40 <= H', () => {
        // Use a case where v40 is very low compared to H
        const v100 = 10;
        const tableRow = viscosityTable.find((r) => r.v100 === v100);
        expect(tableRow).toBeDefined();

        const v40 = tableRow.H - 10; // Make v40 less than H

        const result = spectator.component.calculateVIFormula(v40, v100);

        const N = (Math.log(tableRow.H) - Math.log(v40)) / Math.log(v100);
        const expectedVI = 100 + (Math.pow(10, N) - 1) / 0.007_15;

        expect(result).toBe(Math.round(expectedVI));
      });

      it('should return NaN for v100 not found in table (when v100 <= 70)', () => {
        const result = spectator.component.calculateVIFormula(50, 11.5);
        expect(result).toBeNaN();
      });

      it('should calculate correct VI for typical petroleum products', () => {
        expect(spectator.component.calculateVIFormula(100, 10)).toBe(74);

        expect(spectator.component.calculateVIFormula(50, 10)).toBe(192);
      });
    });

    describe('calculateVI', () => {
      it('should set viWert to undefined when form is invalid', () => {
        spectator.component.formSubmitted = true;
        spectator.component.v40.setValue(undefined);
        spectator.component.v100.setValue(50);

        spectator.component.calculateVI();

        expect(spectator.component.viWert).toBeUndefined();
      });

      it('should calculate VI when form is valid', () => {
        spectator.component.v40.setValue(100);
        spectator.component.v100.setValue(10);

        spectator.component.calculateVI();

        expect(spectator.component.viWert).toBe(74);
        expect(spectator.component.formSubmitted).toBe(true);
      });

      it('should update viWert when called multiple times', () => {
        spectator.component.v40.setValue(100);
        spectator.component.v100.setValue(10);
        spectator.component.calculateVI();
        expect(spectator.component.viWert).toBe(74);

        spectator.component.v40.setValue(150);
        spectator.component.v100.setValue(15);
        spectator.component.calculateVI();
        expect(spectator.component.viWert).not.toBe(74);
      });
    });
  });

  describe('Form Interactions', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should call calculateVI on form value changes', () => {
      const spy = jest.spyOn(spectator.component, 'calculateVI');

      spectator.component.v40.setValue(80);

      expect(spy).toHaveBeenCalled();
    });

    it('should update form validity when v40 changes', () => {
      const updateSpy = jest.spyOn(
        spectator.component.viForm,
        'updateValueAndValidity'
      );
      const v100UpdateSpy = jest.spyOn(
        spectator.component.v100,
        'updateValueAndValidity'
      );

      spectator.component.v40.setValue(80);

      expect(updateSpy).toHaveBeenCalled();
      expect(v100UpdateSpy).toHaveBeenCalledWith({ emitEvent: false });
    });

    it('should update form validity when v100 changes', () => {
      const updateSpy = jest.spyOn(
        spectator.component.viForm,
        'updateValueAndValidity'
      );
      const v40UpdateSpy = jest.spyOn(
        spectator.component.v40,
        'updateValueAndValidity'
      );

      spectator.component.v100.setValue(50);

      expect(updateSpy).toHaveBeenCalled();
      expect(v40UpdateSpy).toHaveBeenCalledWith({ emitEvent: false });
    });

    it('should handle onSubmit', () => {
      const spy = jest.spyOn(spectator.component, 'calculateVI');

      spectator.component.onSubmit();

      expect(spectator.component.formSubmitted).toBe(true);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      spectator.detectChanges();
      const destroySpy = jest.spyOn(spectator.component['destroy$'], 'next');

      spectator.component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
    });

    it('should not leak memory after destroy', () => {
      spectator.detectChanges();

      let destroyCalled = false;

      spectator.component['destroy$'].subscribe({
        next: () => {
          destroyCalled = true;
        },
      });

      spectator.component.ngOnDestroy();

      expect(destroyCalled).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should handle extreme values gracefully', () => {
      expect(
        spectator.component.calculateVIFormula(999_999, 1000)
      ).not.toBeNaN();

      expect(spectator.component.calculateVIFormula(10, 3)).not.toBeNaN();
    });

    it('should handle decimal values correctly', () => {
      const result = spectator.component.calculateVIFormula(80.5, 10);
      expect(result).not.toBeNaN();
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should maintain form state consistency', () => {
      spectator.component.v40.setValue(80);
      spectator.component.v100.setValue(50);

      expect(spectator.component.viForm.value).toEqual({
        v40: 80,
        v100: 50,
      });
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should calculate VI correctly for complete workflow', () => {
      spectator.component.v40.setValue(100);
      spectator.component.v100.setValue(10);

      spectator.component.onSubmit();

      expect(spectator.component.formSubmitted).toBe(true);
      expect(spectator.component.viForm.valid).toBe(true);
      expect(spectator.component.viWert).toBe(74);
    });

    it('should handle invalid form submission gracefully', () => {
      spectator.component.v40.setValue(50);
      spectator.component.v100.setValue(60);

      spectator.component.onSubmit();

      expect(spectator.component.formSubmitted).toBe(true);
      expect(spectator.component.viForm.valid).toBe(false);
      expect(spectator.component.viWert).toBeUndefined();
    });

    it('should recalculate when form values change after submission', () => {
      spectator.component.v40.setValue(100);
      spectator.component.v100.setValue(10);
      spectator.component.onSubmit();
      const initialVI = spectator.component.viWert;

      spectator.component.v40.setValue(150);

      expect(spectator.component.viWert).not.toBe(initialVI);
    });
  });
});
