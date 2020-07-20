import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DrawingsTabComponent } from './drawings-tab.component';

describe('DrawingsTabComponent', () => {
  let component: DrawingsTabComponent;
  let fixture: ComponentFixture<DrawingsTabComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DrawingsTabComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
