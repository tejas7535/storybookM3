import { FormControl, FormGroup } from '@angular/forms';

import { Stub } from '../../../../test/stub.class';
import { MultiAutocompletePreLoadedComponent } from './multi-autocomplete-pre-loaded.component';

describe('MultiAutocompletePreLoadedComponent', () => {
  let component: MultiAutocompletePreLoadedComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MultiAutocompletePreLoadedComponent>({
      component: MultiAutocompletePreLoadedComponent,
    });
    Stub.setInputs([
      { property: 'control', value: new FormControl() },
      { property: 'form', value: new FormGroup({}) },
      {
        property: 'optionsLoadingResult',
        value: { options: [], loading: false, loadingError: null },
      },
      { property: 'searchControl', value: new FormControl() },
    ]);
    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isPreloaded set to true', () => {
    expect(component['isPreloaded']).toBe(true);
  });

  it('should have addClearButton set to true by default', () => {
    expect(component.addClearButton()).toBe(true);
  });

  describe('filterOptions', () => {
    let optionsSpy: jest.SpyInstance;

    beforeEach(() => {
      optionsSpy = jest.spyOn(component['options'], 'set');

      const testOptions = [
        { id: '1', name: 'Option 1', code: 'opt1' },
        { id: '2', name: 'Option 2', code: 'opt2' },
        { id: '3', name: 'Different', code: 'diff' },
      ];

      Stub.setInputs([
        {
          property: 'optionsLoadingResult',
          value: { options: testOptions, loading: false, loadingError: null },
        },
      ]);

      // Force extractOptions to run again
      component.ngOnInit();

      Stub.detectChanges();
    });

    it('should do nothing if value is not a string', () => {
      optionsSpy.mockClear();

      component['filterOptions'](null);
      expect(optionsSpy).not.toHaveBeenCalled();
    });

    it('should filter options based on search string', () => {
      component['filterOptions']('option');

      expect(optionsSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: '1' }),
          expect.objectContaining({ id: '2' }),
        ])
      );
      expect(optionsSpy).toHaveBeenCalledWith(
        expect.not.arrayContaining([expect.objectContaining({ id: '3' })])
      );
    });

    it('should exclude already selected options', () => {
      const control = new FormControl([
        { id: '1', name: 'Option 1', code: 'opt1' },
      ]);
      Stub.setInputs([{ property: 'control', value: control }]);

      component['filterOptions']('option');

      expect(optionsSpy).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: '2' })])
      );
      expect(optionsSpy).toHaveBeenCalledWith(
        expect.not.arrayContaining([
          expect.objectContaining({ id: '1' }),
          expect.objectContaining({ id: '3' }),
        ])
      );
    });
  });

  describe('resetOptions', () => {
    it('should reset options excluding selected ones', () => {
      const testOptions = [
        { id: '1', name: 'Option 1' },
        { id: '2', name: 'Option 2' },
        { id: '3', name: 'Option 3' },
      ];

      const control = new FormControl([{ id: '1', name: 'Option 1' }]);

      Stub.setInputs([
        { property: 'control', value: control },
        {
          property: 'optionsLoadingResult',
          value: { options: testOptions, loading: false, loadingError: null },
        },
      ]);

      const optionsSpy = jest.spyOn(component['options'], 'set');
      component['resetOptions']();

      expect(optionsSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: '2' }),
          expect.objectContaining({ id: '3' }),
        ])
      );
      expect(optionsSpy).toHaveBeenCalledWith(
        expect.not.arrayContaining([expect.objectContaining({ id: '1' })])
      );
    });
  });

  describe('extractOptions', () => {
    it('should extract options and update signals', () => {
      const testOptions = [{ id: '1', name: 'Test' }];
      const optionsLoadingResult = {
        options: testOptions,
        loading: true,
        loadingError: 'Error message',
      };

      Stub.setInputs([
        { property: 'optionsLoadingResult', value: optionsLoadingResult },
      ]);

      const optionsSpy = jest.spyOn(component['options'], 'set');
      const loadingSpy = jest.spyOn(component['loading'], 'set');
      const errorSpy = jest.spyOn(component['loadingError'], 'set');

      component['extractOptions']();

      expect(optionsSpy).toHaveBeenCalledWith(testOptions);
      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(errorSpy).toHaveBeenCalledWith('Error message');
    });

    it('should handle undefined options values', () => {
      Stub.setInputs([{ property: 'optionsLoadingResult', value: {} }]);

      const optionsSpy = jest.spyOn(component['options'], 'set');
      const loadingSpy = jest.spyOn(component['loading'], 'set');
      const errorSpy = jest.spyOn(component['loadingError'], 'set');

      component['extractOptions']();

      expect(optionsSpy).toHaveBeenCalledWith(undefined);
      expect(loadingSpy).toHaveBeenCalledWith(false);
      expect(errorSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('onSearchControlChange$', () => {
    it('should filter options and return Observable', () => {
      const filterOptionsSpy = jest.spyOn(component as any, 'filterOptions');

      const result = component['onSearchControlChange$']('test');

      expect(filterOptionsSpy).toHaveBeenCalledWith('test');
      expect(result).toBeDefined();
    });
  });
});
