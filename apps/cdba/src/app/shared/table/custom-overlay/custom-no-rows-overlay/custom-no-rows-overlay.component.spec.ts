import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { CustomNoRowsOverlayComponent } from './custom-no-rows-overlay.component';

describe('CustomNoRowsOverlayComponent', () => {
  let component: CustomNoRowsOverlayComponent;
  let fixture: ComponentFixture<CustomNoRowsOverlayComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CustomNoRowsOverlayComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomNoRowsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
