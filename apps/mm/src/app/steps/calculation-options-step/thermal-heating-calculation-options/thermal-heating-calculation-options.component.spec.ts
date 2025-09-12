import { signal, WritableSignal } from '@angular/core';

import { of } from 'rxjs';

import { CalculationOptionsFacade } from '@mm/core/store/facades/calculation-options/calculation-options.facade';
import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';
import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ThermalCalculationOptionsFormData } from '../calculation-selection-step.interface';
import { ThermalHeatingCalculationOptionsComponent } from './thermal-heating-calculation-options.component';

describe('ThermalHeatingCalculationOptionsComponent', () => {
  let component: ThermalHeatingCalculationOptionsComponent;
  let spectator: Spectator<ThermalHeatingCalculationOptionsComponent>;

  let thermalOptionsSignal: WritableSignal<ThermalCalculationOptionsFormData>;

  const createComponent = createComponentFactory({
    component: ThermalHeatingCalculationOptionsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: CalculationSelectionFacade,
        useValue: {
          resultStepIndex: signal(0),
          setCurrentStep: jest.fn(),
        },
      },
      {
        provide: CalculationOptionsFacade,
        useFactory: () => {
          thermalOptionsSignal = signal<
            ThermalCalculationOptionsFormData | undefined
            // eslint-disable-next-line unicorn/no-useless-undefined
          >(undefined);

          return {
            thermalOptions: thermalOptionsSignal.asReadonly(),
            toleranceClasses: signal([]),
            updateToleranceClasses: jest.fn(),
            updateThermalOptionsFromFormData: jest.fn(),
          };
        },
      },
      {
        provide: CalculationResultFacade,
        useValue: {
          isResultAvailable$: of(false),
          calculateThermalResultFromForm: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should update deviation controls if upper deviation is different', () => {
      component.lowerDeviationControl.setValue = jest.fn();
      component.upperDeviationControl.setValue = jest.fn();

      thermalOptionsSignal.set({
        temperature: 20,
        upperDeviation: 5,
        lowerDeviation: 0,
        toleranceClass: 'none',
      });
      spectator.detectChanges();

      expect(component.upperDeviationControl.setValue).toHaveBeenCalledWith(5, {
        onlySelf: true,
      });
      expect(component.lowerDeviationControl.setValue).toHaveBeenCalledWith(0, {
        onlySelf: true,
      });
    });

    it('should update deviation controls if lower deviation is different', () => {
      component.lowerDeviationControl.setValue = jest.fn();
      component.upperDeviationControl.setValue = jest.fn();

      thermalOptionsSignal.set({
        temperature: 20,
        upperDeviation: 0,
        lowerDeviation: 3,
        toleranceClass: 'none',
      });
      spectator.detectChanges();

      expect(component.upperDeviationControl.setValue).toHaveBeenCalledWith(0, {
        onlySelf: true,
      });
      expect(component.lowerDeviationControl.setValue).toHaveBeenCalledWith(3, {
        onlySelf: true,
      });
    });

    it('should not update deviation controls if thermal options are not set', () => {
      component.lowerDeviationControl.setValue = jest.fn();
      component.upperDeviationControl.setValue = jest.fn();

      thermalOptionsSignal.set(undefined);
      spectator.detectChanges();

      expect(component.upperDeviationControl.setValue).not.toHaveBeenCalled();
      expect(component.lowerDeviationControl.setValue).not.toHaveBeenCalled();
    });

    it('should not update deviation controls if thermal options are equal to form value', () => {
      component.lowerDeviationControl.setValue = jest.fn();
      component.upperDeviationControl.setValue = jest.fn();

      thermalOptionsSignal.set({
        temperature: 20,
        upperDeviation: 0,
        lowerDeviation: 0,
        toleranceClass: 'none',
      });
      spectator.detectChanges();

      expect(component.upperDeviationControl.setValue).not.toHaveBeenCalled();
      expect(component.lowerDeviationControl.setValue).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should update tolerance classes', () => {
      component.form.markAsTouched = jest.fn();
      component.form.updateValueAndValidity = jest.fn();

      component.ngOnInit();

      expect(
        component['calculationOptionsFacade'].updateToleranceClasses
      ).toHaveBeenCalled();
      expect(component.form.markAsTouched).toHaveBeenCalled();
      expect(component.form.updateValueAndValidity).toHaveBeenCalled();
    });

    it('should subscribe to tolerance class changes', () => {
      component.upperDeviationControl.enable = jest.fn();
      component.lowerDeviationControl.enable = jest.fn();
      component.upperDeviationControl.disable = jest.fn();
      component.lowerDeviationControl.disable = jest.fn();

      component.toleranceClassControl.setValue('none');
      expect(component.upperDeviationControl.enable).toHaveBeenCalled();
      expect(component.lowerDeviationControl.enable).toHaveBeenCalled();

      component.toleranceClassControl.setValue('class1');
      expect(component.upperDeviationControl.disable).toHaveBeenCalled();
      expect(component.lowerDeviationControl.disable).toHaveBeenCalled();
    });

    it('should subscribe to form value changes', () => {
      const formData = {
        temperature: 20,
        upperDeviation: 5,
        lowerDeviation: 0,
        toleranceClass: 'none',
      };

      jest.useFakeTimers();

      component.ngOnInit();

      component.form.setValue(formData);

      jest.advanceTimersByTime(500);

      jest.useRealTimers();

      expect(
        component['calculationOptionsFacade'].updateThermalOptionsFromFormData
      ).toHaveBeenCalledWith(formData);
      expect(
        component['calculationResultFacade'].calculateThermalResultFromForm
      ).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should set current step to result step index', () => {
      component.onSubmit();

      expect(
        component['calculationSelectionFacade'].setCurrentStep
      ).toHaveBeenCalledWith(0);
    });
  });
});
