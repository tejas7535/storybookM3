import { CommonModule } from '@angular/common';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CalculationParametersFormDevDebugComponent } from './calculation-parameters-form-dev-debug.component';

describe('CalculationParametersFormDevDebugComponent', () => {
  let component: CalculationParametersFormDevDebugComponent;
  let spectator: Spectator<CalculationParametersFormDevDebugComponent>;

  const createComponent = createComponentFactory({
    component: CalculationParametersFormDevDebugComponent,
    imports: [CommonModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
