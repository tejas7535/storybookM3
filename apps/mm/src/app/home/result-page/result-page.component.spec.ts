import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';

import { of, throwError } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { ReportModule } from '@schaeffler/report';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { environment } from '../../../environments/environment';
import { BEARING_CALCULATION_REPORT_RESULT_MOCK } from '../../../testing/mocks/result-page.service.mock';
import { ResultPageComponent } from './result-page.component';
import { ResultPageService } from './result-page.service';

describe('ResultPageComponent', () => {
  let component: ResultPageComponent;
  let spectator: Spectator<ResultPageComponent>;
  let resultPageService: ResultPageService;
  let snackBar: MatSnackBar;

  const createComponent = createComponentFactory({
    component: ResultPageComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      ReportModule,
      PushPipe,
      MatSnackBarModule,
      ApplicationInsightsModule.forRoot(environment.applicationInsights),
    ],
    declarations: [ResultPageComponent],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      ResultPageService,
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      provideMockStore({}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    resultPageService = spectator.inject(ResultPageService);
    snackBar = spectator.inject(MatSnackBar);
    const location: Location = window.location;
    delete window.location;
    window.location = {
      ...location,
      reload: jest.fn(),
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(resultPageService).toBeTruthy();
  });

  describe('#send', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call getResult fn of restPageService', () => {
      const mockForm = {
        getRawValue() {
          return {
            objects: [
              {
                properties: [
                  {
                    name: 'mockName',
                    value: 'mockValue',
                  },
                ],
              },
            ],
          };
        },
      };

      component['resultPageService'].getResult = jest.fn(() =>
        of(BEARING_CALCULATION_REPORT_RESULT_MOCK)
      );
      component['resultPageService'].getPdfReportReady = jest.fn(() =>
        of(true)
      );

      component.send(mockForm as FormGroup);

      jest.advanceTimersByTime(3000);

      expect(component['resultPageService'].getResult).toHaveBeenCalledWith({
        mockName: 'mockValue',
      });

      expect(component.result$.value).toEqual(
        BEARING_CALCULATION_REPORT_RESULT_MOCK
      );
      expect(
        component['resultPageService'].getPdfReportReady
      ).toHaveBeenCalledWith(
        BEARING_CALCULATION_REPORT_RESULT_MOCK.pdfReportUrl
      );
      expect(component.pdfReportReady$.value).toEqual(true);
    });

    it('should display a snackbar error msg if the restPageService throws an error', () => {
      const mockForm = {
        getRawValue() {
          return {
            objects: [
              {
                properties: [
                  {
                    name: 'errorBait',
                    value: 'properlyBadValue',
                  },
                ],
              },
            ],
          };
        },
      };
      component['resultPageService'].getResult = jest.fn(() =>
        throwError(() => new Error('sometext'))
      );
      component['resultPageService'].getPdfReportReady = jest.fn(() =>
        of(true)
      );
      component['snackbar'].open = jest.fn();

      component.send(mockForm as FormGroup);

      jest.advanceTimersByTime(3000);
      expect(snackBar.open).toBeCalledTimes(1);

      expect(component['resultPageService'].getResult).toHaveBeenCalledWith({
        errorBait: 'properlyBadValue',
      });

      expect(component.result$.value).toEqual(undefined);
      expect(
        component['resultPageService'].getPdfReportReady
      ).not.toHaveBeenCalled();
      expect(component.pdfReportReady$.value).toEqual(false);
      expect(component.error$.value).toBeDefined();
    });
  });

  describe('#resetWizard', () => {
    it('should console log for now', () => {
      const reloadSpy = jest.spyOn(window.location, 'reload');

      component.resetWizard();

      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });
  });
});
