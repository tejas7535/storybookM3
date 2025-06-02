import { FormControl, FormGroup } from '@angular/forms';

import { Stub } from '../../../../test/stub.class';
import { SingleAutocompletePreLoadedComponent } from './single-autocomplete-pre-loaded.component';

describe('SingleAutocompletePreLoadedComponent', () => {
  let component: SingleAutocompletePreLoadedComponent;

  beforeEach(() => {
    component = Stub.getForEffect<SingleAutocompletePreLoadedComponent>({
      component: SingleAutocompletePreLoadedComponent,
    });

    Stub.setInputs([
      { property: 'control', value: new FormControl() },
      {
        property: 'optionsLoadingResult',
        value: { options: [], loading: false, loadingError: null },
      },
      { property: 'form', value: new FormGroup({}) },
      { property: 'label', value: 'label' },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('optionsLoadingResult effect', () => {
    it('should update options when optionsLoadingResult changes', () => {
      const mockOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];

      const spy = jest.spyOn(component as any, 'extractOptions');

      Stub.setInputs([
        {
          property: 'optionsLoadingResult',
          value: { options: mockOptions, loading: false, loadingError: null },
        },
      ]);
      Stub.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect((component as any).options()).toEqual(mockOptions);
    });

    it('should not extract options if they are the same', () => {
      const mockOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];

      // Set initial options
      Stub.setInputs([
        {
          property: 'optionsLoadingResult',
          value: { options: mockOptions, loading: false, loadingError: null },
        },
      ]);
      Stub.detectChanges();

      const spy = jest.spyOn(component as any, 'extractOptions').mockClear();
      const fixSpy = jest.spyOn(component as any, 'fixSelectedOption');

      // Set the same options again
      Stub.setInputs([
        {
          property: 'optionsLoadingResult',
          value: { options: mockOptions, loading: false, loadingError: null },
        },
      ]);
      Stub.detectChanges();

      expect(spy).not.toHaveBeenCalled();
      expect(fixSpy).toHaveBeenCalled();
    });
  });

  describe('onSearchControlChange$', () => {
    it('should filter options based on search string', () => {
      const mockOptions = [
        { id: '1', text: 'Apple' },
        { id: '2', text: 'Banana' },
        { id: '3', text: 'Orange' },
      ];

      (component as any).options.set(mockOptions);

      (component as any).onSearchControlChange$('app').subscribe();

      expect((component as any).filteredOptions().length).toBe(1);
      expect((component as any).filteredOptions()[0].text).toBe('Apple');
    });

    it('should return all options if search string is empty', () => {
      const mockOptions = [
        { id: '1', text: 'Apple' },
        { id: '2', text: 'Banana' },
      ];

      (component as any).options.set(mockOptions);

      (component as any).onSearchControlChange$('').subscribe();

      expect((component as any).filteredOptions().length).toBe(2);
    });
  });

  describe('onOptionSelected', () => {
    it('should emit selection change event when valid option is selected', () => {
      const mockOption = { id: '1', text: 'Option 1' };
      const emitSpy = jest.spyOn(component.onSelectionChange, 'emit');

      component.control().setValue(mockOption);
      (component as any).onOptionSelected();

      expect(emitSpy).toHaveBeenCalledWith({ option: mockOption });
      expect(component['value']).toEqual(mockOption);
    });

    it('should not emit if selected value is not a SelectableValue', () => {
      const emitSpy = jest.spyOn(component.onSelectionChange, 'emit');

      component.control().setValue('not a selectable value');
      (component as any).onOptionSelected();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('transformInputToSelectableValue', () => {
    it('should transform string input to SelectableValue if match is found', () => {
      const mockOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];

      (component as any).options.set(mockOptions);
      component.control().setValue('1');

      (component as any).transformInputToSelectableValue();

      expect(component.control().value).toEqual(mockOptions[0]);
      expect(component['value']).toEqual(mockOptions[0]);
    });

    it('should not transform if input is already a SelectableValue', () => {
      const mockOption = { id: '1', text: 'Option 1' };

      component.control().setValue(mockOption);
      const setValue = jest.spyOn(component.control(), 'setValue');

      (component as any).transformInputToSelectableValue();

      expect(setValue).not.toHaveBeenCalled();
    });
  });

  describe('resetOptions', () => {
    it('should reset filtered options and fix selected option', () => {
      const searchSpy = jest
        .spyOn(component as any, 'onSearchControlChange$')
        .mockReturnValue({ pipe: () => ({ subscribe: () => {} }) } as any);

      (component as any).resetOptions();

      expect(searchSpy).toHaveBeenCalledWith('');
    });
  });

  describe('extractOptions', () => {
    it('should set options, loading state, and loadingError', () => {
      const mockOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      const optionsResult = {
        options: mockOptions,
        loading: true,
        loadingError: 'Some error',
      };

      const resetSpy = jest.spyOn(component as any, 'resetOptions');

      (component as any).optionsLoadingResult = () => optionsResult;
      (component as any).extractOptions();

      expect((component as any).options()).toEqual(mockOptions);
      expect(component['loading']()).toBe(true);
      expect(component['loadingError']()).toBe('Some error');
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should handle undefined optionsLoadingResult', () => {
      const resetSpy = jest.spyOn(component as any, 'resetOptions');

      (component as any).optionsLoadingResult = () => {};
      (component as any).extractOptions();

      expect((component as any).options()).toEqual([]);
      expect(component['loading']()).toBe(false);
      expect(component['loadingError']()).toBe(null);
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('fixSelectedOption', () => {
    it('should select matching option in MatOption list', () => {
      const mockOption = { id: '1', text: 'Option 1' };
      const mockMatOptions = [
        { value: mockOption, select: jest.fn() },
        { value: { id: '2', text: 'Option 2' }, select: jest.fn() },
      ];

      // Mock the htmlOptions signal
      (component as any).htmlOptions = () => mockMatOptions;
      // Set the selected value
      component.control().setValue(mockOption);

      (component as any).fixSelectedOption();

      expect(mockMatOptions[0].select).toHaveBeenCalledWith(true);
      expect(mockMatOptions[1].select).not.toHaveBeenCalled();
    });

    it('should not select any option if value has no id', () => {
      const mockMatOptions = [
        { value: { id: '1', text: 'Option 1' }, select: jest.fn() },
        { value: { id: '2', text: 'Option 2' }, select: jest.fn() },
      ];

      // Mock the htmlOptions signal
      (component as any).htmlOptions = () => mockMatOptions;
      // Set the selected value without an id
      component.control().setValue({ text: 'No ID' } as any);

      (component as any).fixSelectedOption();

      expect(mockMatOptions[0].select).not.toHaveBeenCalled();
      expect(mockMatOptions[1].select).not.toHaveBeenCalled();
    });

    it('should not select any option if matOption has no value', () => {
      const mockOption = { id: '1', text: 'Option 1' };
      const mockMatOptions = [
        { value: null, select: jest.fn() } as any,
        { value: undefined, select: jest.fn() },
      ];

      // Mock the htmlOptions signal
      (component as any).htmlOptions = () => mockMatOptions;
      // Set the selected value
      component.control().setValue(mockOption);

      (component as any).fixSelectedOption();

      expect(mockMatOptions[0].select).not.toHaveBeenCalled();
      expect(mockMatOptions[1].select).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should transform input to selectable value and call parent ngOnInit', () => {
      const transformSpy = jest.spyOn(
        component as any,
        'transformInputToSelectableValue'
      );
      const superInitSpy = jest.spyOn(
        Object.getPrototypeOf(component as any),
        'ngOnInit'
      );

      component.ngOnInit();

      expect(transformSpy).toHaveBeenCalled();
      expect(superInitSpy).toHaveBeenCalled();
    });
  });

  describe('component initialization', () => {
    it('should have isPreloaded set to true', () => {
      expect((component as any).isPreloaded).toBe(true);
    });

    it('should initialize with empty filteredOptions', () => {
      expect((component as any).filteredOptions()).toEqual([]);
    });

    it('should have a default displayFn', () => {
      const option = { id: '1', text: 'Test' };
      const defaultFn = (component as any).displayFn();

      expect(defaultFn(option)).toBe('Test');
      expect(defaultFn()).toBe('');
      expect(defaultFn(null)).toBe('');
      expect(defaultFn({ id: '1' })).toBe('');
    });
  });
});
