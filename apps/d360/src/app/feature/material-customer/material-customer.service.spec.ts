import { Stub } from '../../shared/test/stub.class';
import { MaterialCustomerService } from './material-customer.service';

describe('MaterialCustomerService', () => {
  let service: MaterialCustomerService;
  let http: any;

  beforeEach(() => {
    service = Stub.get<MaterialCustomerService>({
      component: MaterialCustomerService,
    });
    http = (service as any).http;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCriteriaData', () => {
    it('should call http.get with the correct URL and return the result', (done) => {
      const mockResult = { filterableFields: [], sortableFields: [] } as any;
      const spy = jest.spyOn(http, 'get').mockReturnValueOnce({
        subscribe: (cb: any) => {
          cb(mockResult);

          return { unsubscribe() {} };
        },
      });

      service.getCriteriaData().subscribe((result) => {
        expect(spy).toHaveBeenCalledWith(
          'api/material-customer/criteria-fields'
        );
        expect(result).toEqual(mockResult);
        done();
      });
    });
  });

  describe('getMaterialCustomerData', () => {
    it('should call http.post with the correct URL and payload and return the result', (done) => {
      const selectedIds = ['id1', 'id2'];
      const mockResponse = {
        rows: [
          { materialNumber: '1', materialDescription: 'desc1' },
          { materialNumber: '2', materialDescription: 'desc2' },
        ],
        rowCount: 2,
      };
      const spy = jest.spyOn(http, 'post').mockReturnValueOnce({
        subscribe: (cb: any) => {
          cb(mockResponse);

          return { unsubscribe() {} };
        },
      });

      service.getMaterialCustomerData(selectedIds).subscribe((result) => {
        expect(spy).toHaveBeenCalledWith(
          'api/material-customer/materials',
          selectedIds
        );
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });
});
