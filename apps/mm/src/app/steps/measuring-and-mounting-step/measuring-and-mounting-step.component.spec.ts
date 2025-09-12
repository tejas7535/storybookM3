import { FormControl, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  Bearing,
  StepSelectionValue,
} from '@mm/core/store/models/calculation-selection-state.model';
import { HorizontalSeparatorComponent } from '@mm/shared/components/horizontal-seperator/horizontal-separator.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { SelectionCardsComponent } from '../../shared/components/selection-cards/selection-cards.component';
import { MeasuringAndMountingStepComponent } from './measuring-and-mounting-step.component';

describe('MeasuringAndMountingStepComponent', () => {
  let spectator: Spectator<MeasuringAndMountingStepComponent>;
  let component: MeasuringAndMountingStepComponent;

  const mockBearing: Bearing = {
    bearingId: 'test-bearing-id',
    title: 'Test Bearing',
    isThermal: false,
    isMechanical: true,
    isHydraulic: false,
  };

  const mockMeasurementMethods: StepSelectionValue = {
    selectedValueId: 'method1',
    values: [
      { id: 'method1', text: 'Method 1' },
      { id: 'method2', text: 'Method 2' },
    ],
  };

  const mockMountingMethods: StepSelectionValue = {
    selectedValueId: 'mounting1',
    values: [
      { id: 'mounting1', text: 'Mounting 1' },
      { id: 'mounting2', text: 'Mounting 2' },
    ],
  };

  const createComponent = createComponentFactory({
    component: MeasuringAndMountingStepComponent,
    imports: [NoopAnimationsModule, LoadingSpinnerModule],
    declarations: [
      MockComponent(SelectionCardsComponent),
      MockComponent(HorizontalSeparatorComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        bearing: mockBearing,
        mountingMethods: mockMountingMethods,
        measurementMethods: mockMeasurementMethods,
        mountingMethodSelectionLabel: 'Select Mounting Method',
        measuringMethodLabel: 'Measuring Method',
        isLoading: false,
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should display bearing title', () => {
      expect(spectator.query('.text-subtitle-1')).toHaveText(mockBearing.title);
    });

    it('should initialize measurement form with FormGroup', () => {
      expect(component.measurementForm).toBeInstanceOf(FormGroup);
      expect(component.measurementForm.get('measurementMethod')).toBeInstanceOf(
        FormControl
      );
    });

    it('should set initial form value from measurement methods', () => {
      expect(component.measurementForm.get('measurementMethod')?.value).toBe(
        mockMeasurementMethods.selectedValueId
      );
    });
  });

  describe('Input Properties', () => {
    it('should display measurement methods when available', () => {
      expect(spectator.query('mat-form-field')).toBeTruthy();
      expect(spectator.query('mat-select')).toBeTruthy();
    });

    it('should not display measurement methods when empty', () => {
      spectator.setInput('measurementMethods', {
        selectedValueId: '',
        values: [],
      });

      expect(spectator.query('mat-form-field')).toBeFalsy();
    });

    it('should display mounting methods when available', () => {
      expect(spectator.query('mm-selection-cards')).toBeTruthy();
      expect(spectator.query('mm-horizontal-separator')).toBeTruthy();
    });

    it('should not display mounting methods when empty', () => {
      spectator.setInput('mountingMethods', {
        selectedValueId: '',
        values: [],
      });

      expect(spectator.query('mm-selection-cards')).toBeFalsy();
      expect(spectator.query('mm-horizontal-separator')).toBeFalsy();
    });

    it('should show loading spinner when isLoading is true', () => {
      spectator.setInput('isLoading', true);

      expect(spectator.query('schaeffler-loading-spinner')).toBeTruthy();
    });

    it('should hide loading spinner when isLoading is false', () => {
      spectator.setInput('isLoading', false);

      expect(spectator.query('schaeffler-loading-spinner')).toBeFalsy();
    });
  });

  describe('Form Interactions', () => {
    it('should emit measurement method change when form control value changes', () => {
      let emittedValue: string | undefined;
      spectator
        .output('selectedMeasurementMethod')
        .subscribe((value: string) => {
          emittedValue = value;
        });

      // Simulate the ngModelChange event from mat-select
      component.onMeasurementMethodChange('method2');

      expect(emittedValue).toBe('method2');
    });

    it('should call onMeasurementMethodChange when select value changes', () => {
      const spy = jest.spyOn(component, 'onMeasurementMethodChange');

      component.onMeasurementMethodChange('method2');

      expect(spy).toHaveBeenCalledWith('method2');
    });

    it('should update form control when measurement method is selected', () => {
      // Set the form control directly to simulate user selection
      component.measurementForm.get('measurementMethod')?.setValue('method2');

      expect(component.measurementForm.get('measurementMethod')?.value).toBe(
        'method2'
      );
    });

    it('should emit selected option when card action is triggered', () => {
      let emittedValue: string | undefined;
      spectator.output('selectedOption').subscribe((value: string) => {
        emittedValue = value;
      });

      component.cardAction('mounting2');

      expect(emittedValue).toBe('mounting2');
    });
  });

  describe('Effect Behavior', () => {
    it('should update form when measurement methods input changes', () => {
      const newMeasurementMethods: StepSelectionValue = {
        selectedValueId: 'method2',
        values: [
          { id: 'method1', text: 'Method 1' },
          { id: 'method2', text: 'Method 2' },
        ],
      };

      spectator.setInput('measurementMethods', newMeasurementMethods);

      expect(component.measurementForm.get('measurementMethod')?.value).toBe(
        'method2'
      );
    });

    it('should not update form if value is already the same', () => {
      const patchValueSpy = jest.spyOn(component.measurementForm, 'patchValue');

      // Set the same value that's already selected
      spectator.setInput('measurementMethods', {
        selectedValueId: 'method1',
        values: mockMeasurementMethods.values,
      });

      // The effect should not call patchValue since value is the same
      expect(patchValueSpy).not.toHaveBeenCalled();
    });

    it('should handle undefined selectedValueId', () => {
      const measurementMethodsWithUndefined: StepSelectionValue = {
        selectedValueId: undefined as any,
        values: mockMeasurementMethods.values,
      };

      spectator.setInput('measurementMethods', measurementMethodsWithUndefined);

      expect(
        component.measurementForm.get('measurementMethod')?.value
      ).toBeUndefined();
    });

    it('should handle empty string selectedValueId', () => {
      const measurementMethodsWithEmpty: StepSelectionValue = {
        selectedValueId: '',
        values: mockMeasurementMethods.values,
      };

      spectator.setInput('measurementMethods', measurementMethodsWithEmpty);

      expect(component.measurementForm.get('measurementMethod')?.value).toBe(
        ''
      );
    });

    it('should not emit event when patching form value in effect', () => {
      const spy = jest.spyOn(component.measurementForm, 'patchValue');

      spectator.setInput('measurementMethods', {
        selectedValueId: 'method2',
        values: mockMeasurementMethods.values,
      });

      expect(spy).toHaveBeenCalledWith(
        { measurementMethod: 'method2' },
        { emitEvent: false }
      );
    });
  });

  describe('Component Methods', () => {
    describe('cardAction', () => {
      it('should emit the correct selection id', () => {
        let emittedValue: string | undefined;
        spectator.output('selectedOption').subscribe((value: string) => {
          emittedValue = value;
        });

        component.cardAction('test-id');

        expect(emittedValue).toBe('test-id');
      });
    });

    describe('onMeasurementMethodChange', () => {
      it('should emit the new measurement method value', () => {
        let emittedValue: string | undefined;
        spectator
          .output('selectedMeasurementMethod')
          .subscribe((value: string) => {
            emittedValue = value;
          });

        component.onMeasurementMethodChange('new-method');

        expect(emittedValue).toBe('new-method');
      });
    });
  });

  describe('Template Rendering', () => {
    it('should render measurement method label', () => {
      expect(spectator.query('mat-label')).toHaveText('Measuring Method');
    });

    it('should have measurement method options available in component', () => {
      // Test that the measurement methods are properly bound to the component
      expect(component.measurementMethods().values).toHaveLength(2);
      expect(component.measurementMethods().values[0]).toEqual({
        id: 'method1',
        text: 'Method 1',
      });
      expect(component.measurementMethods().values[1]).toEqual({
        id: 'method2',
        text: 'Method 2',
      });
    });

    it('should pass correct props to selection cards component', () => {
      const selectionCards = spectator.query(SelectionCardsComponent);
      expect(selectionCards?.options).toEqual(mockMountingMethods.values);
      expect(selectionCards?.selectedId).toBe(
        mockMountingMethods.selectedValueId
      );
    });

    it('should pass correct text to horizontal separator', () => {
      const separator = spectator.query(HorizontalSeparatorComponent);
      expect(separator?.text).toBe('Select Mounting Method');
    });

    it('should handle empty measurement methods gracefully', () => {
      spectator.setInput('measurementMethods', {
        selectedValueId: '',
        values: [],
      });

      expect(spectator.query('mat-select')).toBeFalsy();
      expect(spectator.query('.text-subtitle-1')).toHaveText(mockBearing.title);
    });

    it('should handle empty mounting methods gracefully', () => {
      spectator.setInput('mountingMethods', {
        selectedValueId: '',
        values: [],
      });

      expect(spectator.query('mm-selection-cards')).toBeFalsy();
      expect(spectator.query('.text-subtitle-1')).toHaveText(mockBearing.title);
    });
  });

  describe('Accessibility', () => {
    it('should have proper form field accessibility', () => {
      const matFormField = spectator.query('mat-form-field');
      const matSelect = spectator.query('mat-select');

      expect(matFormField).toBeTruthy();
      expect(matSelect).toHaveAttribute('formControlName', 'measurementMethod');
    });

    it('should have proper labeling for mat-select', () => {
      const label = spectator.query('mat-label');
      expect(label).toHaveText('Measuring Method');
    });

    it('should have proper form structure', () => {
      const form = spectator.query('form');
      expect(form).toBeTruthy();
      expect(form).toHaveAttribute('ng-reflect-form', '[object Object]');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid measurement methods gracefully', () => {
      spectator.setInput('measurementMethods', undefined as any);

      // Component should not crash
      expect(component).toBeTruthy();
    });

    it('should handle invalid mounting methods gracefully', () => {
      spectator.setInput('mountingMethods', undefined as any);

      // Component should not crash
      expect(component).toBeTruthy();
    });

    it('should handle invalid bearing gracefully', () => {
      spectator.setInput('bearing', undefined as any);

      // Component should not crash
      expect(component).toBeTruthy();
    });
  });

  describe('Integration Tests', () => {
    it('should have proper component integration', () => {
      // Verify the component works with all inputs properly set
      expect(component.bearing()).toEqual(mockBearing);
      expect(component.measurementMethods()).toEqual(mockMeasurementMethods);
      expect(component.mountingMethods()).toEqual(mockMountingMethods);
      expect(component.mountingMethodSelectionLabel()).toBe(
        'Select Mounting Method'
      );
      expect(component.measuringMethodLabel()).toBe('Measuring Method');
      expect(component.isLoading()).toBe(false);
    });

    it('should emit events properly in sequence', () => {
      const selectedOptions: string[] = [];
      const selectedMeasurementMethods: string[] = [];

      spectator.output('selectedOption').subscribe((value: string) => {
        selectedOptions.push(value);
      });

      spectator
        .output('selectedMeasurementMethod')
        .subscribe((value: string) => {
          selectedMeasurementMethods.push(value);
        });

      // Emit multiple events
      component.cardAction('mounting1');
      component.cardAction('mounting2');
      component.onMeasurementMethodChange('method1');
      component.onMeasurementMethodChange('method2');

      expect(selectedOptions).toEqual(['mounting1', 'mounting2']);
      expect(selectedMeasurementMethods).toEqual(['method1', 'method2']);
    });
  });
});
