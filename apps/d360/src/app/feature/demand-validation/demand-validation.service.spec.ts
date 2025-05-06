import { HttpContext, HttpParams } from '@angular/common/http';

import { of, take, throwError } from 'rxjs';

import { MessageType } from '../../shared/models/message-type.enum';
import { Stub } from '../../shared/test/stub.class';
import { DateRange, DateRangePeriod } from '../../shared/utils/date-range';
import * as SAP from '../../shared/utils/error-handling';
import { ValidationHelper } from '../../shared/utils/validation/validation-helper';
import { DemandValidationService } from './demand-validation.service';
import { DemandValidationFilter } from './demand-validation-filters';
import {
  DeleteKpiDataRequest,
  DeleteKpiDataResponse,
  DemandValidationBatch,
  KpiBucket,
  KpiBucketTypeEnum,
  KpiData,
  KpiDateRanges,
  KpiType,
  MaterialListEntry,
  MultiType,
  SelectedKpis,
  WriteKpiData,
} from './model';

describe('DemandValidationService', () => {
  let service: DemandValidationService;

  beforeEach(() => {
    service = Stub.get<DemandValidationService>({
      component: DemandValidationService,
      providers: [Stub.getStreamSaverServiceProvider()],
    });

    jest
      .spyOn(ValidationHelper.localeService, 'localizeDate')
      .mockReturnValue('11/23/2024');

    jest.spyOn(ValidationHelper, 'getDateFormat').mockReturnValue('yyyy-mm-dd');
    jest
      .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
      .mockReturnValue('PERIOD');
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getDataFetchedEvent', () => {
    it('should return an observable of dataFetchedEvent', (done) => {
      const mockEvent = { rowData: [{ id: 1 }], rowCount: 1 };

      service
        .getDataFetchedEvent()
        .pipe(take(1))
        .subscribe((event) => {
          expect(event).toEqual(mockEvent);
          done();
        });

      service['dataFetchedEvent'].next(mockEvent);
    });

    it('should complete the observable when unsubscribed', () => {
      const subscription = service
        .getDataFetchedEvent()
        .pipe(take(1))
        .subscribe();
      expect(subscription.closed).toBe(false);

      subscription.unsubscribe();
      expect(subscription.closed).toBe(true);
    });
  });

  describe('getFetchErrorEvent', () => {
    it('should return an observable of fetchErrorEvent', (done) => {
      const mockError = { message: 'Error occurred' };

      service
        .getFetchErrorEvent()
        .pipe(take(1))
        .subscribe((error) => {
          expect(error).toEqual(mockError);
          done();
        });

      service['fetchErrorEvent'].next(mockError);
    });

    it('should complete the observable when unsubscribed', () => {
      const subscription = service
        .getFetchErrorEvent()
        .pipe(take(1))
        .subscribe();
      expect(subscription.closed).toBe(false);

      subscription.unsubscribe();
      expect(subscription.closed).toBe(true);
    });
  });

  describe('deleteValidatedDemandBatch', () => {
    it('should call HttpClient.delete with correct URL and parameters', (done) => {
      const mockData: DeleteKpiDataRequest = { ids: [1, 2, 3] } as any;
      const mockResponse: DeleteKpiDataResponse = { success: true } as any;
      const dryRun = true;

      jest.spyOn(service['http'], 'delete').mockReturnValue(of(mockResponse));

      service
        .deleteValidatedDemandBatch(mockData, dryRun)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(service['http'].delete).toHaveBeenCalledWith(
            service['DEMAND_VALIDATION_API'],
            {
              body: mockData,
              params: new HttpParams().set('dryRun', dryRun.toString()),
            }
          );
          done();
        });
    });
  });

  describe('saveValidatedDemandBatch', () => {
    it('should call HttpClient.patch with correct URL and parameters', (done) => {
      const mockData: DemandValidationBatch[] = [
        {
          id: '1',
          material: 'material1',
          dateString: '2023-01-01',
          forecast: '100',
          periodType: 'month',
        } as any,
      ];
      const customerNumber = '12345';
      const dryRun = true;
      const materialType = 'customer';
      const listOrGrid = MultiType.Grid;
      const mockResponse = [
        {
          ids: ['1'],
          customerNumber: '12345',
          materialNumber: 'material1',
          results: [] as any,
        },
      ];

      jest.spyOn(service['http'], 'patch').mockReturnValue(of(mockResponse));

      service
        .saveValidatedDemandBatch(
          mockData,
          customerNumber,
          dryRun,
          materialType,
          listOrGrid
        )
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [
              {
                id: '1',
                customerNumber: '12345',
                materialNumber: 'material1',
                hasMultipleEntries: false,
                countErrors: 0,
                countSuccesses: 0,
                result: null,
                allErrors: null,
              },
            ],
          });
          expect(service['http'].patch).toHaveBeenCalledWith(
            service['DEMAND_VALIDATION_API'],
            expect.any(FormData),
            {
              params: new HttpParams()
                .set('dryRun', dryRun.toString())
                .set('useCustomerMaterials', 'true'),
              context: expect.any(HttpContext),
            }
          );
          done();
        });
    });

    it('should handle errors and return a PostResult with error status', (done) => {
      const mockData: DemandValidationBatch[] = [
        {
          id: '1',
          material: 'material1',
          dateString: '2023-01-01',
          forecast: '100',
          periodType: 'month',
        } as any,
      ];
      const customerNumber = '12345';
      const dryRun = true;
      const materialType = 'customer';
      const listOrGrid = MultiType.Grid;

      jest
        .spyOn(service['http'], 'patch')
        .mockReturnValue(throwError(() => new Error('HTTP error')));

      service
        .saveValidatedDemandBatch(
          mockData,
          customerNumber,
          dryRun,
          materialType,
          listOrGrid
        )
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Error,
            overallErrorMsg: 'HTTP error',
            response: [],
          });
          done();
        });
    });

    it('should handle listOrGrid as MultiType.List and process combined rows', (done) => {
      const mockData: DemandValidationBatch[] = [
        {
          id: '1',
          material: 'material1',
          dateString: '2023-01-01',
          forecast: '100',
          periodType: 'month',
        } as any,
      ];
      const customerNumber = '12345';
      const dryRun = true;
      const materialType = 'customer';
      const listOrGrid = MultiType.List;
      const mockResponse = [
        {
          customerNumber: '12345',
          materialNumber: 'material1',
          results: [{ idx: 1, result: { messageType: MessageType.Success } }],
        },
      ];

      jest.spyOn(service['http'], 'patch').mockReturnValue(of(mockResponse));

      service
        .saveValidatedDemandBatch(
          mockData,
          customerNumber,
          dryRun,
          materialType,
          listOrGrid
        )
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [
              {
                id: '1',
                customerNumber: '12345',
                materialNumber: 'material1',
                result: { messageType: MessageType.Success },
              },
            ],
          });
          done();
        });
    });
  });

  describe('saveValidatedDemandSingleMcc', () => {
    it('should return a translated error message if kpiData is null', (done) => {
      const errors = new Set<string>();
      const dryRun = true;

      service
        .saveValidatedDemandSingleMcc(null, errors, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toBe('validation_of_demand.error.no_data');
          done();
        });
    });

    it('should return a translated error message if errors are present', (done) => {
      const errors = new Set<string>(['2023-01-01', '2023-01-02']);
      const dryRun = false;

      service
        .saveValidatedDemandSingleMcc({} as WriteKpiData, errors, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toBe('validation_of_demand.save.error_specific');
          done();
        });
    });

    it('should return null if all results are successful', (done) => {
      const kpiData = {} as WriteKpiData;
      const errors = new Set<string>();
      const dryRun = true;
      const mockResponse = {
        results: [
          { result: { messageType: MessageType.Success } },
          { result: { messageType: MessageType.Success } },
        ],
      };

      jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));

      service
        .saveValidatedDemandSingleMcc(kpiData, errors, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toBeNull();
          expect(service['http'].post).toHaveBeenCalledWith(
            service['DEMAND_VALIDATION_API'],
            kpiData,
            { params: new HttpParams().set('dryRun', dryRun.toString()) }
          );
          done();
        });
    });

    it('should return a translated error message if any result contains an error', (done) => {
      const kpiData = {} as WriteKpiData;
      const errors = new Set<string>();
      const dryRun = false;
      const mockResponse = {
        results: [
          { result: { messageType: MessageType.Success } },
          {
            result: { messageType: MessageType.Error },
            fromDate: '2023-01-01',
          },
        ],
      };

      jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));
      jest
        .spyOn(SAP, 'errorsFromSAPtoMessage')
        .mockReturnValue('Some error message');

      service
        .saveValidatedDemandSingleMcc(kpiData, errors, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toBe('validation_of_demand.save.error_specific');
          done();
        });
    });

    it('should return a generic error message on HTTP error', (done) => {
      const kpiData = {} as WriteKpiData;
      const errors = new Set<string>();
      const dryRun = true;

      jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(throwError(() => new Error('HTTP error')));

      service
        .saveValidatedDemandSingleMcc(kpiData, errors, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toBe('validation_of_demand.save.error_unspecific');
          done();
        });
    });
  });

  describe('getKpiBuckets', () => {
    it('should call HttpClient.post with correct URL and request parameters', (done) => {
      const mockKpiDateRanges: KpiDateRanges = {
        range1: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31'),
          period: DateRangePeriod.Monthly,
        },
        range2: {
          from: new Date('2023-02-01'),
          to: new Date('2023-02-28'),
          period: DateRangePeriod.Monthly,
        },
      };

      const mockResponse: KpiBucket[] = [
        {
          from: '2023-01-01',
          to: '2023-01-31',
          type: KpiBucketTypeEnum.MONTH,
        },
        {
          from: '2023-01-01',
          to: '2023-01-31',
          type: KpiBucketTypeEnum.MONTH,
        },
      ];

      jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));

      service
        .getKpiBuckets(mockKpiDateRanges)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(service['http'].post).toHaveBeenCalledWith(
            service['DEMAND_VALIDATION_BUCKETS_API'],
            {
              range1: {
                from: '2023-01-01',
                to: '2023-01-31',
                period: DateRangePeriod.Monthly,
              },
              range2: {
                from: '2023-02-01',
                to: '2023-02-28',
                period: DateRangePeriod.Monthly,
              },
            }
          );
          done();
        });
    });

    it('should handle cases where range2 is undefined', (done) => {
      const mockKpiDateRanges: KpiDateRanges = {
        range1: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31'),
          period: DateRangePeriod.Monthly,
        },
        range2: undefined,
      };

      const mockResponse: KpiBucket[] = [
        {
          from: '2023-01-01',
          to: '2023-01-31',
          type: KpiBucketTypeEnum.MONTH,
        },
      ];

      jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));

      service
        .getKpiBuckets(mockKpiDateRanges)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(service['http'].post).toHaveBeenCalledWith(
            service['DEMAND_VALIDATION_BUCKETS_API'],
            {
              range1: {
                from: '2023-01-01',
                to: '2023-01-31',
                period: DateRangePeriod.Monthly,
              },
              range2: undefined,
            }
          );
          done();
        });
    });
  });

  describe('getKpiData', () => {
    it('should call HttpClient.post with correct URL and request parameters when materialListEntry is valid', (done) => {
      const mockMaterialListEntry: MaterialListEntry = {
        materialNumber: '12345',
        customerNumber: '67890',
      } as any;
      const mockKpiDateRanges: KpiDateRanges = {
        range1: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31'),
          period: DateRangePeriod.Monthly,
        },
        range2: {
          from: new Date('2023-02-01'),
          to: new Date('2023-02-28'),
          period: DateRangePeriod.Monthly,
        },
      };
      const mockExceptions: Date[] = [new Date('2023-01-15')];
      const mockResponse: KpiData = { data: 'mockData' } as any;

      jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));

      service
        .getKpiData(mockMaterialListEntry, mockKpiDateRanges, mockExceptions)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(service['http'].post).toHaveBeenCalledWith(
            service['DEMAND_VALIDATION_KPI_API'],
            {
              customerNumber: '67890',
              materialNumber: '12345',
              selectedKpis: expect.objectContaining({
                [KpiType.ActiveAndPredecessor]: true,
                [KpiType.Deliveries]: true,
                [KpiType.FirmBusiness]: true,
              }),
              range1: {
                from: '2023-01-01',
                to: '2023-01-31',
                period: DateRangePeriod.Monthly,
              },
              range2: {
                from: '2023-02-01',
                to: '2023-02-28',
                period: DateRangePeriod.Monthly,
              },
              exceptions: ['2023-01-15'],
            }
          );
          done();
        });
    });

    it('should return null when materialListEntry is undefined', (done) => {
      const mockKpiDateRanges: KpiDateRanges = {
        range1: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31'),
          period: DateRangePeriod.Monthly,
        },
        range2: undefined,
      };
      const mockExceptions: Date[] = [];

      service
        .getKpiData(undefined, mockKpiDateRanges, mockExceptions)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toBeNull();
          done();
        });
    });

    it('should handle cases where range2 is undefined', (done) => {
      const mockMaterialListEntry: MaterialListEntry = {
        materialNumber: '12345',
        customerNumber: '67890',
      } as any;
      const mockKpiDateRanges: KpiDateRanges = {
        range1: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31'),
          period: DateRangePeriod.Monthly,
        },
        range2: undefined,
      };
      const mockExceptions: Date[] = [];
      const mockResponse: KpiData = { data: 'mockData' } as any;

      jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));

      service
        .getKpiData(mockMaterialListEntry, mockKpiDateRanges, mockExceptions)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(service['http'].post).toHaveBeenCalledWith(
            service['DEMAND_VALIDATION_KPI_API'],
            {
              customerNumber: '67890',
              materialNumber: '12345',
              selectedKpis: expect.objectContaining({
                [KpiType.ActiveAndPredecessor]: true,
                [KpiType.Deliveries]: true,
                [KpiType.FirmBusiness]: true,
              }),
              range1: {
                from: '2023-01-01',
                to: '2023-01-31',
                period: DateRangePeriod.Monthly,
              },
              range2: undefined,
              exceptions: [],
            }
          );
          done();
        });
    });
  });

  describe('createDemandMaterialCustomerDatasource', () => {
    it('should return a valid IServerSideDatasource', () => {
      const selectionFilters = {
        filter1: 'value1',
        filter2: 'value2',
      } as any;

      const datasource =
        service.createDemandMaterialCustomerDatasource(selectionFilters);

      expect(datasource).toBeDefined();
      expect(datasource.getRows).toBeInstanceOf(Function);
    });

    it('should call HttpClient.post with correct parameters in getRows', (done) => {
      const selectionFilters = {
        filter1: 'value1',
        filter2: 'value2',
      } as any;

      const mockParams = {
        request: {
          startRow: 0,
          endRow: 50,
          sortModel: [{ colId: 'column1', sort: 'asc' }],
        },
        success: jest.fn(),
        fail: jest.fn(),
      } as any;

      const mockResponse = {
        rows: [{ id: 1, name: 'Row 1' }],
        rowCount: 1,
      };

      jest.spyOn(service['http'], 'post').mockReturnValue(of(mockResponse));
      jest.spyOn(service['dataFetchedEvent'], 'next');

      const datasource =
        service.createDemandMaterialCustomerDatasource(selectionFilters);

      datasource.getRows(mockParams);

      setTimeout(() => {
        expect(service['http'].post).toHaveBeenCalledWith(
          service['DEMAND_VALIDATION_CUSTOMER_MATERIAL_LIST_API'],
          {
            selectionFilters,
            sortModel: [{ colId: 'column1', sort: 'asc' }],
            startRow: 0,
            endRow: 50,
          },
          {
            params: new HttpParams().set(
              'language',
              service['translocoService'].getActiveLang()
            ),
          }
        );

        expect(mockParams.success).toHaveBeenCalledWith({
          rowData: mockResponse.rows,
          rowCount: mockResponse.rowCount,
        });

        expect(service['dataFetchedEvent'].next).toHaveBeenCalledWith({
          rowData: mockResponse.rows,
          rowCount: mockResponse.rowCount,
        });

        done();
      });
    });

    it('should call fail and emit fetchErrorEvent on error', (done) => {
      const selectionFilters = {
        filter1: 'value1',
        filter2: 'value2',
      } as any;

      const mockParams = {
        request: {
          startRow: 0,
          endRow: 50,
          sortModel: [],
        },
        success: jest.fn(),
        fail: jest.fn(),
      } as any;

      const mockError = new Error('HTTP error');

      jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(throwError(() => mockError));
      jest.spyOn(service['fetchErrorEvent'], 'next');

      const datasource =
        service.createDemandMaterialCustomerDatasource(selectionFilters);

      datasource.getRows(mockParams);

      setTimeout(() => {
        expect(mockParams.fail).toHaveBeenCalled();
        expect(service['fetchErrorEvent'].next).toHaveBeenCalledWith(mockError);
        done();
      });
    });
  });

  describe('triggerExport', () => {
    it('should call HttpClient.post with correct parameters and stream the response to a file', (done) => {
      const selectedKpis: SelectedKpis = {
        activeAndPredecessor: true,
      } as any;
      const filledRange: { range1: DateRange; range2?: DateRange } = {
        range1: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31'),
          period: DateRangePeriod.Monthly,
        },
        range2: {
          from: new Date('2023-02-01'),
          to: new Date('2023-02-28'),
          period: DateRangePeriod.Monthly,
        },
      };
      const demandValidationFilters: DemandValidationFilter = {} as any;
      const mockResponse = new Blob(['mock data'], {
        type: 'application/vnd.ms-excel',
      });

      jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(of({ body: mockResponse } as any));
      jest
        .spyOn(service['streamSaverService'], 'streamResponseToFile')
        .mockReturnValue(Promise.resolve());
      jest.spyOn(service['snackBarService'], 'openSnackBar');

      service
        .triggerExport(selectedKpis, filledRange, demandValidationFilters)
        .pipe(take(1))
        .subscribe(() => {
          expect(service['http'].post).toHaveBeenCalledWith(
            service['EXPORT_DEMAND_VALIDATION_API'],
            {
              dataFilters: {
                columnFilters: [],
                selectionFilters: expect.any(Object),
              },
              selectedKpis,
              range1: {
                from: '2023-01-01',
                to: '2023-01-31',
                period: DateRangePeriod.Monthly,
              },
              range2: {
                from: '2023-02-01',
                to: '2023-02-28',
                period: DateRangePeriod.Monthly,
              },
              translations: expect.any(Object),
            },
            {
              responseType: 'blob',
              observe: 'response',
              context: expect.any(HttpContext),
            }
          );

          expect(
            service['streamSaverService'].streamResponseToFile
          ).toHaveBeenCalledWith('demandValidationExport.xlsx', {
            body: mockResponse,
          });

          expect(service['snackBarService'].openSnackBar).toHaveBeenCalledWith(
            'validation_of_demand.export_modal.download_started'
          );

          done();
        });
    });

    it('should track the export with app insights', (done) => {
      const selectedKpis: SelectedKpis = {
        activeAndPredecessor: true,
      } as any;
      const filledRange: { range1: DateRange; range2?: DateRange } = {
        range1: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31'),
          period: DateRangePeriod.Monthly,
        },
      };
      const demandValidationFilters: DemandValidationFilter = {} as any;

      jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(throwError(() => new Error('HTTP error')));

      jest.spyOn(service['appInsights'], 'logEvent');

      service
        .triggerExport(selectedKpis, filledRange, demandValidationFilters)
        .pipe(take(1))
        .subscribe((value) => {
          expect(value).toBeNull();
          expect(service['appInsights'].logEvent).toHaveBeenCalledWith(
            '[Validated Sales Planning] Export Data'
          );
          expect(service['appInsights'].logEvent).toHaveBeenCalledWith(
            '[Validated Sales Planning] Export Data Failure'
          );

          done();
        });
    });

    it('should handle errors and show a snackbar with the error messages', (done) => {
      const selectedKpis: SelectedKpis = {
        activeAndPredecessor: true,
      } as any;
      const filledRange: { range1: DateRange; range2?: DateRange } = {
        range1: {
          from: new Date('2023-01-01'),
          to: new Date('2023-01-31'),
          period: DateRangePeriod.Monthly,
        },
      };
      const demandValidationFilters: DemandValidationFilter = {} as any;

      jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(throwError(() => new Error('HTTP error')));

      jest.spyOn(service['snackBarService'], 'openSnackBar');

      service
        .triggerExport(selectedKpis, filledRange, demandValidationFilters)
        .pipe(take(1))
        .subscribe((value) => {
          expect(value).toBeNull();
          expect(service['snackBarService'].openSnackBar).toHaveBeenCalledWith(
            'HTTP error'
          );

          done();
        });
    });
  });
});
