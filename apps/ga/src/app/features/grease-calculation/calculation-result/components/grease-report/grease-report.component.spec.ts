import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject, Observable } from 'rxjs';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SettingsFacade } from '@ga/core/store';
import { CalculationParametersService } from '@ga/features/grease-calculation/calculation-parameters/services';
import { AppStoreButtonsComponent } from '@ga/shared/components/app-store-buttons/app-store-buttons.component';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';
import {
  GREASE_RESULT_SUBORDINATES_MOCK,
  greaseResultMock,
} from '@ga/testing/mocks';

import {
  CONCEPT1,
  GreaseReportSubordinate,
  GreaseReportSubordinateTitle,
  SUITABILITY_LABEL,
} from '../../models';
import { GreaseReportService } from '../../services/grease-report.service';
import { GreaseReportInputComponent } from '../grease-report-input/grease-report-input.component';
import { GreaseReportResultComponent } from '../grease-report-result';
import { GreaseReportComponent } from './grease-report.component';

describe('GreaseReportComponent', () => {
  let component: GreaseReportComponent;
  let spectator: Spectator<GreaseReportComponent>;
  let snackBar: MatSnackBar;
  const localizeNumber = jest.fn();
  const localeChanges$ = new Observable();
  const isAppEmbeddedSubject = new BehaviorSubject<boolean>(false);
  const isAppEmbedded$ = isAppEmbeddedSubject.asObservable();

  const createComponent = createComponentFactory({
    component: GreaseReportComponent,
    imports: [
      CommonModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
      MatExpansionModule,
      MatSnackBarModule,
      GreaseReportInputComponent,
      GreaseReportResultComponent,
    ],
    providers: [
      mockProvider(GreaseReportService),
      mockProvider(CalculationParametersService),
      mockProvider(TranslocoLocaleService, { localizeNumber, localeChanges$ }),
      mockProvider(AppAnalyticsService),
      mockProvider(SettingsFacade, { appIsEmbedded$: isAppEmbedded$ }),
      provideHttpClient(),
    ],
  });

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
      }),
    });
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    snackBar = spectator.inject(MatSnackBar);
    snackBar.open = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getJsonReport if jsonReport is set', () => {
      component.greaseReportUrl = 'jup';
      component['fetchGreaseReport'] = jest.fn();

      component.ngOnInit();

      expect(component['fetchGreaseReport']).toHaveBeenCalledTimes(1);
    });
    it('should do nothing if jsonReport and htmlReport are not set', () => {
      component['fetchGreaseReport'] = jest.fn();

      component.ngOnInit();

      expect(component['fetchGreaseReport']).not.toHaveBeenCalled();
    });
  });

  describe('isGreaseResultSection', () => {
    it('should return true if the titleID is the result titleID', () => {
      const result = component.isGreaseResultSection(
        GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
      );

      expect(result).toBeTruthy();
    });

    it('should return false if the titleID is not the result titleID', () => {
      const result = component.isGreaseResultSection(
        GreaseReportSubordinateTitle.STRING_OUTP_INPUT
      );

      expect(result).toBeFalsy();
    });
  });

  describe('toggleLimitResults', () => {
    it('should toggle the limitResults component var', () => {
      component.limitResults = false;

      component.toggleLimitResults();

      expect(component.limitResults).toBeTruthy();
    });
  });

  describe('limitSubordinates', () => {
    it('should limit the subordinate to the amount of limitResults', () => {
      component.limitResults = true;
      const mockLength = 2;
      component.resultsLimit = mockLength;

      const result = component.limitSubordinates(
        GREASE_RESULT_SUBORDINATES_MOCK[1]
          .subordinates as GreaseReportSubordinate[],
        GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
      );

      expect(result).toHaveLength(mockLength);
    });

    it('should not limit the subordinate to the amount of limitResults', () => {
      component.limitResults = false;
      component.resultsLimit = 2;

      const result = component.limitSubordinates(
        GREASE_RESULT_SUBORDINATES_MOCK[1]
          .subordinates as GreaseReportSubordinate[],
        GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
      );

      expect(result).toHaveLength(3);
    });
  });

  describe('getResultAmount', () => {
    it('should set the length of allResultAmount', () => {
      const getResultAmountSpy = jest.spyOn(
        component['greaseReportService'],
        'getResultAmount'
      );
      component.subordinates = GREASE_RESULT_SUBORDINATES_MOCK;

      component.getResultAmount();

      expect(getResultAmountSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRemainingResultAmount', () => {
    it('should set the length of allResultAmount - 3', () => {
      component.getResultAmount = jest.fn(() => 5);

      const result = component.getRemainingResultAmount();

      expect(result).toBe(2);
    });
  });

  describe('concept1Impossible', () => {
    it('should return if all greases are unsuited', () => {
      component.automaticLubrication = true;
      component.subordinates = GREASE_RESULT_SUBORDINATES_MOCK.map(
        (subordinate) =>
          subordinate.titleID ===
          GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
            ? {
                ...subordinate,
                subordinates: [
                  {
                    greaseResult: {
                      ...greaseResultMock,
                      dataSource: [
                        {
                          title: 'concept1',
                          custom: {
                            selector: CONCEPT1,
                            data: {
                              label: SUITABILITY_LABEL.UNSUITED,
                            },
                          },
                        },
                        ...greaseResultMock.dataSource,
                      ],
                    },
                    identifier: 'greaseResult',
                  },
                ],
              }
            : subordinate
      );

      component.getResultAmount();

      expect(component.concept1Impossible()).toBe(true);
    });
  });

  describe('logTogglingInputSection', () => {
    it('should call the logInteractionEvent method', () => {
      const trackingSpy = jest.spyOn(
        component['appAnalyticsService'],
        'logInteractionEvent'
      );

      component.logTogglingInputSection();

      expect(trackingSpy).toHaveBeenCalledWith(InteractionEventType.ShowInput);
    });
  });

  describe('when app is embedded', () => {
    beforeEach(() => {
      isAppEmbeddedSubject.next(true);
    });

    it('should display app store buttons', () => {
      spectator.detectChanges();
      const appStoreButtons = spectator.query(AppStoreButtonsComponent);

      expect(appStoreButtons).toBeTruthy();
    });
  });

  describe('when app is not embedded', () => {
    beforeEach(() => {
      isAppEmbeddedSubject.next(false);
    });

    it('should not display app store buttons', () => {
      spectator.detectChanges();
      const appStoreButtons = spectator.query(AppStoreButtonsComponent);

      expect(appStoreButtons).toBeFalsy();
    });
  });
});
