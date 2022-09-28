import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { MockModule } from 'ng-mocks';

import { RotaryControlComponent } from '@schaeffler/controls';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GREASE_CONCEPT1_SUITABILITY } from '@ga/testing/mocks/models/grease-concept1-suitability.mock';

import { GreaseReportConcept1Component } from './grease-report-concept1.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('GreaseReportConcept1Component', () => {
  let component: GreaseReportConcept1Component;
  let spectator: Spectator<GreaseReportConcept1Component>;

  const createComponent = createComponentFactory({
    component: GreaseReportConcept1Component,
    imports: [
      CommonModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(MatTooltipModule),
      RotaryControlComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    component.settings = GREASE_CONCEPT1_SUITABILITY;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getDurationMonths', () => {
    it('should output the 125ml CONCEPT1 if there is a setting value', () => {
      component.settings = GREASE_CONCEPT1_SUITABILITY;

      expect(component.getDurationMonths()).toBe(
        GREASE_CONCEPT1_SUITABILITY.c1_125
      );
    });

    it('should output the 60ml CONCEPT1 if there is only a 60ml value', () => {
      component.settings = {
        ...GREASE_CONCEPT1_SUITABILITY,
        c1_125: undefined,
      };

      expect(component.getDurationMonths()).toBe(
        GREASE_CONCEPT1_SUITABILITY.c1_60
      );
    });

    it('should output undefined if there is no value', () => {
      component.settings = {
        ...GREASE_CONCEPT1_SUITABILITY,
        c1_125: undefined,
        c1_60: undefined,
      };

      expect(component.getDurationMonths()).toBe(undefined);
    });
  });

  describe('getDurationSize', () => {
    it('should return 125 if there is a 125ml CONCEPT1 setting value', () => {
      component.settings = GREASE_CONCEPT1_SUITABILITY;

      expect(component.getDurationSize()).toBe('125');
    });

    it('should return 60 if there is only a 60ml CONCEPT1 setting value', () => {
      component.settings = {
        ...GREASE_CONCEPT1_SUITABILITY,
        c1_125: undefined,
      };

      expect(component.getDurationSize()).toBe('60');
    });

    it('should output undefined if there is no value', () => {
      component.settings = {
        ...GREASE_CONCEPT1_SUITABILITY,
        c1_125: undefined,
        c1_60: undefined,
      };

      expect(component.getDurationSize()).toBe(undefined);
    });
  });
});
