import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LoadingSpinnerModule } from '../../../loading-spinner/loading-spinner.module';
import { CustomLoadingOverlayComponent } from './custom-loading-overlay.component';

describe('CustomLoadingOverlayComponent', () => {
  let spectator: Spectator<CustomLoadingOverlayComponent>;
  let component: CustomLoadingOverlayComponent;

  const createComponent = createComponentFactory({
    component: CustomLoadingOverlayComponent,
    imports: [LoadingSpinnerModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should do nothing for now - dummy test', () => {
      component.agInit();

      expect(component).toBeTruthy();
    });
  });
});
