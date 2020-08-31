import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { QuerySectionComponent } from './query-section.component';

describe('QueryComponent', () => {
  let component: QuerySectionComponent;
  let fixture: ComponentFixture<QuerySectionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
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
