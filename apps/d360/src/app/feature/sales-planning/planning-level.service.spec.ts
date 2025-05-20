import { Stub } from '../../shared/test/stub.class';
import { PlanningLevelService } from './planning-level.service';

describe('PlanningLevelService', () => {
  let service: PlanningLevelService;
  let http: any;

  beforeEach(() => {
    service = Stub.get<PlanningLevelService>({
      component: PlanningLevelService,
    });
    http = (service as any).http;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMaterialTypeByCustomerNumber', () => {
    it('should call http.get with the correct URL and return the result', (done) => {
      const customerNumber = '12345';
      const mockResponse = {
        planningLevelMaterialType: 'GP',
        isDefaultPlanningLevelMaterialType: true,
      };
      const spy = jest.spyOn(http, 'get').mockReturnValueOnce({
        subscribe: (cb: any) => {
          cb(mockResponse);

          return { unsubscribe() {} };
        },
      });

      service
        .getMaterialTypeByCustomerNumber(customerNumber)
        .subscribe((result) => {
          expect(spy).toHaveBeenCalledWith(
            `api/sales-planning/planning-level?customerNumber=${customerNumber}`
          );
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });

  describe('deleteMaterialTypeByCustomerNumber', () => {
    it('should call http.delete with the correct URL', (done) => {
      const customerNumber = '12345';
      const spy = jest.spyOn(http, 'delete').mockReturnValueOnce({
        subscribe: (cb: any) => {
          cb();

          return { unsubscribe() {} };
        },
      });

      service
        .deleteMaterialTypeByCustomerNumber(customerNumber)
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith(
            `api/sales-planning/planning-level?customerNumber=${customerNumber}`
          );
          done();
        });
    });
  });
});
