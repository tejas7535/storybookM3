import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LoadingSpinnerComponent } from './loading-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let spectator: Spectator<LoadingSpinnerComponent>;

  const createComponent = createComponentFactory({
    component: LoadingSpinnerComponent,
    declarations: [LoadingSpinnerComponent],
    imports: [MatProgressSpinnerModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set bearingUrl', () => {
    expect(component.bearingUrl).toBeDefined();
  });
});
