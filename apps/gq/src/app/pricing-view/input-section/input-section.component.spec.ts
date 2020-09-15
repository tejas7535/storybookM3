import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of, Subject } from 'rxjs';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { autocomplete, updateFilter } from '../../core/store/actions';
import { FilterItem, IdValue, TextSearch } from '../../core/store/models';
import { FilterInputModule } from './filter-input/filter-input.module';
import { InputSectionComponent } from './input-section.component';
import { MultiInputComponent } from './multi-input/multi-input.component';

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
        new FilterItem('customer', [new IdValue('id', 'val', false)]),
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
});
