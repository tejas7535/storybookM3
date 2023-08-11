import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { MockModule } from 'ng-mocks';

import { RotaryControlComponent } from '@schaeffler/controls';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GREASE_CONCEPT1_SUITABILITY } from '@ga/testing/mocks/models/grease-concept1-suitability.mock';

import { CONCEPT1_SIZES, SUITABILITY_LABEL } from '../../models';
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

      expect(component.getDurationSize()).toBe(CONCEPT1_SIZES['125ML']);
    });

    it('should return 60 if there is only a 60ml CONCEPT1 setting value', () => {
      component.settings = {
        ...GREASE_CONCEPT1_SUITABILITY,
        c1_125: undefined,
      };

      expect(component.getDurationSize()).toBe(CONCEPT1_SIZES['60ML']);
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

  describe('getTooltip', () => {
    it('should output the 125ml CONCEPT1 hint message if there is a setting value', () => {
      component.settings = GREASE_CONCEPT1_SUITABILITY;

      expect(component.getTooltip()).toBe(GREASE_CONCEPT1_SUITABILITY.hint_125);
    });

    it('should output the 60ml CONCEPT1 hint message if there is only a 60ml value', () => {
      component.settings = {
        ...GREASE_CONCEPT1_SUITABILITY,
        c1_125: undefined,
      };

      expect(component.getTooltip()).toBe(GREASE_CONCEPT1_SUITABILITY.hint_60);
    });
  });

  describe('onShowDetails', () => {
    it('should emit hideDetails EventEmiiter', () => {
      const showDetailsSpy = jest.spyOn(component.showDetails, 'emit');

      component.onShowDetails();

      expect(showDetailsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('isSuited', () => {
    it('should return true when the label is "SUITED"', () => {
      component.settings.label = SUITABILITY_LABEL.SUITED;
      expect(component.isSuited()).toBe(true);
    });

    it('should return false when the label is not "SUITED"', () => {
      component.settings.label = SUITABILITY_LABEL.CONDITIONAL;
      expect(component.isSuited()).toBe(false);
    });
  });

  describe('isUnSuited', () => {
    it('should return true when the label is "UNSUITED"', () => {
      component.settings.label = SUITABILITY_LABEL.UNSUITED;
      expect(component.isUnSuited()).toBe(true);
    });

    it('should return false when the label is not "UNSUITED"', () => {
      component.settings.label = SUITABILITY_LABEL.CONDITIONAL;
      expect(component.isUnSuited()).toBe(false);
    });
  });
});
