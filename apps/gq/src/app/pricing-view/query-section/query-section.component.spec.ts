import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { initialState } from '../../core/store/reducers/search/search.reducer';
import { QuerySectionComponent } from './query-section.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('QueryComponent', () => {
  let component: QuerySectionComponent;
  let fixture: ComponentFixture<QuerySectionComponent>;

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
