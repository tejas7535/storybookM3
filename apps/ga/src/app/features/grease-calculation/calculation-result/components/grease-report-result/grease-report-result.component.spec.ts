import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { MockProvider } from 'ng-mocks';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { generalHighTemperature } from '@ga/shared/constants';
import { EmbeddedGoogleAnalyticsService } from '@ga/shared/services';
import { InteractionEventType } from '@ga/shared/services/embedded-google-analytics/interaction-event-type.enum';
import { CONCEPT1_LABEL_VALUE_MOCK, greaseResultMock } from '@ga/testing/mocks';
import { GREASE_CONCEPT1_SUITABILITY } from '@ga/testing/mocks/models/grease-concept1-suitability.mock';

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
    providers: [MockProvider(EmbeddedGoogleAnalyticsService)],
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

  describe('toggleShowValues', () => {
    it('should switch data amount', () => {
      component.toggleShowValues();
      expect(component.labelValues).toHaveLength(19);

      component.toggleShowValues();
      expect(component.labelValues).toHaveLength(3);
    });

    it('should call the logInteractionEvent method', () => {
      const trackingSpy = jest.spyOn(
        component['embeddedGoogleAnalyticsService'],
        'logInteractionEvent'
      );

      component.toggleShowValues();

      expect(trackingSpy).toHaveBeenCalledWith(
        InteractionEventType.ShowAllValues
      );
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
      expect(component.getSettings(CONCEPT1_LABEL_VALUE_MOCK)).toStrictEqual(
        GREASE_CONCEPT1_SUITABILITY
      );
    });
  });

  describe('showSubtitle', () => {
    it('should return the grease result main subtitle by default', () => {
      expect(component.showSubtitle()).toBe(component.greaseResult.subTitle);
    });

    it('should return the grease result main subtitle with a hint', () => {
      component.preferredGreaseResult = {
        ...component.preferredGreaseResult,
        text: generalHighTemperature.name,
      };

      const expectedSubTitle = `${component.greaseResult.subTitle}<br/>(calculationResult.compatibilityCheck)`;
      expect(component.showSubtitle()).toBe(expectedSubTitle);
    });
  });

  describe('isAlternative', () => {
    it('should return false if not part of the alternative array', () => {
      component.preferredGreaseResult = {
        ...component.preferredGreaseResult,
        text: generalHighTemperature.name,
      };
      expect(component.isAlternative()).toBeFalsy();
    });

    it('should return true if part of the alternative array', () => {
      component.greaseResult = {
        ...component.greaseResult,
        mainTitle: 'Arcanol TEMP90',
      };

      component.preferredGreaseResult = {
        ...component.preferredGreaseResult,
        text: generalHighTemperature.name,
      };
      expect(component.isAlternative()).toBeTruthy();
    });
  });
});
