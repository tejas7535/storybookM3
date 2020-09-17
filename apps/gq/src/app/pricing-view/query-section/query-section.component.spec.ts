import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { configureTestSuite } from 'ng-bullet';

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
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
