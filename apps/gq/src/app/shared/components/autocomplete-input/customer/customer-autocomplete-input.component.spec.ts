import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterNames } from '../filter-names.enum';
import { NoResultsFoundPipe } from '../pipes/no-results-found.pipe';
import { CustomerAutoCompleteInputComponent } from './customer-autocomplete-input.component';

describe('CustomerAutoCompleteInputComponent', () => {
  let spectator: Spectator<CustomerAutoCompleteInputComponent>;
  let component: CustomerAutoCompleteInputComponent;

  const createComponent = createComponentFactory({
    component: CustomerAutoCompleteInputComponent,
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

  test('should set correct filter name', () => {
    expect(component.filterName).toEqual(FilterNames.CUSTOMER);
  });

  describe('shouldEmitAutocomplete', () => {
    test('should return true if of type string and no pipe', () => {
      const value = 'test';

      const result = component['shouldEmitAutocomplete'](value);

      expect(result).toBeTruthy();
    });

    test('should return false if type of value not string', () => {
      const value = {};

      const result = component['shouldEmitAutocomplete'](value as string);

      expect(result).toBeFalsy();
    });

    test('should return false if pipe is used', () => {
      const value = 'lets | go';

      const result = component['shouldEmitAutocomplete'](value as string);

      expect(result).toBeFalsy();
    });
  });

  describe('transformFormValue', () => {
    test('should return id if id is not true', () => {
      const idValue = {
        id: '',
        value: 'ga',
        selected: false,
      };

      const result = component['transformFormValue'](idValue);

      expect(result).toEqual(idValue.id);
    });

    test('should return id and value if value avl', () => {
      const idValue = {
        id: 'test',
        value: 'ga',
        selected: false,
      };

      const result = component['transformFormValue'](idValue);

      expect(result).toEqual(`${idValue.id} | ${idValue.value}`);
    });

    test('should return id, value and value2 if all avl', () => {
      const idValue = {
        id: 'test',
        value: 'ga',
        value2: 'ah',
        selected: false,
      };

      const result = component['transformFormValue'](idValue);

      expect(result).toEqual(
        `${idValue.id} | ${idValue.value} | ${idValue.value2}`
      );
    });

    test('should only return id if rest is not set', () => {
      const idValue = {
        id: 'test',
        value: '',
        value2: '',
        selected: false,
      };

      const result = component['transformFormValue'](idValue);

      expect(result).toEqual('test');
    });
  });

  describe('onOptionsChange', () => {
    test('should autoselect option', () => {
      const options = [{ id: '1', value: '2', selected: false }];

      component.autocompleteOptions = [];
      component.added.emit = jest.fn();

      component['onOptionsChange'](undefined, options);

      expect(component.added.emit).toHaveBeenCalledWith(
        component.selectedIdValue
      );
      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.autocompleteOptions).toEqual([]);
    });

    test('should not autoselect if multiple options avl', () => {
      const options = [
        { id: '1', value: '2', selected: true },
        { id: '23', value: '24', selected: false },
      ];

      component.autocompleteOptions = [options[0]];
      component.added.emit = jest.fn();

      component['onOptionsChange'](undefined, options);

      expect(component.added.emit).not.toHaveBeenCalled();
      expect(component.autocompleteOptions).toEqual([options[1]]);
    });

    test('should not autoselect if multiple unselected options avl', () => {
      const options = [
        { id: '3', value: '4', selected: false },
        { id: '1', value: '2', selected: false },
      ];

      component.autocompleteOptions = [];
      component.added.emit = jest.fn();

      component['onOptionsChange'](undefined, options);

      expect(component.added.emit).not.toHaveBeenCalled();
      expect(component.autocompleteOptions).toEqual(options);
    });
  });
});
