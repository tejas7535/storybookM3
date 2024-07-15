import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PartnerAfiliateCode, PartnerVersion } from '@ga/shared/models';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { GREASE_CONCEPT1_SUITABILITY } from '@ga/testing/mocks/models/grease-concept1-suitability.mock';

import { MEDIASGREASE } from '../../constants';
import * as greasehelpers from '../../helpers/grease-helpers';
import { CONCEPT1_SIZES, GreaseResult } from '../../models';
import { GreaseReportShopButtonsComponent } from './grease-report-shop-buttons.component';

describe('GreaseReportShopButtonsComponent', () => {
  let component: GreaseReportShopButtonsComponent;
  let spectator: Spectator<GreaseReportShopButtonsComponent>;

  const createComponent = createComponentFactory({
    component: GreaseReportShopButtonsComponent,
    imports: [
      CommonModule,
      HttpClientModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(MatTooltipModule),
      RouterTestingModule,
    ],
    providers: [MockProvider(AppAnalyticsService)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    component.settings = GREASE_CONCEPT1_SUITABILITY;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getShortTitle', () => {
    it('should return a valid concept1 url', () => {
      const getShortTitleSpy = jest.spyOn(greasehelpers, 'shortTitle');
      const mockTitle = 'Superlube 300';
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;

      component.getShortTitle();

      expect(getShortTitleSpy).toHaveBeenCalledWith(mockTitle);
    });
  });

  describe('getConcept1InShop', () => {
    it('should return a valid concept1 url', () => {
      const concept1InShopSpy = jest.spyOn(greasehelpers, 'concept1InShop');
      const mockTitle = 'Superlube 300';
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;

      component.getConcept1InShop();

      expect(concept1InShopSpy).toHaveBeenCalledWith(
        mockTitle,
        component.concept1Selection
      );
    });
  });

  describe('getConcept1ShopUrl', () => {
    it('should return a concrete shop url', () => {
      const mockTitle = 'FOOD 2';
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;
      component.concept1Selection = CONCEPT1_SIZES['60ML'];

      expect(component.getConcept1ShopUrl()).toBe(
        'calculationResult.shopBaseUrl/p/ARCALUB-C1-60-FOOD2?utm_source=grease-app'
      );
    });

    it('should return the refillable shop url', () => {
      const mockTitle = 'FANTASY 2';
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;
      component.concept1Selection = CONCEPT1_SIZES['125ML'];

      expect(component.getConcept1ShopUrl()).toBe(
        'calculationResult.shopBaseUrl/p/ARCALUB-C1-125-REFILLABLE?utm_source=grease-app'
      );
    });

    describe('when partner version is provided', () => {
      beforeEach(() => {
        const mockTitle = 'FOOD 2';
        component.greaseResult = { mainTitle: mockTitle } as GreaseResult;
        component.concept1Selection = CONCEPT1_SIZES['60ML'];
        component.partnerVersion = PartnerVersion.Schmeckthal;
      });

      it('should provide link with partner affiliate code', () => {
        const code = PartnerAfiliateCode[PartnerVersion.Schmeckthal];

        expect(component.getConcept1ShopUrl()).toBe(
          `calculationResult.shopBaseUrl/p/ARCALUB-C1-60-FOOD2?utm_source=grease-app&${code}`
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
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;
      component.concept1Selection = CONCEPT1_SIZES['60ML'];

      component.trackConcept1Selection();

      expect(trackingSpy).toHaveBeenCalledWith(MEDIASGREASE, {
        grease: 'CONCEPT1 FOOD 2 60',
      });
    });

    it('should call the logOpenExternalLinkEvent method', () => {
      const trackingSpy = jest.spyOn(
        component['appAnalyticsService'],
        'logOpenExternalLinkEvent'
      );

      const mockTitle = 'FOOD 2';
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;
      component.concept1Selection = CONCEPT1_SIZES['60ML'];

      component.trackConcept1Selection();

      expect(trackingSpy).toHaveBeenCalledWith('CONCEPT1 FOOD 2 60');
    });
  });

  describe('getShopUrl', () => {
    beforeEach(() => {
      const mockTitle = 'Arcanol MULTI2';
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;
    });

    it('should return a valid url', () => {
      expect(component.getShopUrl()).toBe(
        'calculationResult.shopBaseUrl/p/Arcanol-MULTI2-1kg?utm_source=grease-app'
      );
    });

    describe('when partner version is provided', () => {
      beforeEach(() => {
        component.partnerVersion = PartnerVersion.Schmeckthal;
      });

      it('should provide link with partner affiliate code', () => {
        const code = PartnerAfiliateCode[PartnerVersion.Schmeckthal];

        expect(component.getShopUrl()).toBe(
          `calculationResult.shopBaseUrl/p/Arcanol-MULTI2-1kg?utm_source=grease-app&${code}`
        );
      });
    });
  });

  describe('getLinkText', () => {
    it('should return the link text', () => {
      const mockTitle = 'Arcanol MULTI2';
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;
      expect(component.getLinkText()).toBe('Arcanol MULTI2 1kg');
    });
  });

  describe('#trackGreaseSelection', () => {
    it('should call the logEvent method', () => {
      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      const mockTitle = 'Arcanol MULTI2';
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;

      component.trackGreaseSelection();

      expect(trackingSpy).toHaveBeenCalledWith(MEDIASGREASE, {
        grease: 'Arcanol MULTI2',
      });
    });

    it('should call the logOpenExternalLinkEvent method', () => {
      const trackingSpy = jest.spyOn(
        component['appAnalyticsService'],
        'logOpenExternalLinkEvent'
      );

      const mockTitle = 'Arcanol MULTI2';
      component.greaseResult = { mainTitle: mockTitle } as GreaseResult;

      component.trackGreaseSelection();

      expect(trackingSpy).toHaveBeenCalledWith('Arcanol MULTI2');
    });
  });
});
