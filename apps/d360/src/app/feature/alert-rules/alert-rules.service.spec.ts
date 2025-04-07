import { HttpContext, HttpParams } from '@angular/common/http';

import { of, take, throwError } from 'rxjs';

import { MessageType } from '../../shared/models/message-type.enum';
import { Stub } from '../../shared/test/stub.class';
import { ValidationHelper } from '../../shared/utils/validation/validation-helper';
import { AlertRulesService } from './alert-rules.service';
import { AlertRule, AlertRuleResponse, AlertRuleSaveResponse } from './model';

describe('AlertRulesService', () => {
  let service: AlertRulesService;

  beforeEach(() => {
    service = Stub.get<AlertRulesService>({
      component: AlertRulesService,
    });

    jest
      .spyOn(ValidationHelper.localeService, 'localizeDate')
      .mockReturnValue('11/23/2024');

    jest.spyOn(ValidationHelper, 'getDateFormat').mockReturnValue('yyyy-mm-dd');
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getRuleTypeData', () => {
    let getCurrentCurrencySpy: jest.SpyInstance;
    let httpGetSpy: jest.SpyInstance;

    beforeEach(() => {
      getCurrentCurrencySpy = jest
        .spyOn(service['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of('USD'));
      httpGetSpy = jest.spyOn(service['http'], 'get').mockReturnValue(
        of([
          { id: '1', description: 'Type 1' },
          { id: '2', description: 'Type 2' },
        ])
      );
      jest
        .spyOn(service['translocoService'], 'getActiveLang')
        .mockReturnValue('en');
    });

    it('should cache the observable if ruleTypeData$ is undefined', () => {
      service['ruleTypeData$'] = undefined;
      service.getRuleTypeData().pipe(take(1)).subscribe();
      expect(getCurrentCurrencySpy).toHaveBeenCalled();
      expect(httpGetSpy).toHaveBeenCalledWith(service['ALERT_TYPE_SET_API'], {
        params: new HttpParams().set('language', 'en').set('currency', 'USD'),
      });
    });

    it('should return the cached observable if ruleTypeData$ is defined', () => {
      const cachedObservable = of([
        { id: '1', description: 'Type 1' },
        { id: '2', description: 'Type 2' },
      ] as any);
      service['ruleTypeData$'] = cachedObservable;
      service
        .getRuleTypeData()
        .pipe(take(1))
        .subscribe((data) => {
          expect(data).toEqual([
            { id: '1', description: 'Type 1' },
            { id: '2', description: 'Type 2' },
          ]);
        });
      expect(getCurrentCurrencySpy).not.toHaveBeenCalled();
      expect(httpGetSpy).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', (done) => {
      httpGetSpy.mockReturnValue(throwError(() => new Error('Error')));
      service['ruleTypeData$'] = undefined;
      service
        .getRuleTypeData()
        .pipe(take(1))
        .subscribe({
          error: (error) => {
            expect(error).toBeInstanceOf(Error);
            done();
          },
        });
    });

    it('should share the observable and cache the latest emitted value', (done) => {
      service['ruleTypeData$'] = undefined;
      const observable = service.getRuleTypeData();
      observable.pipe(take(1)).subscribe();
      observable.pipe(take(1)).subscribe((data) => {
        expect(data).toEqual([
          { id: '1', description: 'Type 1' },
          { id: '2', description: 'Type 2' },
        ]);
        done();
      });
    });
  });

  describe('getAlertRuleData', () => {
    let getCurrentCurrencySpy: jest.SpyInstance;
    let httpGetSpy: jest.SpyInstance;

    beforeEach(() => {
      getCurrentCurrencySpy = jest
        .spyOn(service['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of('USD'));
      httpGetSpy = jest.spyOn(service['http'], 'get').mockReturnValue(
        of({
          count: 1,
          content: [{ id: '1', name: 'Test Rule' } as any],
        } as AlertRuleResponse)
      );
    });

    it('should call getCurrentCurrency and http.get with correct params', () => {
      service.getAlertRuleData().pipe(take(1)).subscribe();
      expect(getCurrentCurrencySpy).toHaveBeenCalled();
      expect(httpGetSpy).toHaveBeenCalledWith(service['ALERT_RULES_API'], {
        params: new HttpParams().set('currency', 'USD'),
      });
    });

    it('should return the correct AlertRuleResponse', (done) => {
      service
        .getAlertRuleData()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            count: 1,
            content: [{ id: '1', name: 'Test Rule' }],
          });
          done();
        });
    });

    it('should handle errors gracefully', (done) => {
      httpGetSpy.mockReturnValue(throwError(() => new Error('Error')));
      service
        .getAlertRuleData()
        .pipe(take(1))
        .subscribe({
          error: (error) => {
            expect(error).toBeInstanceOf(Error);
            done();
          },
        });
    });

    it('should handle empty response gracefully', (done) => {
      httpGetSpy.mockReturnValue(of({} as AlertRuleResponse));
      service
        .getAlertRuleData()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({});
          done();
        });
    });
  });

  describe('saveMultiAlertRules', () => {
    let httpPostSpy: jest.SpyInstance;

    beforeEach(() => {
      httpPostSpy = jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(
          of([{ id: '1', name: 'Test Rule' } as any] as AlertRuleSaveResponse[])
        );
    });

    it('should return a success response if dryRun is true', (done) => {
      service
        .saveMultiAlertRules([], true)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [],
          });
          done();
        });
    });

    it('should call http.post with correct request data', (done) => {
      const data: AlertRule[] = [
        {
          id: '1',
          startDate: '2024-11-23' as any,
          endDate: '2024-11-23' as any,
          deactivated: false,
        },
      ];

      service
        .saveMultiAlertRules(data)
        .pipe(take(1))
        .subscribe(() => {
          expect(httpPostSpy).toHaveBeenCalledWith(
            service['MULTI_ALERT_RULES_API'],
            expect.arrayContaining([
              expect.objectContaining({
                id: '1',
              }),
            ]),
            { context: expect.any(HttpContext) }
          );

          done();
        });
    });

    it('should return a success response on successful save', (done) => {
      const data: AlertRule[] = [
        {
          id: '1',
          startDate: '2024-11-23' as any,
          endDate: '2024-11-23' as any,
          deactivated: false,
        },
      ];

      service
        .saveMultiAlertRules(data)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [{ id: '1', name: 'Test Rule' }],
          });
          done();
        });
    });

    it('should return an error response on save failure', (done) => {
      httpPostSpy.mockReturnValueOnce(throwError(() => new Error('Error')));

      const data: AlertRule[] = [
        {
          id: '1',
          startDate: '2024-11-23' as any,
          endDate: '2024-11-23' as any,
          deactivated: false,
        },
      ];

      service
        .saveMultiAlertRules(data)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Error,
            overallErrorMsg: 'Error',
            response: [],
          });
          done();
        });
    });

    it('should handle empty data gracefully', (done) => {
      httpPostSpy.mockReturnValueOnce(of([]));

      service
        .saveMultiAlertRules([])
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [],
          });
          done();
        });
    });

    it('should call parse2Date for each date in the data', (done) => {
      const parse2DateSpy = jest.spyOn(service as any, 'parse2Date');

      const data: AlertRule[] = [
        {
          id: '1',
          startDate: '2024-11-23' as any,
          endDate: '2024-11-23' as any,
          deactivated: false,
        },
      ];

      service
        .saveMultiAlertRules(data)
        .pipe(take(1))
        .subscribe(() => {
          expect(parse2DateSpy).toHaveBeenCalledTimes(2);
          done();
        });
    });
  });

  describe('deleteMultiAlterRules', () => {
    let httpRequestSpy: jest.SpyInstance;

    beforeEach(() => {
      httpRequestSpy = jest
        .spyOn(service['http'], 'request')
        .mockReturnValue(
          of([{ id: '1', name: 'Test Rule' } as any] as AlertRuleSaveResponse[])
        );
    });

    it('should return a success response if dryRun is true', (done) => {
      service
        .deleteMultiAlterRules([], true)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [],
          });
          done();
        });
    });

    it('should call http.request with correct request data', (done) => {
      const data: AlertRule[] = [
        {
          id: '1',
          startDate: '2024-11-23' as any,
          endDate: '2024-11-23' as any,
          deactivated: false,
        },
      ];

      service
        .deleteMultiAlterRules(data, false)
        .pipe(take(1))
        .subscribe(() => {
          expect(httpRequestSpy).toHaveBeenCalledWith(
            'delete',
            service['MULTI_ALERT_RULES_API'],
            {
              body: expect.arrayContaining([
                expect.objectContaining({
                  id: '1',
                }),
              ]),
              context: expect.any(HttpContext),
            }
          );

          done();
        });
    });

    it('should return a success response on successful delete', (done) => {
      const data: AlertRule[] = [
        {
          id: '1',
          startDate: '2024-11-23' as any,
          endDate: '2024-11-23' as any,
          deactivated: false,
        },
      ];

      service
        .deleteMultiAlterRules(data, false)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [{ id: '1', name: 'Test Rule' }],
          });
          done();
        });
    });

    it('should return an error response on delete failure', (done) => {
      httpRequestSpy.mockReturnValueOnce(throwError(() => new Error('Error')));

      const data: AlertRule[] = [
        {
          id: '1',
          startDate: '2024-11-23' as any,
          endDate: '2024-11-23' as any,
          deactivated: false,
        },
      ];

      service
        .deleteMultiAlterRules(data, false)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Error,
            overallErrorMsg: 'Error',
            response: [],
          });
          done();
        });
    });

    it('should handle empty data gracefully', (done) => {
      httpRequestSpy.mockReturnValueOnce(of([]));

      service
        .deleteMultiAlterRules([], false)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [],
          });
          done();
        });
    });

    it('should call parse2Date for each date in the data', (done) => {
      const parse2DateSpy = jest.spyOn(service as any, 'parse2Date');

      const data: AlertRule[] = [
        {
          id: '1',
          startDate: '2024-11-23' as any,
          endDate: '2024-11-23' as any,
          deactivated: false,
        },
      ];

      service
        .deleteMultiAlterRules(data, false)
        .pipe(take(1))
        .subscribe(() => {
          expect(parse2DateSpy).toHaveBeenCalledTimes(2);
          done();
        });
    });
  });

  describe('deleteSingleAlterRule', () => {
    let httpRequestSpy: jest.SpyInstance;

    beforeEach(() => {
      httpRequestSpy = jest
        .spyOn(service['http'], 'request')
        .mockReturnValue(
          of([{ id: '1', name: 'Test Rule' } as any] as AlertRuleSaveResponse[])
        );
    });

    it('should call http.request with correct request data', (done) => {
      const data: AlertRule = {
        id: '1',
        startDate: '2024-11-23' as any,
        endDate: '2024-11-23' as any,
        deactivated: false,
      };

      service
        .deleteSingleAlterRule(data)
        .pipe(take(1))
        .subscribe(() => {
          expect(httpRequestSpy).toHaveBeenCalledWith(
            'delete',
            service['SINGLE_ALERT_RULES_API'],
            {
              body: expect.objectContaining({
                id: '1',
              }),
              context: expect.any(HttpContext),
            }
          );

          done();
        });
    });

    it('should return a success response on successful delete', (done) => {
      const data: AlertRule = {
        id: '1',
        startDate: '2024-11-23' as any,
        endDate: '2024-11-23' as any,
        deactivated: false,
      };

      service
        .deleteSingleAlterRule(data)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [{ id: '1', name: 'Test Rule' }],
          });
          done();
        });
    });

    it('should return an error response on delete failure', (done) => {
      httpRequestSpy.mockReturnValueOnce(throwError(() => new Error('Error')));

      const data: AlertRule = {
        id: '1',
        startDate: '2024-11-23' as any,
        endDate: '2024-11-23' as any,
        deactivated: false,
      };

      service
        .deleteSingleAlterRule(data)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Error,
            overallErrorMsg: 'Error',
            response: [],
          });
          done();
        });
    });

    it('should handle empty data gracefully', (done) => {
      httpRequestSpy.mockReturnValueOnce(of([]));

      const data: AlertRule = {
        id: '',
        startDate: '' as any,
        endDate: '' as any,
        deactivated: false,
      };

      service
        .deleteSingleAlterRule(data)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [],
          });
          done();
        });
    });
  });

  describe('parse2Date', () => {
    it('should return null if date is null', () => {
      const result = service['parse2Date'](null);
      expect(result).toBeNull();
    });

    it('should return null if date is an empty string', () => {
      const result = service['parse2Date']('');
      expect(result).toBeNull();
    });

    it('should parse a valid date string correctly', () => {
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('yyyy-MM-dd');
      const dateStr = '2024-11-23';
      const result = service['parse2Date'](dateStr);
      expect(result).toEqual(new Date('2024-11-23'));
    });

    it('should parse a valid Date object correctly', () => {
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('yyyy-MM-dd');
      const dateObj = new Date('2024-11-23');
      const result = service['parse2Date'](dateObj);
      expect(result).toEqual(new Date('2024-11-23'));
    });

    it('should handle invalid date strings gracefully', () => {
      const invalidDateStr = 'invalid-date';
      expect(() => service['parse2Date'](invalidDateStr)).toThrow(
        new TypeError('Invalid date format')
      );
    });

    it('should format the date correctly according to the specified format', () => {
      const dateStr = '2024-11-23';
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('yyyy-MM-dd');
      const result = service['parse2Date'](dateStr);
      expect(result).toEqual(new Date('2024-11-23'));
    });

    it('should handle different date formats correctly', () => {
      const dateStr = '23-11-2024';
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('dd-MM-yyyy');
      const result = service['parse2Date'](dateStr);
      expect(result).toEqual(new Date('2024-11-23'));
    });
  });
});
