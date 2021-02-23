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
        (mockAutocomplete as unknown) as AutocompleteSearchComponent,
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
        (mockAutocomplete as unknown) as AutocompleteSearchComponent,
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
    it('should patch value and emit selection event on selection', () => {
      component.selectionControl.patchValue = jest.fn();
      component.optionSelected.emit = jest.fn();

      const selectedOption = { id: 0, value: 'val' };
      component.select(selectedOption);

      expect(component.selectionControl.patchValue).toHaveBeenCalledWith('val');
      expect(component.optionSelected.emit).toHaveBeenCalledWith(
        selectedOption
      );
    });

    it('shoult emit update search event on search update', () => {
      component.updateSearch.emit = jest.fn();
      component.options = [];

      const query = 'search';
      component.onUpdateSearch(query);

      expect(component.updateSearch.emit).toHaveBeenCalledWith(query);
    });
  });
});
