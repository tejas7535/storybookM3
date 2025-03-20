import { HttpClient, HttpParams } from '@angular/common/http';

import { of, take, throwError } from 'rxjs';

import { Stub } from '../../shared/test/stub.class';
import { getErrorMessage } from '../../shared/utils/errors';
import { IMRService } from './imr.service';
import { IMRSubstitution, IMRSubstitutionResponse } from './model';
import { dataToIMRSubstitutionRequest } from './request-helper';

describe('IMRService', () => {
  let service: IMRService;

  beforeEach(() => {
    service = Stub.get<IMRService>({
      component: IMRService,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveMultiIMRSubstitution', () => {
    let httpClient: HttpClient;

    beforeEach(() => {
      httpClient = service['http'];
    });

    it('should call http.post with correct parameters', (done) => {
      const postSpy = jest.spyOn(httpClient, 'post').mockReturnValue(of([]));
      const substitutions: IMRSubstitution[] = [
        {
          replacementType: 'RELOCATION',
          region: 'EU',
          salesArea: '',
          salesOrg: '',
          customerNumber: '',
          predecessorMaterial: '',
          successorMaterial: '',
          replacementDate: '',
          cutoverDate: '',
          startOfProduction: '',
          note: '',
        },
      ];
      const dryRun = true;

      service
        .saveMultiIMRSubstitution(substitutions, dryRun)
        .pipe(take(1))
        .subscribe(() => {
          expect(postSpy).toHaveBeenCalledWith(
            service['IMR_MULTI_SUBSTITUTION_API'],
            substitutions.map((element) =>
              dataToIMRSubstitutionRequest(element)
            ),
            { params: new HttpParams().set('dryRun', dryRun.toString()) }
          );
          done();
        });
    });

    it('should return success response on successful request', (done) => {
      const response: IMRSubstitutionResponse[] = [
        {
          /* mock response data */
        } as any,
      ];
      jest.spyOn(httpClient, 'post').mockReturnValue(of(response));
      const substitutions: IMRSubstitution[] = [
        {
          replacementType: 'RELOCATION',
          region: 'EU',
          salesArea: '',
          salesOrg: '',
          customerNumber: '',
          predecessorMaterial: '',
          successorMaterial: '',
          replacementDate: '',
          cutoverDate: '',
          startOfProduction: '',
          note: '',
        },
      ];
      const dryRun = true;

      service
        .saveMultiIMRSubstitution(substitutions, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'SUCCESS',
            overallErrorMsg: null,
            response,
          });
          done();
        });
    });

    it('should return error response on failed request', (done) => {
      const error = new Error('error');
      jest.spyOn(httpClient, 'post').mockReturnValue(throwError(() => error));
      const substitutions: IMRSubstitution[] = [
        {
          replacementType: 'RELOCATION',
          region: 'EU',
          salesArea: '',
          salesOrg: '',
          customerNumber: '',
          predecessorMaterial: '',
          successorMaterial: '',
          replacementDate: '',
          cutoverDate: '',
          startOfProduction: '',
          note: '',
        },
      ];
      const dryRun = true;

      service
        .saveMultiIMRSubstitution(substitutions, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          });
          done();
        });
    });
  });

  describe('deleteIMRSubstitution', () => {
    let httpClient: HttpClient;

    beforeEach(() => {
      httpClient = service['http'];
    });

    it('should call writeSingleIMRSubstitution with deleteData as true', (done) => {
      const writeSingleIMRSubstitutionSpy = jest
        .spyOn(service as any, 'writeSingleIMRSubstitution')
        .mockReturnValue(of({}));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service
        .deleteIMRSubstitution(substitution, dryRun)
        .pipe(take(1))
        .subscribe(() => {
          expect(writeSingleIMRSubstitutionSpy).toHaveBeenCalledWith(
            substitution,
            dryRun,
            true
          );
          done();
        });
    });

    it('should return success response on successful request', (done) => {
      const response: IMRSubstitutionResponse = {
        /* mock response data */
      } as any;
      jest.spyOn(httpClient, 'request').mockReturnValue(of(response));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service
        .deleteIMRSubstitution(substitution, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'SUCCESS',
            overallErrorMsg: null,
            response: [response],
          });
          done();
        });
    });

    it('should return error response on failed request', (done) => {
      const error = new Error('error');
      jest
        .spyOn(httpClient, 'request')
        .mockReturnValue(throwError(() => error));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service
        .deleteIMRSubstitution(substitution, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          });
          done();
        });
    });
  });

  describe('saveSingleIMRSubstitution', () => {
    let httpClient: HttpClient;

    beforeEach(() => {
      httpClient = service['http'];
    });

    it('should call writeSingleIMRSubstitution with deleteData as false', (done) => {
      const writeSingleIMRSubstitutionSpy = jest
        .spyOn(service as any, 'writeSingleIMRSubstitution')
        .mockReturnValue(of({}));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service
        .saveSingleIMRSubstitution(substitution, dryRun)
        .pipe(take(1))
        .subscribe(() => {
          expect(writeSingleIMRSubstitutionSpy).toHaveBeenCalledWith(
            substitution,
            dryRun,
            false
          );
          done();
        });
    });

    it('should return success response on successful request', (done) => {
      const response: IMRSubstitutionResponse = {
        /* mock response data */
      } as any;
      jest.spyOn(httpClient, 'request').mockReturnValue(of(response));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service
        .saveSingleIMRSubstitution(substitution, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'SUCCESS',
            overallErrorMsg: null,
            response: [response],
          });
          done();
        });
    });

    it('should return error response on failed request', (done) => {
      const error = new Error('error');
      jest
        .spyOn(httpClient, 'request')
        .mockReturnValue(throwError(() => error));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service
        .saveSingleIMRSubstitution(substitution, dryRun)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          });
          done();
        });
    });
  });

  describe('writeSingleIMRSubstitution', () => {
    let httpClient: HttpClient;

    beforeEach(() => {
      httpClient = service['http'];
    });

    it('should call http.request with POST method when deleteData is false', (done) => {
      const postSpy = jest.spyOn(httpClient, 'request').mockReturnValue(of({}));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service['writeSingleIMRSubstitution'](substitution, dryRun, false)
        .pipe(take(1))
        .subscribe(() => {
          expect(postSpy).toHaveBeenCalledWith(
            'POST',
            service['IMR_SINGLE_SUBSTITUTION_API'],
            expect.objectContaining({
              body: dataToIMRSubstitutionRequest(substitution),
              params: new HttpParams().set('dryRun', dryRun.toString()),
            })
          );

          done();
        });
    });

    it('should call http.request with DELETE method when deleteData is true', (done) => {
      const deleteSpy = jest
        .spyOn(httpClient, 'request')
        .mockReturnValue(of({}));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service['writeSingleIMRSubstitution'](substitution, dryRun, true)
        .pipe(take(1))
        .subscribe(() => {
          expect(deleteSpy).toHaveBeenCalledWith(
            'DELETE',
            service['IMR_SINGLE_SUBSTITUTION_API'],
            expect.objectContaining({
              body: dataToIMRSubstitutionRequest(substitution),
              params: new HttpParams().set('dryRun', dryRun.toString()),
            })
          );
          done();
        });
    });

    it('should return success response on successful request', (done) => {
      const response: IMRSubstitutionResponse = {
        /* mock response data */
      } as any;
      jest.spyOn(httpClient, 'request').mockReturnValue(of(response));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service['writeSingleIMRSubstitution'](substitution, dryRun, false)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'SUCCESS',
            overallErrorMsg: null,
            response: [response],
          });
          done();
        });
    });

    it('should return error response on failed request', (done) => {
      const error = new Error('error');
      jest
        .spyOn(httpClient, 'request')
        .mockReturnValue(throwError(() => error));
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: 'EU',
        salesArea: '',
        salesOrg: '',
        customerNumber: '',
        predecessorMaterial: '',
        successorMaterial: '',
        replacementDate: '',
        cutoverDate: '',
        startOfProduction: '',
        note: '',
      };
      const dryRun = true;

      service['writeSingleIMRSubstitution'](substitution, dryRun, false)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: 'ERROR',
            overallErrorMsg: getErrorMessage(error),
            response: [],
          });
          done();
        });
    });
  });

  describe('createInternalMaterialReplacementDatasource', () => {
    let httpClient: HttpClient;

    beforeEach(() => {
      httpClient = service['http'];
    });

    it('should create a datasource', () => {
      const datasource =
        service.createInternalMaterialReplacementDatasource('region1');
      expect(datasource).toBeTruthy();
      expect(datasource.getRows).toBeInstanceOf(Function);
    });

    it('should call http.post with correct parameters', () => {
      const postSpy = jest
        .spyOn(httpClient, 'post')
        .mockReturnValue(of({ rows: [], rowCount: 0 }));
      const datasource =
        service.createInternalMaterialReplacementDatasource('region1');
      const params = {
        request: {
          startRow: 0,
          endRow: 50,
          sortModel: [] as any,
          filterModel: {},
        },
        success: jest.fn(),
        fail: jest.fn(),
      };

      datasource.getRows(params as any);

      expect(postSpy).toHaveBeenCalledWith(
        service['IMR_API'],
        expect.objectContaining({
          selectionFilters: { region: ['region1'] },
          startRow: 0,
          endRow: 50,
        })
      );
    });

    it('should call params.success with correct data on success', (done) => {
      const testData = { rows: [{ id: 1 }], rowCount: 1 };
      jest.spyOn(httpClient, 'post').mockReturnValue(of(testData));
      const datasource =
        service.createInternalMaterialReplacementDatasource('region1');
      const params = {
        request: {
          startRow: 0,
          endRow: 50,
          sortModel: [] as any,
          filterModel: {},
        },
        success: jest.fn(),
        fail: jest.fn(),
      };

      datasource.getRows(params as any);

      setTimeout(() => {
        expect(params.success).toHaveBeenCalledWith({
          rowData: testData.rows,
          rowCount: testData.rowCount,
        });

        done();
      }, 0);
    });

    it('should call params.fail on error', (done) => {
      jest
        .spyOn(httpClient, 'post')
        .mockReturnValue(throwError(() => new Error('error')));
      const datasource =
        service.createInternalMaterialReplacementDatasource('region1');
      const params = {
        request: {
          startRow: 0,
          endRow: 50,
          sortModel: [] as any,
          filterModel: {},
        },
        success: jest.fn(),
        fail: jest.fn(),
      };

      datasource.getRows(params as any);

      setTimeout(() => {
        expect(params.fail).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should emit dataFetchedEvent on success', (done) => {
      const testData = { rows: [{ id: 1 }], rowCount: 1 };
      jest.spyOn(httpClient, 'post').mockReturnValue(of(testData));
      const datasource =
        service.createInternalMaterialReplacementDatasource('region1');
      const params = {
        request: {
          startRow: 0,
          endRow: 50,
          sortModel: [] as any,
          filterModel: {},
        },
        success: jest.fn(),
        fail: jest.fn(),
      };

      service
        .getDataFetchedEvent()
        .pipe(take(1))
        .subscribe((data) => {
          expect(data).toEqual({
            rowData: testData.rows,
            rowCount: testData.rowCount,
          });
          done();
        });

      datasource.getRows(params as any);
    });
  });

  describe('getDataFetchedEvent', () => {
    it('should emit data when dataFetchedEvent is triggered', (done) => {
      const testData = { rowData: [{ id: 1 }], rowCount: 1 };
      service
        .getDataFetchedEvent()
        .pipe(take(1))
        .subscribe((data) => {
          expect(data).toEqual(testData);
          done();
        });

      service['dataFetchedEvent'].next(testData);
    });
  });
});
