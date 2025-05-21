import { HttpParams } from '@angular/common/http';

import { isEmpty, lastValueFrom, Observable, of, take, throwError } from 'rxjs';

import { MessageType } from '../../shared/models/message-type.enum';
import { Stub } from '../../shared/test/stub.class';
import { CMPService } from './cmp.service';

describe('CMPService', () => {
  let service: CMPService;

  beforeEach(
    () =>
      (service = Stub.get<CMPService>({
        component: CMPService,
      }))
  );

  describe('getForecastActionData', () => {
    it('should return success response when valid cmpData is provided', (done) => {
      const mockResponse = {
        overallStatus: MessageType.Success,
        overallErrorMsg: null,
        response: [{ id: 1, name: 'Test' }],
      } as any;

      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      service
        .getForecastActionData({
          customerNumber: '123',
          materialNumber: '456',
          successorMaterial: '789',
        } as any)
        .pipe(take(1))
        .subscribe((result) => {
          expect(service['http'].post).toHaveBeenCalledWith(
            'api/customer-material-portfolio/cfcr-action',
            {
              customerNumber: '123',
              materialNumber: '456',
              successorMaterial: '789',
            }
          );

          expect(result).toEqual(mockResponse);

          done();
        });
    });

    it('should return empty observable when cmpData is invalid', (done) => {
      const result = service.getForecastActionData(null);

      expect(result).toBeInstanceOf(Observable);

      result.pipe(take(1), isEmpty()).subscribe((res) => {
        expect(res).toEqual(true);
        done();
      });
    });
  });

  describe('getCMPCriteriaData', () => {
    it('should fetch criteria data from API', (done) => {
      const mockResponse = {
        fields: ['field1', 'field2'],
        labels: ['Label1', 'Label2'],
      };

      jest
        .spyOn(service['http'] as any, 'get')
        .mockReturnValue(of(mockResponse));

      service
        .getCMPCriteriaData()
        .pipe(take(1))
        .subscribe((result) => {
          expect(service['http'].get).toHaveBeenCalledWith(
            'api/customer-material-portfolio/criteria-fields'
          );
          expect(result).toEqual(mockResponse);

          done();
        });
    });
  });

  describe('saveBulkPhaseIn', () => {
    it('should post bulk phase in request with dryRun parameter', (done) => {
      const mockRequest = {
        data: ['item1', 'item2'],
        type: 'phase-in',
      } as any;

      const mockResponse = {
        materialResults: [{ id: 1, status: 'COMPLETED' }],
      };

      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      service
        .saveBulkPhaseIn(mockRequest, true)
        .pipe(take(1))
        .subscribe((result) => {
          expect(service['http'].post).toHaveBeenCalledWith(
            'api/customer-material-portfolio/bulk-phase-in',
            mockRequest,
            { params: new HttpParams().set('dryRun', 'true') }
          );
          expect(result).toEqual({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: mockResponse.materialResults,
          });

          done();
        });
    });

    it('should handle error responses', async () => {
      const mockError = {
        status: 500,
        message: 'Internal Server Error',
      };

      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(throwError(() => mockError));

      const result = await lastValueFrom(
        service.saveBulkPhaseIn({} as any, false)
      ).catch((error) => error);

      expect(result).toEqual({
        overallStatus: MessageType.Error,
        overallErrorMsg: 'error.unknown',
        response: [],
      });
    });
  });

  describe('saveCMPChange', () => {
    it('should handle confirmation needed response', (done) => {
      const mockResponse = {
        confirmationNeeded: true,
        message: 'Confirmation required for this action',
      };

      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(of(mockResponse));

      const cmpData = {
        autoSwitchDate: null,
        customerNumber: '123',
        materialNumber: '456',
        successorMaterial: '789',
        portfolioStatus: 'SE',
        demandCharacteristic: null,
        demandPlanAdoption: undefined,
        repDate: null,
      } as any;

      service
        .saveCMPChange(cmpData, false, 'action-url')
        .pipe(take(1))
        .subscribe((result) => {
          expect(service['http'].post).toHaveBeenCalledWith(
            'api/customer-material-portfolio/action-url',
            cmpData,
            { params: { dryRun: 'false' } }
          );
          expect(result).toEqual({
            overallStatus: MessageType.Warning,
            overallErrorMsg:
              'customer.material_portfolio.modal.substitution.warning.add_material',
            response: [mockResponse],
          });

          done();
        });
    });

    it('should handle missing actionURL', (done) => {
      const cmpData = {
        customerNumber: '123',
        materialNumber: '456',
        successorMaterial: '789',
        portfolioStatus: 'SE',
      } as any;

      service
        .saveCMPChange(cmpData, false, null)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: MessageType.Error,
            overallErrorMsg: 'error.unknown',
            response: [],
          });

          done();
        });
    });

    it('should handle HTTP errors', (done) => {
      const mockError = new Error('HTTP error occurred');
      jest
        .spyOn(service['http'] as any, 'post')
        .mockReturnValue(throwError(() => mockError));

      const cmpData = {
        customerNumber: '123',
        materialNumber: '456',
        successorMaterial: '789',
        portfolioStatus: 'SE',
      } as any;

      service
        .saveCMPChange(cmpData, false, 'action-url')
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            overallStatus: MessageType.Error,
            overallErrorMsg: mockError.message,
            response: [],
          });

          done();
        });
    });
  });
});
