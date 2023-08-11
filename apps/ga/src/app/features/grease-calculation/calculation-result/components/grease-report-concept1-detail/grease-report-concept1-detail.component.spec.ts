import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { MockModule } from 'ng-mocks';

import { RotaryControlComponent } from '@schaeffler/controls';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GREASE_CONCEPT1_SUITABILITY } from '@ga/testing/mocks/models/grease-concept1-suitability.mock';

import { CONCEPT1_SIZES } from '../../models';
import { GreaseReportConcept1DetailComponent } from './grease-report-concept1-detail.component';
jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('GreaseReportConcept1DetailComponent', () => {
  let component: GreaseReportConcept1DetailComponent;
  let spectator: Spectator<GreaseReportConcept1DetailComponent>;

  const createComponent = createComponentFactory({
    component: GreaseReportConcept1DetailComponent,
    imports: [
      CommonModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(MatTooltipModule),
      RotaryControlComponent,
      RouterTestingModule,
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
    it('should output the 125ml CONCEPT1 if concept1Selection is on 125', () => {
      component.concept1Selection = CONCEPT1_SIZES['125ML'];

      expect(component.getDurationMonths()).toBe(
        GREASE_CONCEPT1_SUITABILITY.c1_125
      );
    });

    it('should output the 60ml CONCEPT1 if there is only a 60ml value', () => {
      component.concept1Selection = CONCEPT1_SIZES['60ML'];

      expect(component.getDurationMonths()).toBe(
        GREASE_CONCEPT1_SUITABILITY.c1_60
      );
    });
  });

  describe('onHideDetails', () => {
    it('should emit hideDetails EventEmiiter', () => {
      const hideDetailsSpy = jest.spyOn(component.hideDetails, 'emit');

      component.onHideDetails();

      expect(hideDetailsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabledOption', () => {
    it('should return false if settings contains a value', () => {
      component.settings = GREASE_CONCEPT1_SUITABILITY;

      expect(component.disabledOption(CONCEPT1_SIZES['125ML'])).toBeFalsy();
    });

    it('should return true if settings contains no value', () => {
      component.settings = {
        ...GREASE_CONCEPT1_SUITABILITY,
        c1_125: undefined,
      };

      expect(component.disabledOption(CONCEPT1_SIZES['125ML'])).toBeTruthy();
    });

    describe('getConcept1InfoUrl', () => {
      it('should return a valid concept1 url', () => {
        expect(component.getConcept1InfoUrl()).toBe(
          'calculationResult.shopBaseUrl/calculationResult.concept1Link'
        );
      });
    });
  });

  describe('when get tooltip is called', () => {
    beforeEach(() => {
      component.settings.hint_60 =
        'some 60 ml hint message for enabled or disabled';
      component.settings.hint_125 =
        'some 125 ml hint message for enabled or disabled';
    });

    it('should return correct message for 60ml size', () => {
      const message = component.getTooltip(60);

      expect(message).toBe(component.settings.hint_60);
    });

    it('should return correct message for 125ml size', () => {
      const message = component.getTooltip(125);

      expect(message).toBe(component.settings.hint_125);
    });
  });
});
