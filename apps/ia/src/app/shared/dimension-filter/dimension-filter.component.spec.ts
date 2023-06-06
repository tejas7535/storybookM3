import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteInputComponent } from '../autocomplete-input/autocomplete-input.component';
import { AutocompleteInputModule } from '../autocomplete-input/autocomplete-input.module';
import { InputType } from '../autocomplete-input/models';
import { LOCAL_SEARCH_MIN_CHAR_LENGTH } from '../constants';
import { Filter, FilterDimension, IdValue, SelectedFilter } from '../models';
import { SelectInputComponent } from '../select-input/select-input.component';
import { SelectInputModule } from '../select-input/select-input.module';
import { SharedModule } from '../shared.module';
import { DimensionFilterComponent } from './dimension-filter.component';

describe('DimensionFilterComponent', () => {
  let component: DimensionFilterComponent;
  let spectator: Spectator<DimensionFilterComponent>;

  const createComponent = createComponentFactory({
    component: DimensionFilterComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      provideTranslocoTestingModule({ en: {} }),
      SelectInputModule,
      AutocompleteInputModule,
      MatIconModule,
      MatTooltipModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set availableDimensions', () => {
    test('should set available dimensions and  dimension name', () => {
      const orgUnit = { id: FilterDimension.ORG_UNIT, value: 'CBA' };
      const board = { id: FilterDimension.BOARD, value: 'ABC' };
      const availableDimensions: IdValue[] = [board, orgUnit];
      component['activeDimension'] = FilterDimension.ORG_UNIT;

      component.availableDimensions = availableDimensions;

      expect(component.availableDimensions).toEqual(availableDimensions);
      expect(component.dimensionName).toEqual(orgUnit.value);
    });
  });

  describe('set activeDimension', () => {
    test('should set active dimension, dimension name and type select', () => {
      const orgUnit = { id: FilterDimension.ORG_UNIT, value: 'CBA' };
      const board = { id: FilterDimension.BOARD, value: 'ABC' };
      const availableDimensions: IdValue[] = [board, orgUnit];
      const activeDimension = FilterDimension.BOARD;
      component.availableDimensions = availableDimensions;

      component.activeDimension = activeDimension;

      expect(component.activeDimension).toEqual(activeDimension);
      expect(component.dimensionName).toEqual(board.value);
      expect(component.type).toEqual(new InputType('select', board.value));
    });
  });

  describe('set dimensionFilter', () => {
    test('should set dimension filter, options, async mode and min char length', () => {
      const options: IdValue[] = [
        { id: FilterDimension.FUNCTION, value: 'xxx' },
        { id: FilterDimension.BOARD, value: 'yyy' },
      ];
      const dimensionFilter: Filter = {
        name: FilterDimension.FUNCTION,
        options,
      };

      component.dimensionFilter = dimensionFilter;

      expect(component.dimensionFilter).toEqual(dimensionFilter);
      expect(component.options).toEqual(options);
      expect(component.minCharLength).toEqual(LOCAL_SEARCH_MIN_CHAR_LENGTH);
      expect(component.asyncMode).toBeFalsy();
    });
  });

  describe('getDimensionName', () => {
    test('should get dimension name', () => {
      const orgUnit = { id: FilterDimension.ORG_UNIT, value: 'CBA' };
      const board = { id: FilterDimension.BOARD, value: 'ABC' };
      const availableDimensions: IdValue[] = [board, orgUnit];
      component['availableDimensions'] = availableDimensions;
      const activeDimension = FilterDimension.BOARD;
      component['activeDimension'] = activeDimension;

      const result = component.getDimensionName();

      expect(result).toEqual(board.value);
    });
  });

  describe('onDimensionSelected', () => {
    test('should emit selected dimension and close panel', () => {
      const dimension: IdValue = { id: FilterDimension.REGION, value: 'EU' };
      component.closePanel = jest.fn();
      component.dimensionSelected.emit = jest.fn();

      component.onDimensionSelected(dimension);

      expect(component.closePanel).toHaveBeenCalled();
      expect(component.dimensionSelected.emit).toHaveBeenCalledWith(dimension);
    });
  });

  describe('onOptionSelected', () => {
    test('should emit selected filter and close panel', () => {
      const dimension: IdValue = { id: FilterDimension.REGION, value: 'EU' };
      const selectedFilter: SelectedFilter = {
        idValue: dimension,
        name: 'Alasca',
      };
      component.closePanel = jest.fn();
      component.optionSelected.emit = jest.fn();

      component.onOptionSelected(selectedFilter);

      expect(component.closePanel).toHaveBeenCalled();
      expect(component.optionSelected.emit).toHaveBeenCalledWith(
        selectedFilter
      );
    });
  });

  describe('closePanel', () => {
    test('should close panel and foucs on autocomplete input component', () => {
      component.selectInput = { closePanel: () => {} } as SelectInputComponent;
      component.selectInput.closePanel = jest.fn();
      component.autocompleteInputComponent = {
        focus: () => {},
      } as AutocompleteInputComponent;
      component.autocompleteInputComponent.focus = jest.fn();

      component.closePanel();

      expect(component.selectInput.closePanel).toHaveBeenCalled();
      expect(component.autocompleteInputComponent.focus).toHaveBeenCalled();
    });
  });

  describe('onSelectedDimensionDataInvalid', () => {
    test('should emit selected dimnesion invalid', () => {
      component.selectedDimensionInvalid.emit = jest.fn();

      component.onSelectedDimensionDataInvalid(true);

      expect(component.selectedDimensionInvalid.emit).toHaveBeenCalled();
    });
  });

  describe('onAutoCompleteInputChange', () => {
    test('should emit search search text when async mode', () => {
      const searchFor = 'SHZ';
      component.asyncMode = true;
      component.autocompleteInput.emit = jest.fn();

      component.onAutoCompleteInputChange(searchFor);

      expect(component.autocompleteInput.emit).toHaveBeenCalledWith(searchFor);
    });

    test('should not emit search search text and filter options when not async mode', () => {
      const searchFor = 'Eu';
      component.asyncMode = true;
      component.autocompleteInput.emit = jest.fn();
      const europe = { id: 'Europe', value: 'Europe' };
      const options: IdValue[] = [
        europe,
        { id: 'Grater China', value: 'Grater China' },
      ];
      component.dimensionFilter = { name: FilterDimension.REGION, options };

      component.onAutoCompleteInputChange(searchFor);

      expect(component.autocompleteInput.emit).not.toHaveBeenCalledWith(
        searchFor
      );
      expect(component.dimensionFilter.options.length).toBe(1);
      expect(component.dimensionFilter.options[0]).toEqual(europe);
    });
  });
});
