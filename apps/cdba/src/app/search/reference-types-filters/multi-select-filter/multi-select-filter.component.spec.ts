import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
      component.modifiedFilter.autocomplete = true;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test1';
      component.searchForm.setValue(testVal);

      expect(component.searchFieldChange).not.toHaveBeenCalledWith(testVal);

      setTimeout(() => {
        expect(component.searchFieldChange).toHaveBeenCalledWith(testVal);
        done();
      }, 500);
    });
  });

  describe('ngOnChanges', () => {
    it('should update filter and form on filter change', () => {
      const idValue = new IdValue('001', 'boring');
      const idValueSel = new IdValue('002', 'selected', true);
      const filter = new FilterItemIdValue('test', [idValue, idValueSel], true);
      component.filterItemsLocally = jest.fn();
      component.updateFormValue = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        filter: {
          currentValue: filter,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.modifiedFilter.name).toEqual(filter.name);
      expect(component.modifiedFilter.items).toEqual(filter.items);
      expect(component.updateFormValue).toHaveBeenCalled();
    });

    it('should update filter and form on filter change and consider search on non autocomplete', () => {
      const idValue = new IdValue('001', 'boring', true);
      const idValueSel = new IdValue('002', 'selected', true);
      const filter = new FilterItemIdValue(
        'test',
        [idValue, idValueSel],
        false
      );
      component.filterItemsLocally = jest.fn(() => filter.items);
      component.updateFormValue = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        filter: {
          currentValue: filter,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.modifiedFilter).toEqual(filter);
      expect(component.updateFormValue).toHaveBeenCalled();
      expect(component.filterItemsLocally).toHaveBeenCalled();
    });

    it('should do nothing when something else than filter changes', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({});

      expect(component.modifiedFilter.name).toBeUndefined();
      expect(component.modifiedFilter.items).toEqual([]);
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
    it('should call handleLocalSearch when autocomplete off', () => {
      component.filter = new FilterItemIdValue('name', [], false);
      component['handleLocalSearch'] = jest.fn();

      const testString = 'search';
      component.searchFieldChange(testString);

      expect(component['handleLocalSearch']).toHaveBeenCalledWith(testString);
    });

    it('should call handleRemoteSearch when autocomplete on', () => {
      component.filter = new FilterItemIdValue('name', [], true);
      component['handleRemoteSearch'] = jest.fn();

      const testString = 'search';
      component.searchFieldChange(testString);

      expect(component['handleRemoteSearch']).toHaveBeenCalledWith(testString);
    });
  });

  describe('updateFormValue', () => {
    it('should select all when all options are selected', () => {
      const idValue1 = new IdValue('001', 'baum', true);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', true);

      const filter = new FilterItemIdValue('name', [
        idValue1,
        idValue2,
        idValue3,
      ]);

      component.modifiedFilter = filter;
      component.form.setValue = jest.fn();

      component.updateFormValue();

      expect(component.form.setValue).toHaveBeenCalledWith(filter.items);
      expect(component.selectAllChecked).toBeTruthy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });

    it('should set indeterminate when not all but at least one option selected', () => {
      const idValue1 = new IdValue('001', 'baum', true);
      const idValue2 = new IdValue('002', 'cdba', false);
      const idValue3 = new IdValue('003', 'dont find me', true);

      const filter = new FilterItemIdValue('name', [
        idValue1,
        idValue2,
        idValue3,
      ]);

      component.modifiedFilter = filter;
      component.form.setValue = jest.fn();

      component.updateFormValue();

      expect(component.form.setValue).toHaveBeenCalledWith([
        idValue1,
        idValue3,
      ]);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeTruthy();
    });

    it('should unset indeterminate and select all when no options selected', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', false);
      const idValue3 = new IdValue('003', 'dont find me', false);

      const filter = new FilterItemIdValue('name', [
        idValue1,
        idValue2,
        idValue3,
      ]);

      component.modifiedFilter = filter;
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
      const idValue1 = new IdValue('001', 'baum');
      const idValue2 = new IdValue('002', 'cdba');
      const idValue3 = new IdValue('003', 'dont find me');

      component.filter = new FilterItemIdValue('test', [
        idValue1,
        idValue2,
        idValue3,
      ]);
      const search = 'ba';

      const result = component.filterItemsLocally(search, []);

      expect(result).toEqual([idValue1, idValue2]);
    });
  });

  describe('selectAllChange', () => {
    it('should select all if true, unset indeterminate and set form value', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      component.modifiedFilter = new FilterItemIdValue('test', items);

      component.selectAllChange(true);

      expect(component.form.value).toEqual(items);
      expect(component.selectAllChecked).toBeTruthy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });

    it('should unselect all if false', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      component.modifiedFilter = new FilterItemIdValue('test', items);

      component.selectAllChange(false);

      expect(component.form.value).toEqual([]);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });
  });

  describe('selectionChange', () => {
    it('should do nothing when change is not from user', () => {
      component.selectAllChecked = true;

      const evt: any = {
        isUserInput: false,
      };

      component.selectionChange(evt);

      expect(component.selectAllChecked).toBeTruthy();
    });

    it('should set select all when all options are checked now', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      const filter = new FilterItemIdValue('name', items);
      const form = [idValue1, idValue2];

      component.form.setValue(form);
      component.modifiedFilter = filter;

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
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      const filter = new FilterItemIdValue('name', items);
      const form = [idValue1, idValue2];

      component.form.setValue(form);
      component.modifiedFilter = filter;

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
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      const filter = new FilterItemIdValue('name', items);
      const form: IdValue[] = [];

      component.form.setValue(form);
      component.modifiedFilter = filter;

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
      component['removeFilter'].emit = jest.fn();
      component['emitUpdate'] = jest.fn();

      component.updateFiltersOnDropdownClose(true);

      expect(component['removeFilter'].emit).not.toHaveBeenCalled();
      expect(component['emitUpdate']).not.toHaveBeenCalled();
    });

    it('should remove filter if no values are selected anymore', () => {
      component.form.setValue([]);
      component.modifiedFilter = new FilterItemIdValue('test', []);
      component['removeFilter'].emit = jest.fn();

      component.updateFiltersOnDropdownClose(false);

      expect(component['removeFilter'].emit).toHaveBeenCalledWith('test');
    });

    it('should update filter if values are selected', () => {
      component.form.setValue([new IdValue('001', 'val')]);

      component['emitUpdate'] = jest.fn();

      component.updateFiltersOnDropdownClose(false);

      expect(component['emitUpdate']).toHaveBeenCalled();
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idValue = new IdValue('001', 'Bam');

      const result = component.trackByFn(0, idValue);

      expect(result).toEqual(idValue.id);
    });
  });

  describe('handleLocalSearch', () => {
    it('should select all if updated search result options are all checked', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      component.form.setValue(items);
      component.filterItemsLocally = jest.fn(() => items);

      const test = 'test';

      component['handleLocalSearch'](test);

      expect(component.modifiedFilter.items).toEqual(items);
      expect(component.selectAllChecked).toBeTruthy();
      expect(component.selectAllIndeterminate).toBeFalsy();
      expect(component.filterItemsLocally).toHaveBeenCalled();
    });

    it('should unset select all if not all updated search result options are checked', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      component.form.setValue([idValue1]);
      component.filterItemsLocally = jest.fn(() => items);

      const test = 'test';

      component['handleLocalSearch'](test);

      expect(component.modifiedFilter.items).toEqual(items);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeTruthy();
      expect(component.filterItemsLocally).toHaveBeenCalled();
    });

    it('should unset select all and undetermined if no updated search result options are checked', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      component.form.setValue(items);
      component.filterItemsLocally = jest.fn(() => []);

      const test = 'test';

      component['handleLocalSearch'](test);

      expect(component.modifiedFilter.items).toEqual([]);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeFalsy();
      expect(component.filterItemsLocally).toHaveBeenCalled();
    });
  });

  describe('handleRemoteSearch', () => {
    it('should autocomplete when search val is set', () => {
      component['emitUpdate'] = jest.fn();
      component['autocomplete'].emit = jest.fn();
      component.filter = new FilterItemIdValue('name', []);

      component['handleRemoteSearch']('test');

      expect(component['emitUpdate']).toHaveBeenCalled();
      expect(component['autocomplete'].emit).toHaveBeenCalledWith({
        field: 'name',
        value: 'test',
      });
    });

    it('should reset options when no search val is set', () => {
      component['emitUpdate'] = jest.fn();
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];
      component.form.setValue(items);

      component.filter = new FilterItemIdValue('name', []);

      component['handleRemoteSearch']('');

      expect(component['emitUpdate']).not.toHaveBeenCalled();
      expect(component.modifiedFilter.items).toEqual(items);
    });
  });

  describe('emitUpdate', () => {
    it('should emit update with selected options', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      const filter = new FilterItemIdValue('name', items);
      component.modifiedFilter = filter;

      component.form.setValue([idValue1, idValue2]);
      component['updateFilter'].emit = jest.fn();

      component['emitUpdate']();

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

      const filter = new FilterItemIdValue('name', items);
      component.modifiedFilter = filter;

      component.form.setValue([idValue1, idValue3]);
      component['updateFilter'].emit = jest.fn();

      component['emitUpdate']();

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
