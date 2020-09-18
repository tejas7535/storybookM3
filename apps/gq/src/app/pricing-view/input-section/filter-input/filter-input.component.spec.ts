import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as rxjs from 'rxjs';

import { configureTestSuite } from 'ng-bullet';

import { FilterItem, IdValue } from '../../../core/store/models';
import { AutocompleteService } from '../services/autocomplete.service';
import { FilterInputComponent } from './filter-input.component';
import { NoResultsFoundPipe } from './pipes/no-results-found.pipe';
import { SelectValuePipe } from './pipes/select-value.pipe';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('FilterInputComponent', () => {
  let component: FilterInputComponent;
  let fixture: ComponentFixture<FilterInputComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [FilterInputComponent, NoResultsFoundPipe, SelectValuePipe],
      providers: [
        {
          provide: AutocompleteService,
          useValue: {
            autocomplete: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.filter = new FilterItem('test', []);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should add valueChanges subscription directly', () => {
      component.filter = undefined;
      component.searchFieldChange = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test';
      component.searchForm.setValue(testVal);

      expect(component.searchFieldChange).toHaveBeenCalledWith(testVal);
    });

    it('should add valueChanges subscription after DEBOUNCE_TIME_DEFAULT on searchRemote with > 1 chars', (done) => {
      component.searchFieldChange = jest.fn();
      component.searchForm.setValue('test');
      const spy = jest.spyOn(rxjs, 'timer');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test1';
      component.searchForm.setValue(testVal);

      expect(component.searchFieldChange).not.toHaveBeenCalledWith(testVal);

      setTimeout(() => {
        expect(component.searchFieldChange).toHaveBeenCalledWith(testVal);
        expect(spy).toHaveBeenCalledWith(component.DEBOUNCE_TIME_DEFAULT);
        done();
      }, component.DEBOUNCE_TIME_DEFAULT);
    });

    it('should add valueChanges subscription after DEBOUNCE_TIME_ONE_CHAR on searchRemote with 1 char', (done) => {
      component.searchFieldChange = jest.fn();
      component.searchForm.setValue('t');
      const spy = jest.spyOn(rxjs, 'timer');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test2';
      component.searchForm.setValue(testVal);

      expect(component.searchFieldChange).not.toHaveBeenCalledWith(testVal);

      setTimeout(() => {
        expect(component.searchFieldChange).toHaveBeenCalledWith(testVal);
        expect(spy).toHaveBeenCalledWith(component.DEBOUNCE_TIME_ONE_CHAR);
        done();
        done();
      }, component.DEBOUNCE_TIME_ONE_CHAR);
    });
  });

  describe('filterItemsLocally', () => {
    it('should filter items according provided search string', () => {
      const idValue1 = new IdValue('001', 'baum', true);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', true);

      component.filter = new FilterItem('test', [idValue1, idValue2, idValue3]);
      const search = 'ba';

      const result = component.filterItemsLocally(search, []);

      expect(result).toEqual([idValue1, idValue2]);
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idValue = new IdValue('001', 'Bam', false);

      const result = component.trackByFn(0, idValue);

      expect(result).toEqual(idValue);
    });
  });

  describe('emitUpdate', () => {
    it('should emit update with selected options', () => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];
      const filter = new FilterItem('name', items);
      component.filter = filter;
      component.filterOptions = filter.options;

      component['updateFilter'].emit = jest.fn();

      component['emitUpdate']([items[0], items[1]]);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        options: [
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

      const filter = new FilterItem('name', items);
      component.filter = filter;
      component.filterOptions = filter.options;

      component.form.setValue([idValue1, idValue3]);
      component['updateFilter'].emit = jest.fn();

      component['emitUpdate']([idValue1, idValue3]);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        options: [
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

  describe('dropdownOpenedChange', () => {
    it('should autofocus autocomplete input on open', () => {
      jest.useFakeTimers();
      component['emitUpdate'] = jest.fn();
      component.autocompleteInput = {
        nativeElement: {
          focus: jest.fn(),
        },
      };

      component.dropdownOpenedChange(true);

      expect(component['emitUpdate']).not.toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);
      jest.advanceTimersByTime(101);
      expect(
        component.autocompleteInput.nativeElement.focus
      ).toHaveBeenCalled();
    });

    it('should update filter on close', () => {
      component.form.setValue([new IdValue('001', 'val', true)]);
      jest.useFakeTimers();
      component.autocompleteInput = {
        nativeElement: {
          focus: jest.fn(),
        },
      };

      component['emitUpdate'] = jest.fn();

      component.dropdownOpenedChange(false);

      expect(component['emitUpdate']).toHaveBeenCalled();
      expect(
        component.autocompleteInput.nativeElement.focus
      ).not.toHaveBeenCalled();
      expect(setTimeout).not.toHaveBeenCalledTimes(1);
    });
  });

  describe('selectionChange', () => {
    let filter: FilterItem;
    let form: IdValue[];

    beforeEach(() => {
      const idValue1 = new IdValue('001', 'baum', false);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', false);
      const items = [idValue1, idValue2, idValue3];

      filter = new FilterItem('name', items);
      form = [idValue1, idValue2];

      component.filter = filter;
      component.filterOptions = filter.options;
    });

    it('should do nothing when change is not from user', () => {
      component.selectAllChecked = true;

      const evt: any = {
        isUserInput: false,
      };

      component.selectionChange(evt);

      expect(component.selectAllChecked).toBeTruthy();
    });

    xit('should set select all when all options are checked now', () => {
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

    xit('should unset select all when not all options are checked now', () => {
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
      component.form.setValue([filter.options[0]]);

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

  describe('resetSearchField', () => {
    it('should reset searchForm', () => {
      component.searchForm.reset = jest.fn();

      component.resetSearchField();

      expect(component.searchForm.reset).toHaveBeenCalled();
    });
  });

  describe('searchFieldChange', () => {
    const testString = 'search';

    it('should call handleLocalSearch', () => {
      component.filter = new FilterItem('name', []);
      component['handleLocalSearch'] = jest.fn();

      component.searchFieldChange(testString);

      expect(component['handleLocalSearch']).toHaveBeenCalledWith(testString);
    });
  });

  describe('updateFormValue', () => {
    let filter: FilterItem;

    beforeEach(() => {
      const idValue1 = new IdValue('001', 'baum', true);
      const idValue2 = new IdValue('002', 'cdba', true);
      const idValue3 = new IdValue('003', 'dont find me', true);

      filter = new FilterItem('name', [idValue1, idValue2, idValue3]);

      component.filterOptions = filter.options;
      component.form.setValue = jest.fn();
    });

    xit('should select all when all options are selected', () => {
      component.updateFormValue();

      expect(component.form.setValue).toHaveBeenCalledWith(filter.options);
      expect(component.selectAllChecked).toBeTruthy();
      expect(component.selectAllIndeterminate).toBeFalsy();
    });

    xit('should set indeterminate when not all but at least one option selected', () => {
      filter.options[1].selected = false;

      component.updateFormValue();

      expect(component.form.setValue).toHaveBeenCalledWith([filter.options[0]]);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeTruthy();
    });

    it('should unset indeterminate and select all when no options selected', () => {
      filter.options[0].selected = false;
      filter.options[1].selected = false;
      filter.options[2].selected = false;

      component.filterOptions = filter.options;
      component.form.setValue = jest.fn();

      component.updateFormValue();

      expect(component.form.setValue).toHaveBeenCalledWith(undefined);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeFalsy();
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

    xit('should select all if updated search result options are all checked', () => {
      component.form.setValue(items);
      component.filterItemsLocally = jest.fn(() => items);
      component['emitUpdate'] = jest.fn();

      const test = 'test';

      component['handleLocalSearch'](test);

      expect(component.filterOptions).toEqual(items);
      expect(component.selectAllChecked).toBeTruthy();
      expect(component.selectAllIndeterminate).toBeFalsy();
      expect(component.filterItemsLocally).toHaveBeenCalled();
      expect(component['emitUpdate']).toHaveBeenCalledWith(
        component.form.value
      );
    });

    xit('should unset select all if not all updated search result options are checked', () => {
      component.form.setValue([items[0]]);
      component.filterItemsLocally = jest.fn(() => items);
      component['emitUpdate'] = jest.fn();

      const test = 'test';

      component['handleLocalSearch'](test);

      expect(component.filterOptions).toEqual(items);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeTruthy();
      expect(component.filterItemsLocally).toHaveBeenCalled();
      expect(component['emitUpdate']).toHaveBeenCalledWith(
        component.form.value
      );
    });

    it('should unset select all and undetermined if no updated search result options are checked', () => {
      component.form.setValue(items[0]);
      component.filterItemsLocally = jest.fn(() => []);
      component['emitUpdate'] = jest.fn();

      const test = 'test';

      component['handleLocalSearch'](test);

      expect(component.filterOptions).toEqual([]);
      expect(component.selectAllChecked).toBeFalsy();
      expect(component.selectAllIndeterminate).toBeFalsy();
      expect(component.filterItemsLocally).toHaveBeenCalled();
      expect(component['emitUpdate']).toHaveBeenCalledWith([
        component.form.value,
      ]);
    });

    it('should set filter options to form value if search length 0', () => {
      component['emitUpdate'] = jest.fn();
      component.form.setValue(items[0]);

      component['handleLocalSearch']('');

      expect(component['emitUpdate']).not.toHaveBeenCalled();
      expect(component.filterOptions).toEqual([component.form.value]);
    });
  });
  // tslint:disable-next-line: max-file-line-count
});
