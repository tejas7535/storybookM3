import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CONCEPT1_LABEL_VALUE_MOCK, greaseResultMock } from '@ga/testing/mocks';
import { GREASE_CONCEPT1_SUITABILITY } from '@ga/testing/mocks/models/grease-concept1-suitability.mock';

import { MEDIASGREASE } from '../../constants';
import { CONCEPT1, SUITABILITY_LABEL } from '../../models';
import { GreaseReportResultComponent } from './grease-report-result.component';

window.ResizeObserver = resize_observer_polyfill;

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('GreaseReportResultComponent', () => {
  let component: GreaseReportResultComponent;
  let spectator: Spectator<GreaseReportResultComponent>;

  const createComponent = createComponentFactory({
    component: GreaseReportResultComponent,
    imports: [
      CommonModule,
      HttpClientModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    component.greaseResult = {
      ...greaseResultMock,
      dataSource: [
        {
          title: 'concept1',
          custom: {
            selector: CONCEPT1,
            data: {
              label: SUITABILITY_LABEL.SUITED,
            },
          },
        },
        ...greaseResultMock.dataSource,
        undefined,
      ],
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should assign data', () => {
      component.ngOnInit();

      expect(component.labelValues).toHaveLength(3);
    });
  });

  describe('getShopUrl', () => {
    it('should return a valid url', () => {
      expect(component.getShopUrl()).toBe(
        'calculationResult.shopBaseUrl/search/searchpage?text=Arcanol-MULTI2-1kg'
      );
    });
  });

  describe('getLinkText', () => {
    it('should return the link text', () => {
      expect(component.getLinkText()).toBe('Arcanol MULTI2 1kg');
    });
  });

  describe('getLabel', () => {
    it('should return a legit suitabilty label', () => {
      expect(component.getLabel()).toBe(SUITABILITY_LABEL.SUITED);
    });
  });

  describe('isSuited', () => {
    it('should return true when the label is "SUITED"', () => {
      component.greaseResult.dataSource[0].custom.data.label =
        SUITABILITY_LABEL.SUITED;
      expect(component.isSuited()).toBe(true);
    });

    it('should return false when the label is not "SUITED"', () => {
      component.greaseResult.dataSource[0].custom.data.label =
        SUITABILITY_LABEL.CONDITIONAL;
      expect(component.isSuited()).toBe(false);
    });
  });

  describe('isUnSuited', () => {
    it('should return true when the label is "UNSUITED"', () => {
      component.greaseResult.dataSource[0].custom.data.label =
        SUITABILITY_LABEL.UNSUITED;
      expect(component.isUnSuited()).toBe(true);
    });

    it('should return false when the label is not "UNSUITED"', () => {
      component.greaseResult.dataSource[0].custom.data.label =
        SUITABILITY_LABEL.CONDITIONAL;
      expect(component.isUnSuited()).toBe(false);
    });
  });

  describe('toggleShowValues', () => {
    it('should switch data amount', () => {
      component.toggleShowValues();
      expect(component.labelValues).toHaveLength(19);

      component.toggleShowValues();
      expect(component.labelValues).toHaveLength(3);
    });
  });

  describe('#trackGreaseSelection', () => {
    it('should call the logEvent method', () => {
      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      component.trackGreaseSelection();

      expect(trackingSpy).toHaveBeenCalledWith(MEDIASGREASE, {
        grease: 'Arcanol MULTI2',
      });
    });
  });

  describe('toggleShowConcept1Details', () => {
    it('should set', () => {
      component.showConcept1Details = true;

      component.toggleShowConcept1Details();
      expect(component.showConcept1Details).toBeFalsy();
    });
  });

  describe('getSettings', () => {
    it('should return the concept1 settings form the labelvalue pairs', () => {
      expect(component.getSettings(CONCEPT1_LABEL_VALUE_MOCK)).toBe(
        GREASE_CONCEPT1_SUITABILITY
      );
    });
  });
});
