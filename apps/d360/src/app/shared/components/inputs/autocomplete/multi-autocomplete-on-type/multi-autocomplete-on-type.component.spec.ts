import { FormControl, FormGroup } from '@angular/forms';

import { of, throwError } from 'rxjs';

import { Stub } from '../../../../test/stub.class';
import { MultiAutocompleteOnTypeComponent } from './multi-autocomplete-on-type.component';

describe('MultiAutocompleteOnTypeComponent', () => {
  let component: MultiAutocompleteOnTypeComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MultiAutocompleteOnTypeComponent>({
      component: MultiAutocompleteOnTypeComponent,
    });
    Stub.setInputs([
      { property: 'urlBegin', value: 'https://' },
      { property: 'requestWithLang', value: true },
      { property: 'searchControl', value: new FormControl() },
      { property: 'control', value: new FormControl() },
      { property: 'form', value: new FormGroup({}) },
      {
        property: 'optionsLoadingResult',
        value: { options: [], loading: false, loadingError: null },
      },
    ]);
    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set options, loading, and loadingError from optionsLoadingResult', () => {
      jest
        .spyOn(
          Object.getPrototypeOf(Object.getPrototypeOf(component)),
          'ngOnInit'
        )
        .mockImplementation(() => {});

      const options = [{ id: '1', text: 'Option 1' }];
      const loading = false;
      const loadingError = new Error('Loading error');

      Stub.setInput('optionsLoadingResult', { options, loading, loadingError });
      Stub.detectChanges();

      component.ngOnInit();

      expect(component['options']()).toEqual(options);
      expect(component['loading']()).toBe(loading);
      expect(component['loadingError']()).toBe(loadingError);
    });

    it('should call super.ngOnInit', () => {
      const spy = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(component)),
        'ngOnInit'
      );

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('resetOptions', () => {
    it('should set options to an empty array', () => {
      component['options'].set([{ id: '1', text: 'Option 1' }]);

      component['resetOptions']();

      expect(component['options']()).toEqual([]);
    });
  });

  describe('onSearchControlChange$', () => {
    let selectableOptionsServiceMock: any;

    beforeEach(() => {
      selectableOptionsServiceMock = jest.spyOn(
        component['selectableOptionsService'],
        'getOptionsBySearchTerm'
      );
    });

    it('should reset options if search string is less than 2 characters', () => {
      const resetOptionsSpy = jest.spyOn(component as any, 'resetOptions');

      component['onSearchControlChange$']('a').subscribe();

      expect(resetOptionsSpy).toHaveBeenCalled();
      expect(selectableOptionsServiceMock).not.toHaveBeenCalled();
    });

    it('should call getOptionsBySearchTerm and set options if search string is valid', () => {
      const searchString = 'test';
      const mockOptions = [
        { id: '1', text: 'Test 1' },
        { id: '2', text: 'Test 2' },
      ];
      selectableOptionsServiceMock.mockReturnValue(of(mockOptions));
      Stub.setInput('control', new FormControl([]));
      Stub.detectChanges();

      component['onSearchControlChange$'](searchString).subscribe();

      expect(selectableOptionsServiceMock).toHaveBeenCalledWith(
        'https://',
        searchString,
        true
      );
      expect(component['options']()).toEqual(mockOptions);
      expect(component['loading']()).toBe(false);
    });

    it('should filter out already selected options', () => {
      const searchString = 'test';
      const mockOptions = [
        { id: '1', text: 'Test 1' },
        { id: '2', text: 'Test 2' },
      ];
      const selectedOptions = [{ id: '1', text: 'Test 1' }];
      selectableOptionsServiceMock.mockReturnValue(of(mockOptions));
      Stub.setInput('control', new FormControl(selectedOptions));
      Stub.detectChanges();

      component['onSearchControlChange$'](searchString).subscribe();

      expect(component['options']()).toEqual([{ id: '2', text: 'Test 2' }]);
    });

    it('should set loadingError if an error occurs', () => {
      const error = new Error('Network error');
      selectableOptionsServiceMock.mockReturnValue(throwError(() => error));
      Stub.setInput('control', new FormControl([]));
      Stub.detectChanges();

      component['onSearchControlChange$']('test').subscribe();

      expect(component['loadingError']()).toBe(error);
    });

    it('should set loading to true before the request and false after', () => {
      selectableOptionsServiceMock.mockReturnValue(of([]));
      Stub.setInput('control', new FormControl([]));
      Stub.detectChanges();
      const loadingSpy = jest.spyOn(component['loading'], 'set');

      component['onSearchControlChange$']('test').subscribe();

      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(loadingSpy).toHaveBeenLastCalledWith(false);
    });
  });

  describe('input signals', () => {
    it('should have urlBegin input signal', () => {
      expect(component.urlBegin()).toBe('https://');
    });

    it('should have requestWithLang input signal', () => {
      expect(component.requestWithLang()).toBe(true);
    });

    it('should have default displayFn that returns correct text', () => {
      const option = { id: '1', text: 'Option 1' };
      expect(component.displayFn()(option)).toBe('Option 1');
      expect(component.displayFn()('string value')).toBe('string value');
    });

    it('should have addClearButton set to true by default', () => {
      expect(component.addClearButton()).toBe(true);
    });

    it('should have addDropdownIcon set to false by default', () => {
      expect(component.addDropdownIcon()).toBe(false);
    });
  });
});
