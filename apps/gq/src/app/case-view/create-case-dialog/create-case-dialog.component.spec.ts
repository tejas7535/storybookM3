import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { CreateCaseDialogComponent } from './create-case-dialog.component';

describe('CreateCaseDialogComponent', () => {
  let component: CreateCaseDialogComponent;
  let fixture: ComponentFixture<CreateCaseDialogComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCaseDialogComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
