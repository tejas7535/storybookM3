import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { removeQueryItem } from '../../core/store/actions';
import { QueryItem } from '../../core/store/models';
import { initialState } from '../../core/store/reducers/search/search.reducer';
import { QuerySectionComponent } from './query-section.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('QueryComponent', () => {
  let component: QuerySectionComponent;
  let fixture: ComponentFixture<QuerySectionComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatIconModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [QuerySectionComponent],
      providers: [provideMockStore({ initialState })],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySectionComponent);
    mockStore = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('removeQueryItem', () => {
    test('should dispatch action', () => {
      mockStore.dispatch = jest.fn();
      const queryItem = new QueryItem('audi', '1450', '100');
      component.removeItem(queryItem);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        removeQueryItem({ queryItem })
      );
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
