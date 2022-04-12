import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AutocompleteSearchComponent } from './autocomplete-search/autocomplete-search.component';
import { AutocompleteSearchModule } from './autocomplete-search/autocomplete-search.module';
import { DropdownInputComponent } from './dropdown-input.component';

describe('DropdownInputComponent', () => {
  let component: DropdownInputComponent;
  let spectator: Spectator<DropdownInputComponent>;
  let mockFn: () => any;

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
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockFn = () => {};
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
      expect(component.selectPanel).toBe(undefined);
    });

    it('should not focus on mobile', () => {
      component.isMobile = true;
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

      expect(mockAutocomplete.focusInput).not.toHaveBeenCalled();
      expect(component.selectPanel).toEqual(mockSelectPanel);
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
    expect(component.selectedItem).toEqual({
      id: 'mockValueString',
      value: 'mockValue2',
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('writeValue set null value and unset selectedItem', () => {
    component.options = [
      { id: 'mockId1', value: 'mockValue1' },
      { id: 'mockValueString', value: 'mockValue2' },
    ];

    // eslint-disable-next-line unicorn/no-null
    const mockValue = null;
    const spy = jest.spyOn(component['cdRef'], 'markForCheck');

    component.writeValue(mockValue as unknown as string);
    expect(component.value).toEqual(mockValue);
    expect(component.selectedItem).toEqual(undefined);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('registerOnChange call onChange method', () => {
    component.registerOnChange(mockFn);
    expect(component['onChange']).toEqual(mockFn);
  });

  test('registerOnTouched call onTouched method', () => {
    component.registerOnTouched(mockFn);
    expect(component['onTouched']).toEqual(mockFn);
  });

  test('setDisabledState should set disabled var', () => {
    component.setDisabledState(false);
    expect(component.disabled).toEqual(false);
  });

  test('setValue should trigger multiple things', () => {
    component['onChange'] = jest.fn();
    component['onTouched'] = jest.fn();
    const mockValue = { id: 'mockString', value: 'mockValue' };

    component.setValue(mockValue);

    expect(component.value).toEqual(mockValue.id);
    expect(component.onChange).toHaveBeenCalledWith(mockValue.id);
    expect(component.onTouched).toHaveBeenCalledTimes(1);
  });

  test('onResize', (done) => {
    const style = {
      bottom: 20,
      top: 20,
    };

    component.isMobile = true;
    component.selectPanel = {
      nativeElement: {
        parentElement: {
          parentElement: {
            style,
          },
        },
      },
    };

    component.onResize();

    setTimeout(() => {
      expect(
        component.selectPanel?.nativeElement.parentElement.parentElement.style
      ).toEqual({ bottom: 20, top: 'auto' });
      done();
    }, 200);
  });

  test('onResize with negative bot', (done) => {
    const style = {
      bottom: -20,
      top: 20,
    };

    component.isMobile = true;
    component.selectPanel = {
      nativeElement: {
        parentElement: {
          parentElement: {
            style,
          },
        },
      },
    };

    component.onResize();

    setTimeout(() => {
      expect(
        component.selectPanel?.nativeElement.parentElement.parentElement.style
      ).toEqual({ bottom: '10px', top: 'auto' });
      done();
    }, 200);
  });
});
