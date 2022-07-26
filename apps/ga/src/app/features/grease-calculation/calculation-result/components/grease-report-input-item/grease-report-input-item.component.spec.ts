import { CommonModule } from '@angular/common';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { PushModule } from '@ngrx/component';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { GreaseReportInputItemComponent } from './grease-report-input-item.component';

window.ResizeObserver = resize_observer_polyfill;

describe('GreaseReportInputItemComponent', () => {
  let component: GreaseReportInputItemComponent;
  let spectator: Spectator<GreaseReportInputItemComponent>;
  const localizeNumber = jest.fn((number) => `${number}`);

  const createComponent = createComponentFactory({
    component: GreaseReportInputItemComponent,
    imports: [CommonModule, PushModule],
    providers: [mockProvider(TranslocoLocaleService, { localizeNumber })],
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
      component.greaseReportInputItem = { identifier: 'variableBlock' };

      component.ngOnInit();
      expect(component.labelValues).toStrictEqual([]);
    });

    it('should assign label-value data with unit and abbreviation', () => {
      component.greaseReportInputItem = {
        identifier: 'variableBlock',
        subordinates: [
          {
            identifier: 'variableLine',
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
      component.greaseReportInputItem = {
        identifier: 'variableBlock',
        subordinates: [
          {
            identifier: 'variableLine',
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
