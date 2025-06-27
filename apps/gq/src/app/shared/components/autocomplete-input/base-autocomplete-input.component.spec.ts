import { Component, SimpleChange } from '@angular/core';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormField } from '@angular/material/form-field';

import * as rxjs from 'rxjs';

import { IdValue } from '@gq/shared/models/search/id-value.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BaseAutocompleteInputComponent } from './base-autocomplete-input.component';
import { FilterNames } from './filter-names.enum';
import { NoResultsFoundPipe } from './pipes/no-results-found.pipe';

@Component({
  selector: 'gq-test-base-autocomplete-input',
})
class TestBaseAutocompleteInputComponent extends BaseAutocompleteInputComponent {
  constructor() {
    super('test' as FilterNames);
  }
}

describe('BaseAutocompleteInputComponent', () => {
  let spectator: Spectator<TestBaseAutocompleteInputComponent>;
  let component: BaseAutocompleteInputComponent;

  const createComponent = createComponentFactory({
    component: TestBaseAutocompleteInputComponent,
    declarations: [NoResultsFoundPipe],
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    jest.resetAllMocks();
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleWindowResize', () => {
    test('should set autocomplete panel width limits if panel is opened and content should fit', () => {
      jest.useFakeTimers();

      spectator.setInput('fitContent', true);
      component.autocompleteReference = {
        isOpen: true,
        panel: {
          nativeElement: {
            style: { minWidth: undefined, maxWidth: undefined },
          },
        },
      } as MatAutocomplete;

      const formFieldWidth = 500;

      component.formFieldReference = {
        getConnectedOverlayOrigin: () => ({
          nativeElement: { clientWidth: formFieldWidth },
        }),
      } as MatFormField;

      component.handleWindowResize();
      jest.runOnlyPendingTimers();

      expect(
        component.autocompleteReference.panel.nativeElement.style.minWidth
      ).toBe(`${formFieldWidth}px`);
      expect(
        component.autocompleteReference.panel.nativeElement.style.maxWidth
      ).toBe(component['AUTOCOMPLETE_PANEL_MAX_WIDTH']);

      jest.useRealTimers();
    });

    test('should not set autocomplete panel width limits if panel is not opened', () => {
      spectator.setInput('fitContent', true);
      component.autocompleteReference = {
        isOpen: false,
        panel: {
          nativeElement: {
            style: { minWidth: undefined, maxWidth: undefined },
          },
        },
      } as MatAutocomplete;

      const setAutocompletePanelWidthLimitsSpy = jest.spyOn(
        component as any,
        'setAutocompletePanelWidthLimits'
      );

      component.handleWindowResize();

      expect(setAutocompletePanelWidthLimitsSpy).not.toHaveBeenCalled();
      expect(
        component.autocompleteReference.panel.nativeElement.style.minWidth
      ).toBe(undefined);
      expect(
        component.autocompleteReference.panel.nativeElement.style.maxWidth
      ).toBe(undefined);
    });

    test('should not set autocomplete panel width limits if content should not fit', () => {
      spectator.setInput('fitContent', false);
      component.autocompleteReference = {
        isOpen: false,
        panel: {
          nativeElement: {
            style: { minWidth: undefined, maxWidth: undefined },
          },
        },
      } as MatAutocomplete;

      const setAutocompletePanelWidthLimitsSpy = jest.spyOn(
        component as any,
        'setAutocompletePanelWidthLimits'
      );

      component.handleWindowResize();

      expect(setAutocompletePanelWidthLimitsSpy).not.toHaveBeenCalled();
      expect(
        component.autocompleteReference.panel.nativeElement.style.minWidth
      ).toBe(undefined);
      expect(
        component.autocompleteReference.panel.nativeElement.style.maxWidth
      ).toBe(undefined);
    });
  });

  describe('onBlur', () => {
    test('should set value and show hint if no value and input set and autocomplete is not allowed', () => {
      const defaultVal = '23489342';
      spectator.setInput('defaultValueWhenEmptyInput', defaultVal);
      spectator.setInput('isAutocompleteSearchDisabled', true);
      component.formControl.setValue(undefined);
      component.autocompleteTrigger = {
        closePanel: jest.fn(),
      } as any;

      component.onBlur(null);

      expect(component.formControl.value).toEqual(defaultVal);
      expect(component.showDefaultValueWhenEmptyInputHint).toBeFalsy();
      expect(component.inputFocused).toBeFalsy();
      expect(component.autocompleteTrigger.closePanel).toHaveBeenCalled();
    });

    test('should do nothing when input not empty', () => {
      const defaultVal = '23489342';
      const expected = 'set';
      spectator.setInput('defaultValueWhenEmptyInput', defaultVal);
      component.formControl.setValue(expected);

      component.onBlur(null);

      expect(component.formControl.value).toEqual(expected);
      expect(component.showDefaultValueWhenEmptyInputHint).toBeFalsy();
      expect(component.inputFocused).toBeFalsy();
    });

    test('should do nothing when input undefined but not default value given', () => {
      spectator.setInput('defaultValueWhenEmptyInput', undefined);
      component.formControl.setValue(undefined);

      component.onBlur(null);

      expect(component.formControl.value).toBeUndefined();
      expect(component.showDefaultValueWhenEmptyInputHint).toBeFalsy();
      expect(component.inputFocused).toBeFalsy();
    });
  });
  describe('onFocus', () => {
    test('should set input focused', () => {
      component.inputFocused = false;

      component.onFocus(null);

      expect(component.inputFocused).toBeTruthy();
    });
  });
  describe('resetInputField', () => {
    test('should reset inputField content', () => {
      component.formControl.setValue = jest.fn();
      component.resetInputField();

      expect(component.formControl.setValue).toHaveBeenCalledTimes(1);
    });
  });
  describe('Accessor functions', () => {
    test('writeValue should set components selectedIdValue', () => {
      const testValue = { id: 'test', value: 'test' } as IdValue;
      component.writeValue(testValue);
      expect(component.selectedIdValue).toEqual(testValue);
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

    test('setDisabledState should set the disabled state to true of the searchFormControl', () => {
      component.setDisabledState(true);
      expect(component.formControl.disabled).toEqual(true);
    });
    test('setDisabledState should set the disabled state to false of the searchFormControl', () => {
      component.setDisabledState(false);
      expect(component.formControl.disabled).toEqual(false);
    });
  });
  describe('unselect', () => {
    test('should emit event', () => {
      component.unselected.emit = jest.fn();

      component.unselect();
      expect(component.unselected.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearInput', () => {
    test('should call unselect', () => {
      jest.spyOn(component.cleared, 'emit');
      component.valueInput = {
        nativeElement: { value: 'test' },
      } as unknown as any;
      component.formControl = {
        setValue: jest.fn(),
      } as unknown as any;
      component.clearInput();
      expect(component.cleared.emit).toHaveBeenCalledTimes(1);
      expect(component.valueInput.nativeElement.value).toEqual('');
      expect(component.formControl.setValue).toHaveBeenCalledTimes(1);
    });
  });

  describe('selected', () => {
    test('should emit event', () => {
      component.added.emit = jest.fn();

      component.selected({
        option: { value: 'value' },
      } as unknown as MatAutocompleteSelectedEvent);
      expect(component.added.emit).toHaveBeenCalledTimes(1);
    });
  });
  describe('ngOnChanges', () => {
    test('options change should update selections', () => {
      const options = [
        { id: '1', selected: true },
        { id: null, selected: false },
        { id: '2', selected: false },
      ];

      component.ngOnChanges({
        options: {
          currentValue: options,
          previousValue: undefined,
        } as SimpleChange,
      });

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.autocompleteOptions).toEqual([options[0], options[2]]);
    });

    test('isDisabled change should disable formControl if true', () => {
      component.formControl.disable = jest.fn();

      component.ngOnChanges({
        isDisabled: {
          currentValue: true,
          previousValue: undefined,
        } as SimpleChange,
      });

      expect(component.formControl.disable).toHaveBeenCalled();
    });

    test('isDisabled change should enable formControl if false', () => {
      component.formControl.enable = jest.fn();

      component.ngOnChanges({
        isDisabled: {
          currentValue: false,
          previousValue: undefined,
        } as SimpleChange,
      });

      expect(component.formControl.enable).toHaveBeenCalled();
    });
  });

  describe('transformFormValue', () => {
    test('should return id if idValue give', () => {
      const idValue = { id: '1', value: '2', selected: false };

      expect(component['transformFormValue'](idValue)).toEqual(idValue.id);
    });

    test('should return undefined if no idValue given', () => {
      expect(component['transformFormValue'](null)).toBeUndefined();
    });
  });

  describe('isInputValid', () => {
    test('should return valid on id value pair', () => {
      component.selectedIdValue = { id: '1' } as any;
      const result = component['isInputValid']({ value: '1 | 2' } as any);

      expect(result).toEqual(undefined);
    });
    test('should return valid on id value value2 pair', () => {
      component.selectedIdValue = { id: '1' } as any;
      const result = component['isInputValid']({ value: '1 | 2 | 3' } as any);

      expect(result).toEqual(undefined);
    });
    test('should return invalid on wrong value', () => {
      component.selectedIdValue = { id: '1' } as any;
      component.unselect = jest.fn();
      const result = component['isInputValid']({ value: '2 | 2' } as any);

      expect(component.unselect).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ invalidInput: true });
    });
  });

  describe('shouldEmitAutocomplete', () => {
    test('should return false if no value', () => {
      expect(component['shouldEmitAutocomplete'](null)).toBeFalsy();
    });

    test('should return false if value not string', () => {
      expect(component['shouldEmitAutocomplete']({} as string)).toBeFalsy();
    });

    test('should return true if value', () => {
      expect(component['shouldEmitAutocomplete']('test')).toBeTruthy();
    });
  });

  describe('onOptionsChange', () => {
    test('should set value', () => {
      component.selectedIdValue = {
        id: 'default',
        value: 'xx',
        value2: 'yy',
        selected: true,
      } as any;
      component.filterName = FilterNames.CUSTOMER;
      const expectedTransformresult = `default`;
      component.formControl.setValue = jest.fn();
      component.isValid.emit = jest.fn();
      component.inputContent.emit = jest.fn();

      component['onOptionsChange'](undefined, [component.selectedIdValue]);

      expect(component.formControl.setValue).toHaveBeenCalledTimes(1);
      expect(component.formControl.setValue).toHaveBeenCalledWith(
        expectedTransformresult,
        { emitEvent: false }
      );
      expect(component.isValid.emit).toHaveBeenCalledTimes(1);
      expect(component.inputContent.emit).toHaveBeenCalledTimes(1);
    });

    test('should call onTouch and onChange if set', () => {
      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();
      spectator.setInput('options', [new IdValue('1', 'test', true)]);

      component['onOptionsChange'](undefined, []);

      expect(component['onChange']).toHaveBeenCalled();
      expect(component['onTouched']).toHaveBeenCalled();
    });

    test('should do nothing if no id value is selected', () => {
      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();
      component.formControl.setValue = jest.fn();
      component.isValid.emit = jest.fn();
      component.inputContent.emit = jest.fn();

      component.selectedIdValue = undefined;

      component['onOptionsChange'](undefined, []);

      expect(component.formControl.setValue).not.toHaveBeenCalled();
      expect(component['onChange']).not.toHaveBeenCalled();
      expect(component['onTouched']).not.toHaveBeenCalled();
      expect(component.isValid.emit).not.toHaveBeenCalled();
      expect(component.inputContent.emit).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    test('should use isInputValid as validator', () => {
      const isInputValidSpy = jest.spyOn(component as any, 'isInputValid');

      component.ngOnInit();

      component.formControl.setValue('test');
      component.formControl.updateValueAndValidity();

      expect(isInputValidSpy).toHaveBeenCalled();
    });

    test('should not emit autocomplete but at least isValid when no value is provided', (done) => {
      spectator.setInput('options', [new IdValue('1', 'test', false)]);

      component['autocomplete'].emit = jest.fn();
      component['inputContent'].emit = jest.fn();
      component['isValid'].emit = jest.fn();

      component.ngOnInit();

      component.formControl.setValue(undefined);

      setTimeout(() => {
        expect(component.debounceIsActive).toBeTruthy();

        expect(component['autocomplete'].emit).not.toHaveBeenCalled();
        expect(component['inputContent'].emit).toHaveBeenCalledWith(false);
        expect(component['isValid'].emit).not.toHaveBeenCalled();
        done();
      }, component['DEBOUNCE_TIME_DEFAULT']);
    });

    test('should not emit autocomplete when input is not of type string', (done) => {
      spectator.setInput('options', [new IdValue('1', 'test', false)]);

      component['autocomplete'].emit = jest.fn();
      component['inputContent'].emit = jest.fn();
      component['isValid'].emit = jest.fn();

      component.ngOnInit();

      component.formControl.setValue({ test: 4 });

      setTimeout(() => {
        expect(component.debounceIsActive).toBeTruthy();

        expect(component['autocomplete'].emit).not.toHaveBeenCalled();
        expect(component['inputContent'].emit).not.toHaveBeenCalled();
        expect(component['isValid'].emit).not.toHaveBeenCalled();
        done();
      }, component['DEBOUNCE_TIME_DEFAULT']);
    });

    test('should emit after DEBOUNCE_TIME_DEFAULT when search value >1char', (done) => {
      spectator.setInput('options', [new IdValue('1', 'test', false)]);

      component.formControl.hasError = jest.fn(() => true);
      component['autocomplete'].emit = jest.fn();
      component['inputContent'].emit = jest.fn();
      component['isValid'].emit = jest.fn();
      const spy = jest.spyOn(rxjs, 'timer');

      component.ngOnInit();

      component.formControl.setValue('test');

      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith(component['DEBOUNCE_TIME_DEFAULT']);
        expect(component.debounceIsActive).toBeFalsy();

        expect(component['autocomplete'].emit).toHaveBeenCalledWith({
          searchFor: 'test',
          filter: component.filterName,
        });
        expect(component['inputContent'].emit).toHaveBeenCalled();
        expect(component['isValid'].emit).toHaveBeenCalledWith(false);
        expect(component.formControl.hasError).toHaveBeenCalledWith(
          'invalidInput'
        );
        done();
      }, component['DEBOUNCE_TIME_DEFAULT']);
    });
  });

  describe('ngAfterViewInit', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'setAutocompletePanelWidthLimits');
    });

    test('should do nothing when fitContent false', () => {
      spectator.setInput('fitContent', false);
      const open$$ = new rxjs.BehaviorSubject<any>(undefined);
      component.autocompleteReference = {
        opened: open$$.asObservable(),
        isOpen: false,
        panel: {
          nativeElement: {
            style: { minWidth: undefined, maxWidth: undefined, width: '220px' },
          },
        },
      } as MatAutocomplete;

      component.ngAfterViewInit();

      open$$.next('test');

      spectator.detectChanges();

      expect(component.autocompleteReference.panelWidth).toBeUndefined();
      expect(
        component['setAutocompletePanelWidthLimits']
      ).not.toHaveBeenCalled();
    });
    test('should set panel width limits when fitContent is true', () => {
      spectator.setInput('fitContent', true);
      const open$$ = new rxjs.BehaviorSubject<any>(undefined);
      component.autocompleteReference = {
        opened: open$$.asObservable(),
        isOpen: false,
        panel: {
          nativeElement: {
            style: { minWidth: undefined, maxWidth: undefined },
          },
        },
      } as MatAutocomplete;

      component.ngAfterViewInit();

      open$$.next('test');

      spectator.detectChanges();

      expect(component.autocompleteReference.panelWidth).toBe('auto');
      expect(component['setAutocompletePanelWidthLimits']).toHaveBeenCalled();
    });
  });
});
