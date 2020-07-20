import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { CalculationsTabComponent } from './calculations-tab.component';

describe('CalculationsTabComponent', () => {
  let component: CalculationsTabComponent;
  let fixture: ComponentFixture<CalculationsTabComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CalculationsTabComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
