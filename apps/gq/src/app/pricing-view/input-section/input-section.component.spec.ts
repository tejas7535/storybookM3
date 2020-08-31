import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { InputSectionComponent } from './input-section.component';

describe('InputComponent', () => {
  let component: InputSectionComponent;
  let fixture: ComponentFixture<InputSectionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InputSectionComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
