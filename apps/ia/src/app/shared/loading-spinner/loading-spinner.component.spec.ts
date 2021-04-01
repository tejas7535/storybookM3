import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let spectator: Spectator<LoadingSpinnerComponent>;

  const createComponent = createComponentFactory({
    component: LoadingSpinnerComponent,
    detectChanges: false,
    imports: [MatProgressSpinnerModule],
    declarations: [LoadingSpinnerComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
