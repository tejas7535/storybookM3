import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionSelectionChange } from '@angular/material/core/option';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { AutocompleteSearchComponent } from './autocomplete-search.component';

describe('AutocompleteSearchComponent', () => {
  let component: AutocompleteSearchComponent;
  let spectator: Spectator<AutocompleteSearchComponent>;

  const createComponent = createComponentFactory({
    component: AutocompleteSearchComponent,
    declarations: [AutocompleteSearchComponent],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatAutocompleteModule,
      MatIconModule,
      ReactiveComponentModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should assign filteredOptions', () => {
      component.updateSearch.emit = jest.fn();
      component.filter = jest.fn();
      component.selectedItem = { id: 'mockId', value: 'mockValue' };

      component.ngOnInit();
      spectator.detectChanges();

      expect(component.updateSearch.emit).toHaveBeenCalledWith('');
      expect(component.filter).toHaveBeenCalledWith('');
      expect(component.filteredOptions$).toBeDefined();
    });
  });

  describe('events', () => {
    it('should emit selection event and set selectedItem on selection', () => {
      component.optionSelected.emit = jest.fn();

      const selectedItem = { id: 0, value: 'val' };
      component.select(selectedItem);

      expect(component.optionSelected.emit).toHaveBeenCalledWith(selectedItem);
      expect(component.selectedItem).toEqual(selectedItem);
    });
  });

  describe('filter', () => {
    it('should filter options', () => {
      const options = [
        { id: 0, value: 'val' },
        { id: 1, value: 'val2' },
        { id: 2, value: 'val3' },
        { id: 3, value: 'vol' },
        { id: 4, value: 'vol2' },
      ];
      const expected = [
        { id: 0, value: 'val' },
        { id: 1, value: 'val2' },
        { id: 2, value: 'val3' },
      ];

      component.options = options;
      const actual = component.filter('val');

      expect(actual).toEqual(expected);
    });
  });

  describe('focusInput', () => {
    it('should focus search input if currently visible', () => {
      component.searchControl.setValue = jest.fn();
      component.searchInput.nativeElement.focus = jest.fn();

      component.focusInput();

      expect(component.searchControl.setValue).toHaveBeenCalledWith('');
      expect(component.searchInput.nativeElement.focus).toHaveBeenCalled();
    });
  });

  describe('openAutocompletePanel', () => {
    it('should call openPanel of autocomplete trigger', () => {
      component['_autocompleteTriggerElement'].openPanel = jest.fn();

      component.openAutocompletePanel();

      expect(
        component['_autocompleteTriggerElement'].openPanel
      ).toHaveBeenCalled();
    });
  });

  describe('onOptionSelect', () => {
    it('should click the host matOption element', () => {
      const clickMock = jest.fn();
      const mockEvent = {
        source: {
          _getHostElement: () => {
            return { click: clickMock };
          },
        },
      };

      component.onOptionSelect(
        (mockEvent as unknown) as MatOptionSelectionChange
      );

      expect(clickMock).toHaveBeenCalled();
    });
  });
});
