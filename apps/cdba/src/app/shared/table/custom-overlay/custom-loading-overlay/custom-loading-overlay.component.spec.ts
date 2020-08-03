import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { LoadingSpinnerModule } from '../../../loading-spinner/loading-spinner.module';
import { CustomLoadingOverlayComponent } from './custom-loading-overlay.component';

describe('CustomLoadingOverlayComponent', () => {
  let component: CustomLoadingOverlayComponent;
  let fixture: ComponentFixture<CustomLoadingOverlayComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CustomLoadingOverlayComponent],
      imports: [LoadingSpinnerModule],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLoadingOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should do nothing for now - dummy test', () => {
      component.agInit({});

      expect(component).toBeTruthy();
    });
  });
});
