import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Subject } from 'rxjs';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  addOption,
  autocomplete,
  removeOption,
  selectedFilterChange,
} from '../../core/store/actions';
import { AutocompleteSearch, IdValue } from '../../core/store/models';
import { initialState } from '../../core/store/reducers/search/search.reducer';
import { InputSectionComponent } from './input-section.component';
import { MultiSelectInputModule } from './multi-select-input/multi-select-input.module';
import { MultipleInputDialogComponent } from './multiple-input-dialog/multiple-input-dialog.component';
import { MultipleInputDialogModule } from './multiple-input-dialog/multiple-input-dialog.module';

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
        provideTranslocoTestingModule({}),
        MultiSelectInputModule,
        MultipleInputDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDialogModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        FlexLayoutModule,
      ],
      declarations: [InputSectionComponent],
      providers: [provideMockStore({ initialState })],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSectionComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('autocomplete', () => {
    test('should dispatch autocomplete action', () => {
      mockStore.dispatch = jest.fn();
      const autocompleteSearch = new AutocompleteSearch('name', 'Hans');

      component.autocomplete(autocompleteSearch);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        autocomplete({ autocompleteSearch })
      );
    });
  });
  describe('selectedFilterChange', () => {
    test('should dispatch selectedFilterChange action', () => {
      mockStore.dispatch = jest.fn();
      component.selectedFilterChange(({
        value: 'customer',
      } as unknown) as any);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        selectedFilterChange({ filterName: 'customer' })
      );
    });
  });
  describe('removeOption', () => {
    test('should dispatch removeOption action', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filterName = 'customer';
      component.removeOption(option, filterName);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        removeOption({ option, filterName })
      );
    });
  });
  describe('addOption', () => {
    test('should dispatch addOption action', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filterName = 'customer';
      component.addOption(option, filterName);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        addOption({ option, filterName })
      );
    });
  });

  describe('openDialog', () => {
    test('should open dialog with params and save result on close', () => {
      const observableMock = new Subject();
      const dialogMock = ({
        afterClosed: jest.fn(() => observableMock),
      } as unknown) as any;
      component.dialog.open = jest.fn(() => dialogMock);

      component.openDialog();

      expect(component.dialog.open).toHaveBeenCalledWith(
        MultipleInputDialogComponent,
        {
          width: '80%',
          height: '80%',
        }
      );

      const testResult = 'result';

      observableMock.next(testResult);

      expect(component.multiQuery).toEqual(testResult);
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
