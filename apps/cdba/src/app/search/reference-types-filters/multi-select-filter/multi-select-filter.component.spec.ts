import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  FilterItemIdValue,
  IdValue,
} from '../../../core/store/reducers/search/models';
import { SharedModule } from '../../../shared/shared.module';
import { SearchUtilityService } from '../../services/search-utility.service';
import { MultiSelectFilterComponent } from './multi-select-filter.component';
import { MultiSelectValuePipe } from './multi-select-value.pipe';

describe('MultiSelectFilterComponent', () => {
  let component: MultiSelectFilterComponent;
  let fixture: ComponentFixture<MultiSelectFilterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MultiSelectFilterComponent, MultiSelectValuePipe],
      imports: [
        NoopAnimationsModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        provideTranslocoTestingModule({}),
        MatCheckboxModule,
        MatTooltipModule,
        MatIconModule,
        MatProgressSpinnerModule,
      ],
      providers: [SearchUtilityService],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.filter = new FilterItemIdValue('test', [], false, true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should add valueChanges subscription directly', () => {
      component.searchFieldChange = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test';
      component.searchForm.setValue(testVal);

      expect(component.searchFieldChange).toHaveBeenCalledWith(testVal);
    });

    it('should add valueChanges subscription after debounce time on searchRemote', (done) => {
      component.searchFieldChange = jest.fn();
      component.filter.autocomplete = true;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test1';
      component.searchForm.setValue(testVal);

      expect(component.searchFieldChange).not.toHaveBeenCalledWith(testVal);

      setTimeout(() => {
        expect(component.searchFieldChange).toHaveBeenCalledWith(testVal);
        done();
      }, component.debounceTime);
    });
  });

  describe('ngOnChanges', () => {
    let filter: FilterItemIdValue;

    beforeEach(() => {
      const idValue = new IdValue('001', 'boring', false);
      const idValueSel = new IdValue('002', 'selected', true);
      filter = new FilterItemIdValue('test', [idValue, idValueSel], true);
      component.filterItemsLocally = jest.fn(() => filter.items);
      component.updateFormValue = jest.fn();
      component['searchUtilities'].mergeOptionsWithSelectedOptions = jest.fn(
        () => filter.items
      );
    });

    it('should update filter and form on filter change with autocomplete correctly', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        filter: {
          currentValue: filter,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.filterName).toEqual(filter.name);
      expect(component.filterOptions).toEqual(filter.items);
      expect(component.updateFormValue).toHaveBeenCalled();
      expect(component.filterItemsLocally).not.toHaveBeenCalled();
      expect(
        component['searchUtilities'].mergeOptionsWithSelectedOptions
      ).toHaveBeenCalled();
    });

    it('should update filter and form on filter change and consider local search on non autocomplete', () => {
      filter.autocomplete = false;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        filter: {
          currentValue: filter,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.filterOptions).toEqual(filter.items);
      expect(component.updateFormValue).toHaveBeenCalled();
      expect(component.filterItemsLocally).toHaveBeenCalled();
      expect(
        component['searchUtilities'].mergeOptionsWithSelectedOptions
      ).not.toHaveBeenCalled();
    });

    it('should merge old selections with changes on autocomplete filter', () => {
      component.form.setValue([new IdValue('003', 'selected 2', true)]);

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        filter: {
          currentValue: filter,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.filterOptions).toEqual(filter.items);
      expect(component.updateFormValue).toHaveBeenCalled();
      expect(component.filterItemsLocally).not.toHaveBeenCalled();
      expect(
        component['searchUtilities'].mergeOptionsWithSelectedOptions
      ).toHaveBeenCalledWith(filter.items, component.form.value);
    });

    it('should do nothing when something else than filter changes', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({});

      expect(component.form.value).toBeNull();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('searchFieldChange', () => {
    const testString = 'search';

    it('should call handleLocalSearch when autocomplete off', () => {
      component.filter = new FilterItemIdValue('name', [], false);
      component['handleLocalSearch'] = jest.fn();

      component.searchFieldChange(testString);

      expect(component['handleLocalSearch']).toHaveBeenCalledWith(testString);
    });

    it('should call handleRemoteSearch when autocomplete on', () => {
      component.filter = new FilterItemIdValue('name', [], true);
      component['handleRemoteSearch'] = jest.fn();

      component.searchFieldChange(testString);

      expect(component['handleRemoteSearch']).toHaveBeenCalledWith(testString);
    });
  });

  describe('updateFormValue', () => {
    let filter: FilterItemIdValue;

    beforeEach(() => {
      const idValue1 = new IdValue('001', 'baum', true);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', true);

      filter = new FilterItemIdValue(
        'name',
        [idValue1, idValue2, idValue3],
        false
      );

      component.filterOptions = filter.items;
      component.filterName = filter.name;
      component.form.setValue = jest.fn();
    });

    it('should select all when all options are selected', () => {
      component.updateFormValue();

      expect(component.form.setValue).toHaveBeenCalledWith(filter.items);
      expect(component.selectAllChecked).toBeTruthy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });

    it('should set indeterminate when not all but at least one option selected', () => {
      filter.items[1].selected = false;

      component.updateFormValue();

      expect(component.form.setValue).toHaveBeenCalledWith([
        filter.items[0],
        filter.items[2],
      ]);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeTruthy();
    });

    it('should unset indeterminate and select all when no options selected', () => {
      filter.items[0].selected = false;
      filter.items[1].selected = false;
      filter.items[2].selected = false;

      component.filterOptions = filter.items;
      component.filterName = filter.name;
      component.form.setValue = jest.fn();

      component.updateFormValue();

      expect(component.form.setValue).toHaveBeenCalledWith([]);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });
  });

  describe('resetSearchField', () => {
    it('should reset searchForm', () => {
      component.searchForm.reset = jest.fn();

      component.resetSearchField();

      expect(component.searchForm.reset).toHaveBeenCalled();
    });
  });

  describe('filterItemsLocally', () => {
    it('should filter items according provided search string', () => {
      const idValue1 = new IdValue('001', 'baum', true);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', true);

      component.filter = new FilterItemIdValue(
        'test',
        [idValue1, idValue2, idValue3],
        false
      );
      const search = 'ba';

      const result = component.filterItemsLocally(search, []);

      expect(result).toEqual([idValue1, idValue2]);
    });
  });

  describe('selectAllChange', () => {
    let items: IdValue[];

    beforeEach(() => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      items = [idValue1, idValue2, idValue3];

      component.filter = new FilterItemIdValue('test', items, false);
      component.filterOptions = items;
    });

    it('should select all if true, unset indeterminate and set form value', () => {
      component.selectAllChange(true);

      expect(component.form.value).toEqual(items);
      expect(component.selectAllChecked).toBeTruthy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });

    it('should unselect all if false', () => {
      component.selectAllChange(false);

      expect(component.form.value).toEqual([]);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });
  });

  describe('selectionChange', () => {
    let filter: FilterItemIdValue;
    let form: IdValue[];

    beforeEach(() => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      filter = new FilterItemIdValue('name', items, false);
      form = [idValue1, idValue2];

      component.filter = filter;
      component.filterOptions = filter.items;
    });

    it('should do nothing when change is not from user', () => {
      component.selectAllChecked = true;

      const evt: any = {
        isUserInput: false,
      };

      component.selectionChange(evt);

      expect(component.selectAllChecked).toBeTruthy();
    });

    it('should set select all when all options are checked now', () => {
      component.form.setValue(form);

      const evt: any = {
        isUserInput: true,
        source: {
          selected: true,
        },
      };

      component.selectionChange(evt);

      expect(component.selectAllChecked).toBeTruthy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });

    it('should unset select all when not all options are checked now', () => {
      component.form.setValue(form);

      const evt: any = {
        isUserInput: true,
        source: {
          selected: false,
        },
      };

      component.selectionChange(evt);

      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeTruthy();
    });

    it('should unset select all and indeterminate when no options are checked', () => {
      component.form.setValue([filter.items[0]]);

      const evt: any = {
        isUserInput: true,
        source: {
          selected: false,
        },
      };

      component.selectionChange(evt);

      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });
  });

  describe('updateFiltersOnDropdownClose', () => {
    it('should do nothing when dropdown opens', () => {
      component['emitUpdate'] = jest.fn();

      component.updateFiltersOnDropdownClose(true);

      expect(component['emitUpdate']).not.toHaveBeenCalled();
    });

    it('should update filter', () => {
      component.form.setValue([new IdValue('001', 'val', true)]);

      component['emitUpdate'] = jest.fn();

      component.updateFiltersOnDropdownClose(false);

      expect(component['emitUpdate']).toHaveBeenCalled();
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idValue = new IdValue('001', 'Bam', false);

      const result = component.trackByFn(0, idValue);

      expect(result).toEqual(idValue);
    });
  });

  describe('handleLocalSearch', () => {
    let items: IdValue[];

    beforeEach(() => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      items = [idValue1, idValue2, idValue3];
    });

    it('should select all if updated search result options are all checked', () => {
      component.form.setValue(items);
      component.filterItemsLocally = jest.fn(() => items);

      const test = 'test';

      component['handleLocalSearch'](test);

      expect(component.filterOptions).toEqual(items);
      expect(component.selectAllChecked).toBeTruthy();
      expect(component.selectAllIndeterminate).toBeFalsy();
      expect(component.filterItemsLocally).toHaveBeenCalled();
    });

    it('should unset select all if not all updated search result options are checked', () => {
      component.form.setValue([items[0]]);
      component.filterItemsLocally = jest.fn(() => items);

      const test = 'test';

      component['handleLocalSearch'](test);

      expect(component.filterOptions).toEqual(items);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeTruthy();
      expect(component.filterItemsLocally).toHaveBeenCalled();
    });

    it('should unset select all and undetermined if no updated search result options are checked', () => {
      component.form.setValue(items);
      component.filterItemsLocally = jest.fn(() => []);

      const test = 'test';

      component['handleLocalSearch'](test);

      expect(component.filterOptions).toEqual([]);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeFalsy();
      expect(component.filterItemsLocally).toHaveBeenCalled();
    });
  });

  describe('handleRemoteSearch', () => {
    let items: IdValue[];

    beforeEach(() => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      items = [idValue1, idValue2, idValue3];
    });

    it('should autocomplete when search val is set', () => {
      component['emitUpdate'] = jest.fn();
      component['autocomplete'].emit = jest.fn();
      component.filter = new FilterItemIdValue('name', [], false);

      component['handleRemoteSearch']('test');

      expect(component['emitUpdate']).toHaveBeenCalled();
      expect(component['autocomplete'].emit).toHaveBeenCalledWith({
        field: 'name',
        value: 'test',
      });
    });

    it('should reset options when no search val is set', () => {
      component['emitUpdate'] = jest.fn();
      component.form.setValue(items);

      component.filter = new FilterItemIdValue('name', [], false);

      component['handleRemoteSearch']('');

      expect(component['emitUpdate']).not.toHaveBeenCalled();
      expect(component.filterOptions).toEqual(items);
    });
  });

  describe('emitUpdate', () => {
    it('should emit update with selected options', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];
      const filter = new FilterItemIdValue('name', items, false);
      component.filter = filter;
      component.filterName = filter.name;
      component.filterOptions = filter.items;

      component['updateFilter'].emit = jest.fn();

      component['emitUpdate']([items[0], items[1]]);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        items: [
          {
            id: '001',
            value: 'baum',
            selected: true,
          },
          {
            id: '002',
            value: 'cdba',
            selected: true,
          },
          {
            id: '003',
            value: 'dont find me',
            selected: false,
          },
        ],
      });
    });

    it('should also consider unselected options', () => {
      const idValue1 = new IdValue('001', 'baum', true);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', true);
      const items = [idValue1, idValue2, idValue3];

      const filter = new FilterItemIdValue('name', items, false);
      component.filter = filter;
      component.filterName = filter.name;
      component.filterOptions = filter.items;

      component.form.setValue([idValue1, idValue3]);
      component['updateFilter'].emit = jest.fn();

      component['emitUpdate']([idValue1, idValue3]);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        items: [
          {
            id: '001',
            value: 'baum',
            selected: true,
          },
          {
            id: '002',
            value: 'cdba',
            selected: false,
          },
          {
            id: '003',
            value: 'dont find me',
            selected: true,
          },
        ],
      });
    });
  });
  // tslint:disable-next-line: max-file-line-count
});
