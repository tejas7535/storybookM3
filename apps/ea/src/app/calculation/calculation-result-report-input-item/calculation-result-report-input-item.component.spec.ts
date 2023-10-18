import { CommonModule } from '@angular/common';

import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoDecimalPipe } from '@ngneat/transloco-locale';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultReportInputItemComponent } from './calculation-result-report-input-item.component';

window.ResizeObserver = resize_observer_polyfill;

describe('CalculationResultReportInputItemComponent', () => {
  let component: CalculationResultReportInputItemComponent;
  let spectator: Spectator<CalculationResultReportInputItemComponent>;

  const createComponent = createComponentFactory({
    component: CalculationResultReportInputItemComponent,
    imports: [CommonModule, provideTranslocoTestingModule({ en: {} })],
    providers: [MeaningfulRoundPipe, TranslocoDecimalPipe],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should handle empty array', () => {
      component.reportInputItem = { hasNestedStructure: false };

      component.ngOnInit();
      expect(component.labelValues).toStrictEqual([]);
    });

    it('should assign label-value data with unit and abbreviation', () => {
      component.reportInputItem = {
        hasNestedStructure: false,
        subItems: [
          {
            hasNestedStructure: false,
            designation: 'mock_designation',
            abbreviation: 'mock_abbreviation',
            value: '123',
            unit: 'mock_unit',
          },
        ],
      };

      component.ngOnInit();

      expect(component.labelValues).toStrictEqual([
        {
          label: 'mock_designation (mock_abbreviation)',
          value: '123 mock_unit',
        },
      ]);
    });

    it('should assign label-value data without unit and abbreviation', () => {
      component.reportInputItem = {
        hasNestedStructure: false,
        subItems: [
          {
            hasNestedStructure: false,
            designation: 'mock_designation',
            value: 'mock_value',
          },
        ],
      };

      component.ngOnInit();

      expect(component.labelValues).toStrictEqual([
        {
          label: 'mock_designation ',
          value: 'mock_value',
        },
      ]);
    });
  });
});
