import { CommonModule } from '@angular/common';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { GreaseReportInputComponent } from './grease-report-input.component';

describe('GreaseReportInputComponent', () => {
  let component: GreaseReportInputComponent;
  let spectator: Spectator<GreaseReportInputComponent>;

  const createComponent = createComponentFactory({
    component: GreaseReportInputComponent,
    declarations: [GreaseReportInputComponent],
    imports: [CommonModule, ReactiveComponentModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
