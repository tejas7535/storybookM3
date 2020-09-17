import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';
import { configureTestSuite } from 'ng-bullet';

import { of, Subject } from 'rxjs';

import { autocomplete, updateFilter } from '../../core/store/actions';
import { FilterItem, IdValue, TextSearch } from '../../core/store/models';
import { FilterInputModule } from './filter-input/filter-input.module';
import { InputSectionComponent, Item } from './input-section.component';
import { MultiInputComponent } from './multi-input/multi-input.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('InputSectionComponent', () => {
  let component: InputSectionComponent;
  let fixture: ComponentFixture<InputSectionComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FilterInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDialogModule,
        MatChipsModule,
        MatIconModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [InputSectionComponent],
      providers: [provideMockStore({})],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSectionComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFilter', () => {
    it('should set/reset customer filter when change does not originate from customer', () => {
      const filter = [
        new FilterItem('test', [new IdValue('id', 'val', false)]),
      ];
      component.filter = undefined;
      component.filters$ = of(filter);

      component.getFilter();

      expect(component.filter.filter).toEqual(component.selectedFilter);
      expect(component.filter.options).toEqual([]);
    });

    it('should update customer filter when change contains customer', () => {
      const filter = [
        new FilterItem('customerNumber', [new IdValue('id', 'val', false)]),
      ];
      component.filter = undefined;
      component.filters$ = of(filter);

      component.getFilter();

      expect(component.filter.filter).toEqual(filter[0].filter);
      expect(component.filter.options).toEqual(filter[0].options);
    });
  });

  describe('updateFilter', () => {
    it('should disptach action updateFilter', () => {
      mockStore.dispatch = jest.fn();
      const filter: FilterItem = new FilterItem('name', []);

      component.updateFilter(filter);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        updateFilter({ item: filter })
      );
    });
  });

  describe('autocomplete', () => {
    it('should dispatch autocomplete action', () => {
      mockStore.dispatch = jest.fn();
      const textSearch = new TextSearch('name', 'Hans');

      component.autocomplete(textSearch);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        autocomplete({ textSearch })
      );
    });
  });

  describe('openDialog', () => {
    it('should open dialog with params and save result on close', () => {
      const observableMock = new Subject();
      const dialogMock = ({
        afterClosed: jest.fn(() => observableMock),
      } as unknown) as any;
      component.dialog.open = jest.fn(() => dialogMock);

      component.openDialog();

      expect(component.dialog.open).toHaveBeenCalledWith(MultiInputComponent, {
        width: '80%',
        height: '80%',
      });

      const testResult = 'result';

      observableMock.next(testResult);

      expect(component.multiQuery).toEqual(testResult);
    });
  });

  describe('add', () => {
    it('should add a Item', () => {
      const items: Item[] = [];
      const testValue = 'test ';
      const expectedValue = 'test';
      component.add(
        ({ value: testValue, input: {} } as unknown) as MatChipInputEvent,
        items
      );

      expect(items.length).toEqual(1);
      expect(items[0].name).toEqual(expectedValue);
    });

    it('shouldn´t add a empty Item', () => {
      const items: Item[] = [];
      const testValue = '';
      component.add(
        ({ value: testValue, input: {} } as unknown) as MatChipInputEvent,
        items
      );

      expect(items.length).toEqual(0);
    });

    it('should add no Item', () => {
      const items: Item[] = [];
      component.add(({} as unknown) as MatChipInputEvent, items);

      expect(items.length).toEqual(0);
    });
  });

  describe('remove', () => {
    it('should remove a Item', () => {
      const items: Item[] = [{ name: 'test' }];
      component.remove(items[0], items);

      expect(items.length).toEqual(0);
    });

    it('should not remove a Item', () => {
      const items: Item[] = [{ name: 'test' }];
      component.remove({ name: 'cake' }, items);

      expect(items.length).toEqual(1);
      expect(items[0].name).toEqual('test');
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
