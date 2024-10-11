import {
  MatProgressBar,
  MatProgressBarModule,
} from '@angular/material/progress-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CalculationIndicationMobileComponent } from './calculation-indication-mobile.component';

describe('CalculationIndicationMobileComponent', () => {
  let spectator: Spectator<CalculationIndicationMobileComponent>;
  const createComponent = createComponentFactory({
    component: CalculationIndicationMobileComponent,
    imports: [MatProgressBarModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show indeterminate progress bard when isCalculationLoading is true', () => {
    spectator.setInput('isCalculationLoading', true);
    const progressBar = spectator.query(MatProgressBar);

    expect(progressBar).toBeTruthy();
    expect(progressBar.mode).toBe('indeterminate');
  });

  it('should not show progress bars', () => {
    spectator.setInput('isCalculationLoading', false);
    const progressBar = spectator.query(MatProgressBar);

    expect(progressBar).toBeFalsy();
  });

  it('should show progress bar when isCalculationResultAvailable is true', () => {
    spectator.setInput('isCalculationResultAvailable', true);
    const progressBar = spectator.query(MatProgressBar);

    expect(progressBar).toBeTruthy();
    expect(progressBar.mode).toBe('determinate');
    expect(progressBar.value).toBe(100);
  });

  it('should not show progress bar when isCalculationResultAvailable is false', () => {
    spectator.setInput('isCalculationResultAvailable', false);
    const progressBar = spectator.query(MatProgressBar);

    expect(progressBar).toBeFalsy();
  });
});
