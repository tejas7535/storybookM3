import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import * as rxjs from 'rxjs';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { FilterItem, IdValue } from '../../../core/store/models';
import { MultiSelectInputComponent } from './multi-select-input.component';
import { NoResultsFoundPipe } from './pipes/no-results-found.pipe';

describe('MultiSelectInputComponent', () => {
  let component: MultiSelectInputComponent;
  let fixture: ComponentFixture<MultiSelectInputComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        provideTranslocoTestingModule({}),
        MatInputModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatSelectModule,
        MatIconModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
      ],
      declarations: [MultiSelectInputComponent, NoResultsFoundPipe],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should add valueChanges subscription directly', () => {
      component['autocomplete'].emit = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test';
      component.searchForm.setValue(testVal);

      expect(component['autocomplete'].emit).toHaveBeenCalledTimes(0);
    });
    test('should add valueChanges subscription directly bc of empty searchform', () => {
      component.filter = new FilterItem(
        'customer',
        [new IdValue('aud', 'audi', true)],
        true,
        ['customer'],
        true
      );

      component['autocomplete'].emit = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      component.searchForm.setValue('');

      expect(component['autocomplete'].emit).toHaveBeenCalledTimes(0);
    });

    test('should add valueChanges subscription after DEBOUNCE_TIME_DEFAULT on searchRemote with >1 chars', (done) => {
      const filter = new FilterItem(
        'customer',
        [new IdValue('aud', 'audi', true)],
        true,
        ['customer'],
        true
      );
      component.filter = filter;
      component['autocomplete'].emit = jest.fn();

      const spy = jest.spyOn(rxjs, 'timer');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test1';
      component.searchForm.setValue(testVal);

      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith(component.DEBOUNCE_TIME_DEFAULT);
        expect(component['autocomplete'].emit).toHaveBeenCalledWith({
          filter: filter.filter,
          searchFor: testVal,
        });
        done();
      }, component.DEBOUNCE_TIME_DEFAULT);
    });
  });

  describe('add', () => {
    test('should emit event', () => {
      component.added.emit = jest.fn();
      component.filter = new FilterItem('test', [], false, [], true);
      component.add(({
        value: 'test',
        input: {
          value: 'val',
        },
      } as unknown) as MatChipInputEvent);

      expect(component.added.emit).toHaveBeenCalledTimes(1);
    });
    test('should not emit event when no value', () => {
      const event = { input: { value: 'test' } };
      component.added.emit = jest.fn();
      component.filter = new FilterItem('test', [], true, [], true);
      component.add((event as unknown) as MatChipInputEvent);

      expect(component.added.emit).not.toHaveBeenCalled();
    });

    test('should not emit event when autocomplete', () => {
      const event = { input: { value: 'test' } };
      component.filter = new FilterItem('test', [], true, [], true);
      component.added.emit = jest.fn();
      component.add((event as unknown) as MatChipInputEvent);

      expect(component.added.emit).not.toHaveBeenCalled();
    });
  });
  describe('remove', () => {
    test('should emit event', () => {
      const idValue = new IdValue('customer', 'customer', true);
      component.removed.emit = jest.fn();
      component.remove(idValue);
      expect(component.removed.emit).toHaveBeenCalledTimes(1);
      expect(component.removed.emit).toHaveBeenCalledWith(idValue);
    });
  });
  describe('selected', () => {
    test('should emit event', () => {
      component.added.emit = jest.fn();
      component.searchForm.setValue = jest.fn();
      component.valueInput = ({
        nativeElement: { value: 'test' },
      } as unknown) as any;

      component.selected(({
        option: { value: 'value' },
      } as unknown) as MatAutocompleteSelectedEvent);

      expect(component.added.emit).toHaveBeenCalledTimes(1);
      expect(component.valueInput.nativeElement.value).toEqual('');
      expect(component.searchForm.setValue).toHaveBeenCalledTimes(1);
    });
  });
  describe('set filter', () => {
    test('should set test input', () => {
      const options = [
        new IdValue('aud', 'audi', true),
        new IdValue('bm', 'bmw', false),
      ];
      component.filter = new FilterItem(
        'customer',
        options,
        true,
        ['customer'],
        true
      );
      expect(component.selectedIdValues).toEqual([options[0]]);
      expect(component.unselectedOptions).toEqual([options[1]]);
    });
  });

  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
