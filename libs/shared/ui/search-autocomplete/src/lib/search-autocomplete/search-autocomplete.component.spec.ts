import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';

import { SearchAutocompleteOption } from './search-autocomple-option.model';
import { SearchAutocompleteComponent } from './search-autocomplete.component';

const mockFn = () => {};

describe('SearchAutocompleteComponent', () => {
  let component: SearchAutocompleteComponent;
  let spectator: Spectator<SearchAutocompleteComponent>;

  const createComponent = createComponentFactory({
    component: SearchAutocompleteComponent,
    imports: [
      BrowserAnimationsModule,
      MatAutocompleteModule,
      ReactiveFormsModule,
      MatProgressSpinnerModule,
      MatFormFieldModule,
      MatInputModule,
      PushModule,
      MatIconModule,
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [SearchAutocompleteComponent],
  });

  const expectedSelection: SearchAutocompleteOption = {
    title: 'Selection',
    id: 'sel',
  };
  const optionsVerA: SearchAutocompleteOption[] = [
    expectedSelection,
    {
      title: 'test1',
      id: 'test1',
    },
    {
      title: 'test2',
      id: 'test2',
    },
    {
      title: 'test3',
      id: 'test3',
    },
    {
      title: 'test4',
      id: 'test4',
    },
  ];
  const optionsVerB = [
    expectedSelection,
    { title: 'Bearing A1', id: 'A1' },
    { title: 'Bearing B2', id: 'B2' },
    { title: 'Bearing C3', id: 'C3' },
    { title: 'Bearing D4', id: 'D4' },
    { title: 'Bearing E5', id: 'E5' },
    { title: 'Bearing F6', id: 'F6' },
    { title: 'Bearing G7', id: 'G7' },
    { title: 'Bearing H8', id: 'H8' },
    { title: 'Bearing XX', id: 'XX' },
  ];

  beforeEach(() => {
    spectator = createComponent({
      props: { control: new UntypedFormControl() },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('optionList handling', () => {
    it('should filter the list based on input', () => {
      component.filteredOptions$.subscribe((list) => {
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual(expectedSelection);
      });

      spectator.setInput({ options: optionsVerA });
      component.control.setValue('sel');
    });

    it('should handle option list update', () => {
      component.options = optionsVerA;
      expect(component.options).toEqual(optionsVerA);
      spectator.setInput({ options: optionsVerB });
      spectator.detectChanges();
      expect(component.options).toEqual(optionsVerB);
    });

    it('should show options when minimumChars is reached', () => {
      component.minimumChars = 3;
      component.showOptions$.subscribe((val) => {
        expect(val).toEqual(true);
      });

      component.control.setValue(
        'test value that is quite definitely longer than three chars, I mean I think that is pretty obvious but you are entitled to your own opinion'
      );
    });
  });

  describe('clearing input', () => {
    it('should clear strings', () => {
      component.control.setValue('testInput');
      expect(component.control.value).toEqual('testInput');

      component.clearSearchString();
      expect(component.control.value).toEqual('');
    });

    it('should clear searchAutocompleteOptions', () => {
      const testVal = { id: 'test', title: 'test' };
      component.control.setValue(testVal);
      expect(component.control.value).toEqual(testVal);

      component.clearSearchString();
      expect(component.control.value).toEqual('');
    });
  });

  describe('selection', () => {
    it('should emit the selected option', () => {
      component.options = optionsVerB;
      component.selection.subscribe((optionId: string) => {
        expect(optionId).toEqual(expectedSelection.id);
      });
      component.select(expectedSelection);
    });
  });

  describe('ControlValueAccesor functions', () => {
    it('should set value through writeValue', () => {
      const mockValue = 'mockValueString';

      component.writeValue(mockValue);
      expect(component.control.value).toEqual(mockValue);
    });

    it('should register supplied fn as onTouched method', () => {
      component.registerOnTouched(mockFn);
      expect(component['onTouched']).toEqual(mockFn);
    });

    it('should add a subscription during onChange fn registration', () => {
      expect(component['subscriptions'].length).toEqual(0);
      component.registerOnChange(mockFn);
      expect(component['subscriptions'].length).toEqual(1);
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toEqual(true);
    });

    it('should do a number of things through setValue', () => {
      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();

      const mockValue = {
        option: { value: { id: 'mockId', title: 'mockTitle' } },
      };
      component.setValue(mockValue);
      expect(component.control.value).toEqual(mockValue.option.value);
      expect(component.onTouched).toHaveBeenCalledTimes(1);
      expect(component.onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('trackByFn', () => {
    it('should return id', () => {
      const testVal = { id: 'test', title: 'test' };
      const result = component.trackByFn(0, testVal);

      expect(result).toEqual(testVal.id);
    });
  });

  describe('optionId', () => {
    it('should return id string', () => {
      const mockOption: SearchAutocompleteOption = {
        title: 'mock_title',
        id: 'mock_id',
      };

      const result = component.optionId(mockOption);

      expect(result).toBe('mock_id');
    });
  });

  describe('optionTitle', () => {
    it('should return sanitized string', () => {
      const mockOption: SearchAutocompleteOption = {
        title: 'Mock template &nbsp;<strong>string</strong>',
        id: 'mock_id',
      };

      const result = component.optionTitle(mockOption);

      expect(result).toBe('Mock template string');
    });
  });

  describe('noResults', () => {
    it('should return true', () => {
      const result = component.noResults([]);

      expect(result).toBe(true);
    });

    it('should return false', () => {
      const result = component.noResults(optionsVerA);

      expect(result).toBe(false);
    });
  });
});
