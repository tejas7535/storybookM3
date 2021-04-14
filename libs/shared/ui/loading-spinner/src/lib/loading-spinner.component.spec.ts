import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let spectator: Spectator<LoadingSpinnerComponent>;

  const createComponent = createComponentFactory({
    component: LoadingSpinnerComponent,
    declarations: [LoadingSpinnerComponent],
    imports: [MatProgressSpinnerModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
