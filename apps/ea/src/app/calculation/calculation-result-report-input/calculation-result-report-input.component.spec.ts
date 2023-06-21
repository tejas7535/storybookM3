import { CommonModule } from '@angular/common';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CalculationResultReportInputComponent } from './calculation-result-report-input.component';

describe('CalculationResultReportInputComponent', () => {
  let component: CalculationResultReportInputComponent;
  let spectator: Spectator<CalculationResultReportInputComponent>;

  const createComponent = createComponentFactory({
    component: CalculationResultReportInputComponent,
    imports: [CommonModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    beforeEach(() => {
      component.reportInput = [
        {
          identifier: 'block',
          subordinates: [],
        },
        {
          identifier: 'variableBlock',
          subordinates: [],
        },
        {
          identifier: 'variableBlock',
          subordinates: [],
        },
      ];

      component.ngOnInit();
    });

    it('should return regular input data as a separate collection', () => {
      expect(component.regularInputs.length).toBe(2);
    });

    it('should return nested input data as a separate collection', () => {
      expect(component.nestedInputs.length).toBe(1);
    });
  });
});
