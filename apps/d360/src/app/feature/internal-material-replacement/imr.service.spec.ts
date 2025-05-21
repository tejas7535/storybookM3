import { HttpClient, HttpParams } from '@angular/common/http';

import { of, take, throwError } from 'rxjs';

import { MessageType } from '../../shared/models/message-type.enum';
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
            overallStatus: MessageType.Success,
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
            overallStatus: MessageType.Error,
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
            overallStatus: MessageType.Success,
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
            overallStatus: MessageType.Error,
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
            overallStatus: MessageType.Success,
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
            overallStatus: MessageType.Error,
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
            overallStatus: MessageType.Success,
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
            overallStatus: MessageType.Error,
            overallErrorMsg: getErrorMessage(error),
            response: [],
          });
          done();
        });
    });
  });
});
