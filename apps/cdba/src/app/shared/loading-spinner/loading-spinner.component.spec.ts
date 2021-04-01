import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let spectator: Spectator<LoadingSpinnerComponent>;

  const createComponent = createComponentFactory({
    component: LoadingSpinnerComponent,
    imports: [MatProgressSpinnerModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
