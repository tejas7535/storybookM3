import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { RefTypeComponent } from './ref-type.component';

describe('RefTypeComponent', () => {
  let component: RefTypeComponent;
  let fixture: ComponentFixture<RefTypeComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [RefTypeComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
