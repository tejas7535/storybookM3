import { FormControl, FormGroup } from '@angular/forms';

import { isEmpty, of, throwError } from 'rxjs';

import { Stub } from '../../../../test/stub.class';
import { SingleAutocompleteOnTypeComponent } from './single-autocomplete-on-type.component';

describe('SingleAutocompleteOnTypeComponent', () => {
  let component: SingleAutocompleteOnTypeComponent;

  beforeEach(() => {
    component = Stub.getForEffect<SingleAutocompleteOnTypeComponent>({
      component: SingleAutocompleteOnTypeComponent,
    });

    Stub.setInputs([
      { property: 'control', value: new FormControl() },
      { property: 'urlBegin', value: 'https://' },
      { property: 'form', value: new FormGroup({}) },
      { property: 'label', value: 'label' },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('displayFn', () => {
    it('should return empty string for null value', () => {
      const result = component.displayFn()(null);
      expect(result).toBe(null);
    });

    it('should return text property for SelectableValue', () => {
      const value = { id: '1', text: 'Option 1' };
      const result = component.displayFn()(value);
      expect(result).toBe('Option 1');
    });

    it('should return string value for string input', () => {
      const value = 'Test String';
      const result = component.displayFn()(value);
      expect(result).toBe('Test String');
    });
  });

  describe('onSearchControlChange$', () => {
    let selectableOptionsServiceSpy: jest.SpyInstance;

    beforeEach(() => {
      selectableOptionsServiceSpy = jest
        .spyOn(component['selectableOptionsService'], 'getOptionsBySearchTerm')
        .mockReturnValue(of([]));
    });

    it('should not call API when search string is empty', (done) => {
      component['onSearchControlChange$']('')
        .pipe(isEmpty())
        .subscribe((empty: boolean) => {
          expect(empty).toBe(true);
          expect(selectableOptionsServiceSpy).not.toHaveBeenCalled();
          done();
        });
    });

    it('should not call API when search string is too short', (done) => {
      component['onSearchControlChange$']('a')
        .pipe(isEmpty())
        .subscribe((empty: boolean) => {
          expect(empty).toBe(true);
          expect(selectableOptionsServiceSpy).not.toHaveBeenCalled();
          done();
        });
    });

    it('should call API with correct parameters', (done) => {
      const url = 'https://';
      const searchTerm = 'test';
      selectableOptionsServiceSpy.mockReturnValue({
        pipe: () => ({ subscribe: () => {} }),
      });

      Stub.setInputs([
        { property: 'urlBegin', value: url },
        { property: 'requestWithLang', value: false },
      ]);
      Stub.detectChanges();

      component['onSearchControlChange$'](searchTerm).subscribe(() => {
        expect(selectableOptionsServiceSpy).toHaveBeenCalledWith(
          url,
          searchTerm,
          false
        );
        done();
      });
    });

    it('should set loading to true while fetching data', (done) => {
      const loadingSpy = jest.spyOn(component['loading'], 'set');
      component['onSearchControlChange$']('test').subscribe(() => {
        expect(loadingSpy).toHaveBeenCalledWith(true);
        done();
      });
    });

    it('should handle errors from API call', (done) => {
      const error = new Error('API error');
      selectableOptionsServiceSpy.mockReturnValue(throwError(() => error));

      const loadingErrorSpy = jest.spyOn(component['loadingError'], 'set');

      component['onSearchControlChange$']('test').subscribe(() => {
        expect(loadingErrorSpy).toHaveBeenCalledWith(error);
        done();
      });
    });
  });

  describe('onOptionSelected', () => {
    it('should emit selected option', () => {
      const selectedValue = { id: '1', text: 'Option 1' };
      const emitSpy = jest.spyOn(component.onSelectionChange, 'emit');

      component.control().setValue(selectedValue);
      component['onOptionSelected']();

      expect(emitSpy).toHaveBeenCalledWith({ option: selectedValue });
    });

    it('should update value property when option is selected', () => {
      const selectedValue = { id: '1', text: 'Option 1' };

      component.control().setValue(selectedValue);
      component['onOptionSelected']();

      expect(component['value']).toEqual(selectedValue);
    });

    it('should update options when selection is made', () => {
      const selectedValue = { id: '1', text: 'Option 1' };
      const filteredOptions = [selectedValue, { id: '2', text: 'Option 2' }];

      component['filteredOptions'].set(filteredOptions);
      component.control().setValue(selectedValue);

      component['onOptionSelected']();

      expect(component['options']).toEqual(filteredOptions);
    });
  });

  describe('resetOptions', () => {
    it('should restore filtered options from options', () => {
      const options = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      component['options'] = options;

      const filteredOptionsSpy = jest.spyOn(
        component['filteredOptions'],
        'set'
      );
      component['resetOptions']();

      expect(filteredOptionsSpy).toHaveBeenCalledWith(options);
    });
  });

  describe('ngOnInit', () => {
    it('should call onSearchControlChange$ when control value is not a SelectableValue', () => {
      const controlValue = 'test';
      component.control().setValue(controlValue);

      const searchSpy = jest
        .spyOn(component as any, 'onSearchControlChange$')
        .mockReturnValue({
          pipe: () => ({ subscribe: () => {} }),
        } as any);

      component.ngOnInit();

      expect(searchSpy).toHaveBeenCalledWith(controlValue, true);
    });

    it('should not call onSearchControlChange$ when control value is a SelectableValue', () => {
      const controlValue = { id: '1', text: 'Option 1' };
      component.control().setValue(controlValue);

      const searchSpy = jest.spyOn(component as any, 'onSearchControlChange$');

      component.ngOnInit();

      expect(searchSpy).not.toHaveBeenCalled();
    });
  });
});
