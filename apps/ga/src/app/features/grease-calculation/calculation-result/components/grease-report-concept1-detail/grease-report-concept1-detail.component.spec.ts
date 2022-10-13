import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { MockModule } from 'ng-mocks';

import { RotaryControlComponent } from '@schaeffler/controls';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GREASE_CONCEPT1_SUITABILITY } from '@ga/testing/mocks/models/grease-concept1-suitability.mock';

import { MEDIASGREASE } from '../../constants';
import * as greasehelpers from '../../helpers/grease-helpers';
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

    describe('getShortTitle', () => {
      it('should return a valid concept1 url', () => {
        const getShortTitleSpy = jest.spyOn(greasehelpers, 'shortTitle');
        const mockTitle = 'Superlube 300';
        component.title = mockTitle;

        component.getShortTitle();

        expect(getShortTitleSpy).toHaveBeenCalledWith(mockTitle);
      });
    });

    describe('getConcept1InfoUrl', () => {
      it('should return a valid concept1 url', () => {
        expect(component.getConcept1InfoUrl()).toBe(
          'calculationResult.shopBaseUrl/calculationResult.concept1Link'
        );
      });
    });

    describe('getConcept1InShop', () => {
      it('should return a valid concept1 url', () => {
        const concept1InShopSpy = jest.spyOn(greasehelpers, 'concept1InShop');
        const mockTitle = 'Superlube 300';
        component.title = mockTitle;

        component.getConcept1InShop();

        expect(concept1InShopSpy).toHaveBeenCalledWith(
          component.title,
          component.concept1Selection
        );
      });
    });

    describe('getConcept1ShopUrl', () => {
      it('should return a concrete shop url', () => {
        const mockTitle = 'FOOD 2';
        component.title = mockTitle;
        component.concept1Selection = CONCEPT1_SIZES['60ML'];

        expect(component.getConcept1ShopUrl()).toBe(
          'calculationResult.shopBaseUrl/search/searchpage?text=ARCALUB-C1-60-FOOD2'
        );
      });

      it('should return the refillable shop url', () => {
        const mockTitle = 'FANTASY 2';
        component.title = mockTitle;
        component.concept1Selection = CONCEPT1_SIZES['125ML'];

        expect(component.getConcept1ShopUrl()).toBe(
          'calculationResult.shopBaseUrl/search/searchpage?text=ARCALUB-C1-125-REFILLABLE'
        );
      });
    });
  });

  describe('#trackConcep1Selection', () => {
    it('should call the logEvent method', () => {
      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      const mockTitle = 'FOOD 2';
      component.title = mockTitle;
      component.concept1Selection = CONCEPT1_SIZES['60ML'];

      component.trackConcept1Selection();

      expect(trackingSpy).toHaveBeenCalledWith(MEDIASGREASE, {
        grease: 'CONCEPT1 FOOD 2 60',
      });
    });
  });
});
