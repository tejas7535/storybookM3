import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';

import { ReportParserService } from '@mm/core/services/report-parser/report-parser.service';
import { ResultPageService } from '@mm/core/services/result-page/result-page.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { CalculationSelectionFacade } from '../../facades/calculation-selection/calculation-selection.facade';
import { CalculationResultEffects } from './calculation-result.effects';

describe('CalculationResultEffects', () => {
  let actions$: Observable<Action>;
  let effects: CalculationResultEffects;
  let spectator: SpectatorService<CalculationResultEffects>;

  const resultPageServiceMock = {
    getJsonReport: jest.fn(),
    getResult: jest.fn(),
  };

  const reportParserServiceMock = {
    parseResponse: jest.fn(),
  };

  const createService = createServiceFactory({
    service: CalculationResultEffects,
    providers: [
      provideMockStore(),
      provideMockActions(() => actions$),
      { provide: ResultPageService, useValue: resultPageServiceMock },
      { provide: ReportParserService, useValue: reportParserServiceMock },

      {
        provide: CalculationSelectionFacade,
        useValue: {
          getBearing$: jest.fn(),
          getBearingSeatId$: jest.fn(),
          getCurrentStep$: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    effects = spectator.service;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('fetchCalculationJsonResult$', () => {
    it('should fetch calculation json result', () => {
      const fetchSpy = jest
        .spyOn(resultPageServiceMock, 'getJsonReport')
        .mockImplementation(() => of('result-from-service'));

      const parserSpy = jest
        .spyOn(reportParserServiceMock, 'parseResponse')
        .mockImplementation(() => 'parsed-result-from-service');

      const jsonReportUrl = 'https://bearing-api/report.json';

      return marbles((m) => {
        const action = CalculationResultActions.fetchCalculationJsonResult({
          jsonReportUrl,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: CalculationResultActions.setCalculationJsonResult({
            result: 'parsed-result-from-service' as any,
          }),
          c: CalculationSelectionActions.setCurrentStep({ step: 4 }),
        });

        m.expect(effects.fetchCalculationJsonResult$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
        expect(parserSpy).toHaveBeenCalled();
      })();
    });

    it('should handle failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { detail: 'Error detail' },
        status: 500,
      });

      jest
        .spyOn(resultPageServiceMock, 'getJsonReport')
        .mockImplementation(() => throwError(() => errorResponse));

      const jsonReportUrl = 'https://bearing-api/report.json';

      return marbles((m) => {
        const action = CalculationResultActions.fetchCalculationJsonResult({
          jsonReportUrl,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: CalculationResultActions.fetchCalculationJsonResultFailure({
            error: 'Error detail',
          }),
        });

        m.expect(effects.fetchCalculationJsonResult$).toBeObservable(expected);
        m.flush();
      })();
    });
  });
});
