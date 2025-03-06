import { CommonModule } from '@angular/common';

import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CatalogCalculationInputFormatterService } from '../../services/catalog-calculation-input-formatter.service';
import {
  CalculationResultReportInputItemComponent,
  LabelWidth,
} from './calculation-result-report-input-item.component';

window.ResizeObserver = resize_observer_polyfill;

describe('CalculationResultReportInputItemComponent', () => {
  let component: CalculationResultReportInputItemComponent;
  let spectator: Spectator<CalculationResultReportInputItemComponent>;

  const createComponent = createComponentFactory({
    component: CalculationResultReportInputItemComponent,
    imports: [CommonModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      CatalogCalculationInputFormatterService,
      provideTranslocoLocale(sharedTranslocoLocaleConfig),
    ],
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

    describe('when label-value data is assigned', () => {
      beforeEach(() => {
        component.reportInputItem = {
          hasNestedStructure: false,
          subItems: [
            {
              hasNestedStructure: false,
              designation: 'Designation',
              abbreviation: 'mock_abbreviation',
              value: '123',
              unit: 'mock_unit',
            },
          ],
        };
      });

      it('should assign values', () => {
        component.ngOnInit();

        expect(component.labelValues).toStrictEqual([
          {
            label: 'Designation (mock_abbreviation)',
            value: '123 mock_unit',
          },
        ]);
      });
    });

    describe('when label-value data is without unit and abbreviation', () => {
      beforeEach(() => {
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
      });

      it('should assign label-value data without unit and abbreviation', () => {
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

  describe('when component is resizable', () => {
    it('should have default element width', () => {
      expect(component.labelWidth).toBe(LabelWidth.Default);
    });

    describe('onResize', () => {
      it('should call adjustLabelWidth on resize with small label width', () => {
        const smallWidth = 300;

        const mockResizeObserver = {
          observe: jest.fn(),
        };

        window.ResizeObserver = jest
          .fn()
          .mockImplementation(() => mockResizeObserver);

        spectator.component.ngOnInit();
        const entries = [{ contentRect: { width: smallWidth } }];
        (window.ResizeObserver as jest.Mock).mock.calls[0][0](entries);

        expect(mockResizeObserver.observe).toHaveBeenCalled();
        expect(component.labelWidth).toBe(LabelWidth.Small);
      });
    });
  });
});
