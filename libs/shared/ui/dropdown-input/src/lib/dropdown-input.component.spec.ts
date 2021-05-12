import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AutocompleteSearchComponent } from './autocomplete-search/autocomplete-search.component';
import { AutocompleteSearchModule } from './autocomplete-search/autocomplete-search.module';
import { DropdownInputComponent } from './dropdown-input.component';

describe('DropdownInputComponent', () => {
  let component: DropdownInputComponent;
  let spectator: Spectator<DropdownInputComponent>;

  const createComponent = createComponentFactory({
    component: DropdownInputComponent,
    declarations: [DropdownInputComponent],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSelectModule,
      MatAutocompleteModule,
      AutocompleteSearchModule,
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onOpenedChange', () => {
    it('should add select-overlay class and focus input when panel is opened', () => {
      const mockAutocomplete = {
        focusInput: jest.fn(),
      };
      const mockSelectPanel = {
        nativeElement: {
          parentElement: {
            parentElement: {
              parentElement: {
                classList: {
                  add: jest.fn(),
                },
              },
            },
          },
        },
      };

      component.onOpenedChange(
        true,
        mockAutocomplete as unknown as AutocompleteSearchComponent,
        mockSelectPanel
      );

      expect(mockAutocomplete.focusInput).toHaveBeenCalled();
      expect(
        mockSelectPanel.nativeElement.parentElement.parentElement.parentElement
          .classList.add
      ).toHaveBeenCalledWith('select-overlay');
    });

    it('should do nothing when panel is closed', () => {
      const mockAutocomplete = {
        focusInput: jest.fn(),
      };
      const mockSelectPanel = {
        nativeElement: {
          parentElement: {
            parentElement: {
              parentElement: {
                classList: {
                  add: jest.fn(),
                },
              },
            },
          },
        },
      };

      component.onOpenedChange(
        false,
        mockAutocomplete as unknown as AutocompleteSearchComponent,
        mockSelectPanel
      );

      expect(mockAutocomplete.focusInput).not.toHaveBeenCalled();
      expect(
        mockSelectPanel.nativeElement.parentElement.parentElement.parentElement
          .classList.add
      ).not.toHaveBeenCalled();
    });
  });

  describe('events', () => {
    it('shoult emit update search event on search update', () => {
      component.updateSearch.emit = jest.fn();
      component.options = [];

      const query = 'search';
      component.onUpdateSearch(query);

      expect(component.updateSearch.emit).toHaveBeenCalledWith(query);
    });
  });

  test('writeValue set value', () => {
    component.options = [
      { id: 'mockId1', value: 'mockValue1' },
      { id: 'mockValueString', value: 'mockValue2' },
    ];

    const mockValue = 'mockValueString';
    const spy = jest.spyOn(component['cdRef'], 'markForCheck');

    component.writeValue(mockValue);
    expect(component.value).toEqual(mockValue);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('registerOnChange call onChange method', () => {
    const mockFn = () => {};

    component.registerOnChange(mockFn);
    expect(component['onChange']).toEqual(mockFn);
  });

  test('registerOnTouched call onTouched method', () => {
    const mockFn = () => {};

    component.registerOnTouched(mockFn);
    expect(component['onTouched']).toEqual(mockFn);
  });

  test('setDisabledState should set disabled var', () => {
    component.setDisabledState(false);
    expect(component.disabled).toEqual(false);
  });

  test('setValue should trigger multiple things', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const changeSpy = jest.spyOn(component, 'onChange');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const touchSpy = jest.spyOn(component, 'onTouched');

    const mockValue = { id: 'mockString', value: 'mockValue' };
    component.setValue(mockValue);
    expect(component.value).toEqual(mockValue.id);
    expect(changeSpy).toHaveBeenCalledWith(mockValue.id);
    expect(touchSpy).toHaveBeenCalledTimes(1);
  });
});
