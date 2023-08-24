/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialNumberPipe } from '@cdba/shared/pipes';

import { FilterItemIdValue } from '../../../core/store/reducers/search/models';
import { SearchUtilityService } from '../../services/search-utility.service';
import { MultiSelectFilterComponent } from './multi-select-filter.component';
import { FormatValuePipe } from './pipes/format-value.pipe';
import { MultiSelectValuePipe } from './pipes/multi-select-value.pipe';
import { NoResultsFoundPipe } from './pipes/no-results-found.pipe';

describe('MultiSelectFilterComponent', () => {
  let component: MultiSelectFilterComponent;
  let spectator: Spectator<MultiSelectFilterComponent>;

  const createComponent = createComponentFactory({
    component: MultiSelectFilterComponent,
    imports: [
      CommonModule,
      SelectModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      provideTranslocoTestingModule({ en: {} }),
      MatCheckboxModule,
      MatTooltipModule,
      MatIconModule,
      MatProgressSpinnerModule,
    ],
    declarations: [MultiSelectValuePipe, NoResultsFoundPipe, FormatValuePipe],
    providers: [
      SearchUtilityService,
      MaterialNumberPipe,
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    disableAnimations: true,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    component.filter = new FilterItemIdValue('test', [], [], true, false);
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component['createInvariantFilterOptions'] = jest.fn();
    });

    it('should subscribe to formControl changes', () => {
      component.ngOnInit();
      const testVal = [{ id: 'test', title: 'test' } as StringOption];

      component.formControl.setValue(testVal);

      expect(component['selectedFilterOptions']).toStrictEqual([
        { id: 'test', title: 'test' },
      ]);
    });

    it('should run logic for invariant filter options', () => {
      component['subscription'].add = jest.fn();

      component.ngOnInit();

      expect(component['createInvariantFilterOptions']).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('ngOnChanges', () => {
    let filter: FilterItemIdValue;
    let newFilter: FilterItemIdValue;

    beforeEach(() => {
      const option = { id: '001', title: 'option' } as StringOption;
      const selectedOption = {
        id: '002',
        title: 'selectedOption',
      } as StringOption;

      filter = new FilterItemIdValue(
        'test',
        [option],
        [selectedOption],
        true,
        false
      );
      newFilter = new FilterItemIdValue(
        'test',
        [option, selectedOption],
        [selectedOption],
        true,
        false
      );

      component['formControl'].setValue = jest.fn();
      component['createInvariantFilterOptions'] = jest.fn();
    });

    it('should update selected filter options with new selected filter options', () => {
      component.ngOnChanges({
        filter: {
          currentValue: filter,
          previousValue: filter,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component['formControl'].setValue).toHaveBeenCalled();
      expect(component['createInvariantFilterOptions']).not.toHaveBeenCalled();
    });
    it('should create invariant filter options when items differ', () => {
      component.ngOnChanges({
        filter: {
          currentValue: filter,
          previousValue: newFilter,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component['formControl'].setValue).toHaveBeenCalled();
      expect(component['createInvariantFilterOptions']).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('onSearchUpdated', () => {
    let testString: string;

    beforeEach(() => {
      testString = undefined;

      component['handleLocalSearch'] = jest.fn();
      component['handleRemoteSearch'] = jest.fn();
    });

    it('should trim the input value', () => {
      component.filter.autocomplete = true;
      testString = 'SLH  ';

      component.onSearchUpdated(testString);

      expect(component['handleRemoteSearch']).toHaveBeenCalledWith('SLH');
    });

    it('should call handleLocalSearch when autocomplete off', () => {
      testString = 'search';
      component.filter.autocomplete = false;

      component.onSearchUpdated(testString);

      expect(component['handleLocalSearch']).toHaveBeenCalledWith(testString);
    });

    it('should call handleRemoteSearch when autocomplete on', () => {
      testString = 'search';
      component.filter.autocomplete = true;

      component.onSearchUpdated(testString);

      expect(component['handleRemoteSearch']).toHaveBeenCalledWith(testString);
    });

    it('should try to replace dashes for material number inputs', () => {
      testString = '012618918-0000';
      component.filter.name = 'material_number';
      component.filter.autocomplete = true;

      component.onSearchUpdated(testString);

      expect(component['handleRemoteSearch']).toHaveBeenCalledWith(
        '0126189180000'
      );
    });

    it('should not replace dashes for material number inputs if value is undefined', () => {
      component.filter.name = 'material_number';
      component.filter.autocomplete = true;

      component.onSearchUpdated(testString);

      expect(component['handleRemoteSearch']).toHaveBeenCalledWith(undefined);
    });
  });

  describe('onOpenedChange', () => {
    beforeEach(() => {
      const option1 = { id: '001', title: 'aaa' } as StringOption;
      const option2 = { id: '002', title: 'bbb' } as StringOption;
      component.filter = new FilterItemIdValue(
        'name',
        [option1, option2],
        [option2],
        true,
        false
      );
      component['selectedFilterOptions'] = [option2];
      component['updateFilter'].emit = jest.fn();
      component['formControl'].setValue = jest.fn();
    });

    it('should update filter on close', () => {
      const option1 = { id: '001', title: 'aaa' } as StringOption;
      const option2 = { id: '002', title: 'bbb' } as StringOption;

      component.onOpenedChange(false);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        autocomplete: true,
        autocompleteLoading: false,
        disabled: false,
        items: [option2, option1],
        name: 'name',
        selectedItems: [option2],
        type: 'ID_VALUE',
      });
    });
    it('should update set value of filter on open', () => {
      // this fixes the issue with schaeffler-select losing track of selected items
      component.onOpenedChange(true);

      expect(component['formControl'].setValue).toHaveBeenCalled();
      expect(component['updateFilter'].emit).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset the form and set the stringOptions to empty Array for autocomplete filter', () => {
      component.filter.autocomplete = true;
      component['selectComponent'].resetControls = jest.fn();

      component.reset();

      expect(component['stringOptions']).toEqual([]);
      expect(component['selectComponent'].resetControls).toHaveBeenCalled();
      expect(component.formControl.value).toEqual([]);
    });
    it('should reset the form and set the stringOptions to invariantFilerOptions for prepopulated filter', () => {
      component.filter.autocomplete = false;
      component['invariantLocalSearchFilterOptions'] = [
        { id: '001', title: 'test1' } as StringOption,
        { id: '002', title: 'test2' } as StringOption,
      ];
      component['selectComponent'].resetControls = jest.fn();

      component.reset();

      expect(component['stringOptions']).toEqual([
        { id: '001', title: 'test1' } as StringOption,
        { id: '002', title: 'test2' } as StringOption,
      ]);
      expect(component['selectComponent'].resetControls).toHaveBeenCalled();
      expect(component.formControl.value).toEqual([]);
    });
  });

  describe('filterItemsLocally', () => {
    const option1 = { id: '001', title: '001 | baum' } as StringOption;
    const option2 = { id: '002', title: '002 | cdba' } as StringOption;
    const option3 = { id: '003', title: '003 | goldwind' } as StringOption;

    let searchText;
    let result;

    beforeEach(() => {
      component.filter = new FilterItemIdValue(
        'test',
        [option1, option2, option3],
        [],
        false,
        false
      );

      component['invariantLocalSearchFilterOptions'] = [
        option1,
        option2,
        option3,
      ];

      searchText = undefined;
      result = undefined;
    });

    it('should filter items according provided search string', () => {
      searchText = 'ba';

      result = component['filterItemsLocally'](searchText);

      expect(result).toEqual([option1, option2]);
    });

    it('should filter items by their id', () => {
      searchText = '002';

      result = component['filterItemsLocally'](searchText);

      expect(result).toEqual([option2]);
    });
  });

  describe('handleLocalSearch', () => {
    const option1 = { id: '001', title: 'baum' } as StringOption;
    const option2 = { id: '002', title: 'cdba' } as StringOption;
    const option3 = { id: '003', title: 'dont find me' } as StringOption;

    let searchText;

    beforeEach(() => {
      component['invariantLocalSearchFilterOptions'] = [
        option1,
        option2,
        option3,
      ];

      component.stringOptions = [];
      component['selectedFilterOptions'] = [];
    });

    it('should search through invariant filter options', () => {
      searchText = 'baum';
      component['filterItemsLocally'] = jest
        .fn()
        .mockImplementationOnce(() => [option1]);

      component['handleLocalSearch'](searchText);

      expect(component.stringOptions).toEqual([option1]);
      expect(component['filterItemsLocally']).toHaveBeenCalled();
    });

    it('should reset options to invariant filter options when nothing is in the search bar', () => {
      searchText = '';
      component['filterItemsLocally'] = jest.fn();

      component['handleLocalSearch'](searchText);

      expect(component.stringOptions).toEqual(
        component['invariantLocalSearchFilterOptions']
      );
      expect(component['filterItemsLocally']).not.toHaveBeenCalled();
    });

    it('should put the selected options in front of invariant options', () => {
      component['selectedFilterOptions'] = [option3];
      component['filterItemsLocally'] = jest
        .fn()
        .mockImplementationOnce(() => [option3]);
      searchText = 'find';

      component['handleLocalSearch'](searchText);
      searchText = '';
      component['handleLocalSearch'](searchText);

      expect(component.stringOptions).toEqual([option3, option1, option2]);
      expect(component['filterItemsLocally']).toHaveBeenCalled();
    });

    it('should not filter items when searchText is undefined', () => {
      searchText = undefined;

      component['handleLocalSearch'](searchText);

      expect(component.stringOptions).toEqual([option1, option2, option3]);
    });
    it('should not filter items when searchText is empty', () => {
      searchText = '';

      component['handleLocalSearch'](searchText);

      expect(component.stringOptions).toEqual([option1, option2, option3]);
    });
  });

  describe('handleRemoteSearch', () => {
    const option1 = { id: '001', title: 'baum' } as StringOption;
    const option2 = { id: '002', title: 'cdba' } as StringOption;
    const option3 = { id: '003', title: 'dont find me' } as StringOption;
    const items = [option1, option2, option3];

    beforeEach(() => {
      component['updateFilter'].emit = jest.fn();
      component['autocomplete'].emit = jest.fn();
    });

    it('should autocomplete when search val is set', () => {
      component['handleRemoteSearch']('test');

      expect(component['autocomplete'].emit).toHaveBeenCalledWith({
        searchFor: 'test',
        filter: {
          name: 'test',
          items: [],
          selectedItems: [],
          autocomplete: true,
          autocompleteLoading: false,
          type: 'ID_VALUE',
          disabled: false,
        } as FilterItemIdValue,
      });

      expect(component['updateFilter'].emit).not.toHaveBeenCalled();
    });

    it('should reset options when no search val is set', () => {
      component['selectedFilterOptions'] = items;

      component['handleRemoteSearch']('');

      expect(component['updateFilter'].emit).not.toHaveBeenCalled();
      expect(component['autocomplete'].emit).not.toHaveBeenCalled();
      expect(component.stringOptions).toEqual(items);
    });
  });

  describe('emitUpdate', () => {
    it('should emit update', () => {
      const option1 = { id: '001', title: 'baum' } as StringOption;
      const option2 = { id: '002', title: 'cdba' } as StringOption;
      const option3 = { id: '003', title: 'dont find me' } as StringOption;
      const items = [option1, option3];
      const selectedItems = [option2];

      const filter = new FilterItemIdValue(
        'name',
        items,
        selectedItems,
        false,
        false
      );

      component.filter = filter;
      component.filterName = filter.name;
      component.stringOptions = filter.items;

      component['updateFilter'].emit = jest.fn();

      component.onOpenedChange(false);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        items: [
          { id: '002', title: 'cdba' },
          {
            id: '001',
            title: 'baum',
          },
          {
            id: '003',
            title: 'dont find me',
          },
        ],
        selectedItems: [
          {
            id: '002',
            title: 'cdba',
          },
        ],
      });
    });
  });
  // eslint-disable-next-line max-lines
});
