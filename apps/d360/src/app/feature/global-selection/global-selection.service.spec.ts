import { HttpClient } from '@angular/common/http';

import { isEmpty, of, take } from 'rxjs';

import { Stub } from '../../shared/test/stub.class';
import { SnackbarService } from '../../shared/utils/service/snackbar.service';
import { MaterialCustomerService } from '../material-customer/material-customer.service';
import { GlobalSelectionHelperService } from './global-selection.service';
import { GlobalSelectionUtils } from './global-selection.utils';

describe('GlobalSelectionHelperService', () => {
  let service: GlobalSelectionHelperService;
  let http: HttpClient;
  let snackbarService: SnackbarService;
  let materialCustomerService: MaterialCustomerService;

  beforeEach(() => {
    service = Stub.get<GlobalSelectionHelperService>({
      component: GlobalSelectionHelperService,
      providers: [Stub.getMaterialCustomerServiceProvider()],
    });
    http = service['http'];
    snackbarService = service['snackbarService'];
    materialCustomerService = service['materialCustomerService'];
  });

  describe('getResultCount', () => {
    it('should return the result count when globalSelection is provided', (done) => {
      const mockResponse = 10;
      jest.spyOn(http, 'post').mockReturnValue(of(mockResponse));

      service
        .getResultCount({ someKey: [] } as any)
        .pipe(take(1))
        .subscribe((result) => {
          expect(http.post).toHaveBeenCalledWith(
            service['GLOBAL_SELECTION_COUNT_API'],
            {
              startRow: 0,
              endRow: 1,
              sortModel: [],
              columnFilters: [],
              selectionFilters: {},
            }
          );
          expect(result).toBe(mockResponse);
          done();
        });
    });

    it('should return undefined when globalSelection is not provided', (done) => {
      service
        .getResultCount(undefined as any)
        .pipe(take(1), isEmpty())
        .subscribe((result) => {
          expect(result).toBe(true);
          done();
        });
    });
  });

  describe('getCustomersData', () => {
    it('should return customer data when globalSelection is provided', (done) => {
      const mockResponse = [{ id: '123', name: 'Customer 123' }];
      jest.spyOn(http, 'post').mockReturnValue(of(mockResponse));

      service
        .getCustomersData({ someKey: [] } as any)
        .pipe(take(1))
        .subscribe((result) => {
          expect(http.post).toHaveBeenCalledWith(
            service['GLOBAL_SELECTION_CUSTOMER_API'],
            {
              startRow: 0,
              endRow: 1,
              sortModel: [],
              columnFilters: [],
              selectionFilters: {},
            }
          );
          expect(result).toEqual(mockResponse);
          done();
        });
    });

    it('should return an empty array when globalSelection is not provided', (done) => {
      service
        .getCustomersData(null)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual([]);
          done();
        });
    });
  });

  describe('resolveProductionSegment', () => {
    it('should call resolveOptionsOnType and return the result', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptionsOnType');
      const mockResponse = [
        {
          id: 'segment1',
          selectableValue: { id: 'segment1', text: 'Segment 1' },
        },
      ];
      jest.spyOn(service['http'], 'get').mockReturnValue(of(mockResponse));

      service
        .resolveProductionSegment(['segment1'])
        .pipe(take(1))
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith({
            values: ['segment1'],
            urlBegin: 'api/global-selection/production-segments',
            validateFunc: expect.any(Function),
            http: service['http'],
          });
          done();
        });
    });

    it('should show a snackbar error if values exceed the limit', () => {
      const errorSpy = jest.spyOn(snackbarService, 'error');
      service.resolveProductionSegment(
        Array.from({ length: 151 }).fill('value') as any
      );
      expect(errorSpy).toHaveBeenCalledWith('error.tooManyValues');
    });
  });

  describe('resolveGkamNumber', () => {
    it('should call resolveOptions with correct parameters', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptions');
      const values = ['123456'];
      const options = [{ id: '123456', text: 'GKAM 123456' }];

      service
        .resolveGkamNumber(values, options)
        .pipe(take(1))
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith({
            values,
            options,
            formatFunc: expect.any(Function),
            validateFunc: expect.any(Function),
            errorTextFunc: expect.any(Function),
          });
          done();
        });
    });
  });

  describe('resolveSalesOrg', () => {
    it('should call resolveOptions with correct parameters', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptions');
      const values = ['1234'];
      const options = [{ id: '1234', text: 'Sales Org 1234' }];

      service
        .resolveSalesOrg(values, options)
        .pipe(take(1))
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith({
            values,
            options,
            formatFunc: expect.any(Function),
            validateFunc: expect.any(Function),
            errorTextFunc: expect.any(Function),
          });
          done();
        });
    });
  });

  describe('resolveSectors', () => {
    it('should call resolveOptions with correct parameters', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptions');
      const values = ['Sector1'];
      const options = [{ id: 'Sector1', text: 'Sector 1' }];

      service
        .resolveSectors(values, options)
        .pipe(take(1))
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith({
            values,
            options,
            formatFunc: undefined,
            validateFunc: expect.any(Function),
          });
          done();
        });
    });
  });

  describe('resolveProductionPlants', () => {
    it('should call resolveOptions with correct parameters', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptions');
      const values = ['Plant1'];
      const options = [{ id: 'Plant1', text: 'Production Plant 1' }];

      service
        .resolveProductionPlants(values, options)
        .pipe(take(1))
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith({
            values,
            options,
            formatFunc: undefined,
            validateFunc: expect.any(Function),
          });
          done();
        });
    });
  });

  describe('resolveAlertTypes', () => {
    it('should call resolveOptions with correct parameters', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptions');
      const values = ['Alert1'];
      const options = [{ id: 'Alert1', text: 'Alert Type 1' }];

      service
        .resolveAlertTypes(values, options)
        .pipe(take(1))
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith({
            values,
            options,
            formatFunc: undefined,
            validateFunc: expect.any(Function),
          });
          done();
        });
    });
  });

  describe('resolveCustomerNumbers', () => {
    it('should resolve customer numbers and return selectable values', (done) => {
      const mockResponse = [{ id: '0000123456', text: 'Customer 123456' }];
      jest.spyOn(http, 'post').mockReturnValue(of(mockResponse));
      jest
        .spyOn(GlobalSelectionUtils, 'splitToChunks')
        .mockReturnValue([['0000123456']]);

      service
        .resolveCustomerNumbers(['123456'])
        .pipe(take(1))
        .subscribe((result) => {
          expect(http.post).toHaveBeenCalledWith(
            service['GLOBAL_SELECTION_CUSTOMER_BY_NAME_API'],
            ['0000123456']
          );
          expect(result[0].selectableValue).toEqual({
            id: '0000123456',
            text: 'Customer 123456',
          });
          done();
        });
    });

    it('should return errors for invalid customer numbers', (done) => {
      service
        .resolveCustomerNumbers(['invalid'])
        .pipe(take(1))
        .subscribe((result) => {
          expect(result[0].error).toBeDefined();
          done();
        });
    });

    it('should return original results when no requests are made', (done) => {
      jest.spyOn(GlobalSelectionUtils, 'splitToChunks').mockReturnValue([]);

      const expectedResult = [{ id: 'invalid', error: expect.any(Array) }];

      service
        .resolveCustomerNumbers(['invalid'])
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual(expectedResult);
          done();
        });
    });
  });

  describe('resolveMaterialNumbers', () => {
    it('should resolve material numbers and return selectable values', (done) => {
      const mockResponse = {
        rows: [
          {
            materialNumber: '123-456-789',
            materialDescription: 'Test Material',
          },
        ],
      } as any;
      jest
        .spyOn(materialCustomerService, 'getMaterialCustomerData')
        .mockReturnValue(of(mockResponse));
      jest
        .spyOn(GlobalSelectionUtils, 'splitToChunks')
        .mockReturnValue([['123456789']]);

      service
        .resolveMaterialNumbers(['123-456-789'])
        .pipe(take(1))
        .subscribe((result) => {
          expect(
            materialCustomerService.getMaterialCustomerData
          ).toHaveBeenCalledWith(['123456789']);
          expect(result[0].selectableValue).toEqual({
            id: '123-456-789',
            text: 'Test Material',
          });
          done();
        });
    });

    it('should correctly handle 102 material numbers across multiple chunks', (done) => {
      const materialNumbers = Array.from({ length: 102 }).map(
        (_, i) => `064155${i.toString().padStart(3, '0')}-0000-13`
      );

      const formattedMaterialNumbers = materialNumbers.map((mat) =>
        mat.replaceAll('-', '')
      );

      const firstChunk = formattedMaterialNumbers.slice(0, 100);
      const secondChunk = formattedMaterialNumbers.slice(100);

      const firstChunkResponse = {
        rows: formattedMaterialNumbers.slice(0, 100).map((num) => ({
          materialNumber: num.replace(/(\d{9})(\d{4})(\d{2})/, '$1-$2-$3'),
          materialDescription: `Material ${num}`,
        })),
      };

      const secondChunkResponse = {
        rows: [
          {
            materialNumber: '064155100-0000-13',
            materialDescription: 'Material 064155100-0000-13',
          },
        ],
      };

      jest
        .spyOn(GlobalSelectionUtils, 'splitToChunks')
        .mockReturnValue([firstChunk, secondChunk]);

      jest
        .spyOn(materialCustomerService, 'getMaterialCustomerData')
        .mockImplementation((materialNums) =>
          materialNums.length === 100
            ? of(firstChunkResponse as any)
            : of(secondChunkResponse as any)
        );

      service
        .resolveMaterialNumbers(materialNumbers)
        .pipe(take(1))
        .subscribe((results) => {
          const validSelectableValueCount = results.filter(
            (r) => r.selectableValue
          ).length;
          expect(validSelectableValueCount).toBe(101);

          const lastMaterial = results.find(
            (r) => r.id === '064155101-0000-13'
          );
          expect(lastMaterial?.error).toBeDefined();
          expect(lastMaterial?.selectableValue).toBeUndefined();

          expect(
            materialCustomerService.getMaterialCustomerData
          ).toHaveBeenCalledTimes(2);

          done();
        });
    });

    it('should return errors for invalid material numbers', (done) => {
      jest
        .spyOn(materialCustomerService, 'getMaterialCustomerData')
        .mockReturnValue(of({ rows: [] } as any));

      service
        .resolveMaterialNumbers(['invalid'])
        .pipe(take(1))
        .subscribe((result) => {
          expect(result[0].error).toBeDefined();
          done();
        });
    });

    it('should mark unmatched valid materials as invalid', (done) => {
      jest
        .spyOn(materialCustomerService, 'getMaterialCustomerData')
        .mockReturnValue(
          of({
            rows: [
              {
                materialNumber: '000000-0000-000-00',
                materialDescription: 'Test Material',
              },
            ],
          } as any)
        );
      jest
        .spyOn(GlobalSelectionUtils, 'splitToChunks')
        .mockReturnValue([['123456-7890-123-45']]);

      service
        .resolveMaterialNumbers(['123456-7890-123-45'])
        .pipe(take(1))
        .subscribe((result) => {
          expect(result[0].error).toEqual(['error.notValidMaterialNumber']);
          done();
        });
    });

    it('should return original results when no requests are made', (done) => {
      jest.spyOn(GlobalSelectionUtils, 'splitToChunks').mockReturnValue([]);

      const expectedResult = [{ id: 'invalid', error: expect.any(Array) }];

      service
        .resolveMaterialNumbers(['invalid'])
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual(expectedResult);
          done();
        });
    });
  });

  describe('resolveForText', () => {
    it('should call resolveOptions with correct parameters', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptions');
      const values = ['Text1'];
      const options = [{ id: 'Text1', text: 'Sample Text' }];

      service
        .resolveForText(values, options)
        .pipe(take(1))
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith({
            values,
            options,
            formatFunc: undefined,
            validateFunc: expect.any(Function),
          });
          done();
        });
    });

    it('should use validateForText function', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptions');
      const values = ['Text1'];
      const options = [{ id: 'Text1', text: 'Sample Text' }];

      service
        .resolveForText(values, options)
        .pipe(take(1))
        .subscribe(() => {
          const validateFunc = spy.mock.calls[0][0].validateFunc;
          expect(typeof validateFunc).toBe('function');
          done();
        });
    });
  });

  describe('resolveFor2Characters', () => {
    it('should call resolveOptions with correct parameters', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptions');
      const values = ['AB'];
      const options = [{ id: 'AB', text: 'Two Character Code' }];

      service
        .resolveFor2Characters(values, options)
        .pipe(take(1))
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith({
            values,
            options,
            formatFunc: undefined,
            validateFunc: expect.any(Function),
          });
          done();
        });
    });

    it('should use validateFor2Characters function', (done) => {
      const spy = jest.spyOn(GlobalSelectionUtils, 'resolveOptions');
      const values = ['AB'];
      const options = [{ id: 'AB', text: 'Two Character Code' }];

      service
        .resolveFor2Characters(values, options)
        .pipe(take(1))
        .subscribe(() => {
          const validateFunc = spy.mock.calls[0][0].validateFunc;
          expect(typeof validateFunc).toBe('function');
          done();
        });
    });
  });
});
