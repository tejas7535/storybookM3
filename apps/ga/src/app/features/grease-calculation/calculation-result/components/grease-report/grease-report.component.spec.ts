import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
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
import { provideMockStore } from '@ngrx/store/testing';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SettingsFacade } from '@ga/core/store';
import {
  getCompetitorsGreases,
  getSchaefflerGreases,
} from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import {
  getResultMessages,
  hasResultMessage,
} from '@ga/core/store/selectors/calculation-result/calculation-result.selector';
import { CalculationParametersService } from '@ga/features/grease-calculation/calculation-parameters/services';
import { AppStoreButtonsComponent } from '@ga/shared/components/app-store-buttons/app-store-buttons.component';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';

import {
  GreaseReportSubordinate,
  GreaseResult,
  GreaseResultReport,
  SUITABILITY_LABEL,
} from '../../models';
import { GreaseResultDataSourceService } from '../../services';
import { GreaseReportService } from '../../services/grease-report.service';
import { GreaseReportInputComponent } from '../grease-report-input/grease-report-input.component';
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
      MatIconModule,
      MatButtonModule,
    ],
    providers: [
      provideMockStore({
        initialState: {},
        selectors: [
          {
            selector: getCompetitorsGreases,
            value: [],
          },
          {
            selector: getSchaefflerGreases,
            value: [],
          },
          {
            selector: getResultMessages,
            value: [],
          },
          {
            selector: hasResultMessage,
            value: false,
          },
        ],
      }),
      {
        provide: GreaseReportService,
        useValue: {
          _greaseResultReport: signal<GreaseResultReport | undefined>({
            greaseResult: [],
            inputs: {
              subordinates: [],
            },
            errorWarningsAndNotes: {
              title: '',
              identifier: '',
              subordinates: [],
            } as unknown as GreaseResultReport['errorWarningsAndNotes'],
          } as GreaseResultReport),
          subordinates: signal<GreaseReportSubordinate[]>([]),
          getGreaseReport: jest.fn(),
        },
      },
      mockProvider(GreaseResultDataSourceService),
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

    spectator.detectChanges();

    snackBar = spectator.inject(MatSnackBar);
    snackBar.open = jest.fn();
  });

  it('should be created', () => {
    component['greaseReportService']['_greaseResultReport'].set(
      {} as GreaseResultReport
    );
    spectator.detectChanges();
    component['greaseReportService']['_greaseResultReport'].set(
      {} as GreaseResultReport
    );
    spectator.detectChanges();
    component['greaseReportService']['_greaseResultReport'].set(
      {} as GreaseResultReport
    );
    spectator.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getJsonReport if jsonReport is set', () => {
      component['fetchGreaseReport'] = jest.fn();

      spectator.setInput('greaseReportUrl', 'jup');
      spectator.detectChanges();

      component.ngOnInit();
      expect(component['fetchGreaseReport']).toHaveBeenCalledTimes(1);
    });
    it('should do nothing if jsonReport and htmlReport are not set', () => {
      component['fetchGreaseReport'] = jest.fn();

      component.ngOnInit();

      expect(component['fetchGreaseReport']).not.toHaveBeenCalled();
    });
  });

  describe('limitSubordinates', () => {
    it('should limit the subordinate to the amount of limitResults', () => {
      const mockLength = 2;
      component.resultsLimit = mockLength;

      component['greaseReportService']['_greaseResultReport'].set({
        greaseResult: [
          {} as GreaseResult,
          {} as GreaseResult,
          {} as GreaseResult,
          {} as GreaseResult,
          {} as GreaseResult,
        ],
      } as GreaseResultReport);

      component.limitResults.set(true);

      expect(component.greaseResults()).toHaveLength(mockLength);
    });

    it('should not limit the subordinate to the amount of limitResults', () => {
      const mockLength = 2;
      component.resultsLimit = mockLength;

      component['greaseReportService']['_greaseResultReport'].set({
        greaseResult: [
          {} as GreaseResult,
          {} as GreaseResult,
          {} as GreaseResult,
          {} as GreaseResult,
          {} as GreaseResult,
        ],
      } as GreaseResultReport);

      component.limitResults.set(false);

      expect(component.greaseResults()).toHaveLength(5);
    });
  });

  describe('getResultAmount', () => {
    it('should set the length of allResultAmount', () => {
      component['greaseReportService']['_greaseResultReport'].set({
        greaseResult: [
          {} as GreaseResult,
          {} as GreaseResult,
          {} as GreaseResult,
          {} as GreaseResult,
          {} as GreaseResult,
        ],
      } as GreaseResultReport);

      expect(component.greaseResultAmount()).toBe(5);
    });
  });

  describe('concept1Impossible', () => {
    it('should return if all greases are unsuited', () => {
      component['greaseReportService']['_greaseResultReport'].set({
        greaseResult: [
          {
            relubrication: {
              concept1: {
                custom: {
                  data: {
                    label: SUITABILITY_LABEL.UNSUITED,
                  },
                },
              },
            },
          } as GreaseResult,
        ],
      } as GreaseResultReport);

      expect(component.concept1Impossible()).toBe(true);
    });

    it('should return if a grease is suited', () => {
      component['greaseReportService']['_greaseResultReport'].set({
        greaseResult: [
          {
            relubrication: {
              concept1: {
                custom: {
                  data: {
                    label: SUITABILITY_LABEL.SUITED,
                  },
                },
              },
            },
          } as GreaseResult,
        ],
      } as GreaseResultReport);

      expect(component.concept1Impossible()).toBe(false);
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
