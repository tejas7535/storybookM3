import { Stub } from './../../../../shared/test/stub.class';
import {
  CustomerInfoModalComponent,
  CustomPaginatorIntl,
} from './customer-info-modal.component';

const mockDateWithMultipleCustomerInfo = {
  customerNumber: 'C123',
  customerName: 'Test Customer',
  customerInfo: [
    {
      globalCustomerNumber: 'C123',
      region: 'EMEA',
      salesOrg: 'S1',
      salesDescription: 'Sales Org 1',
      salesArea: 'Area 51',
      countryCode: 'DE',
      countryDescription: 'Germany',
      sector: 'Automotive',
      sectorDescription: 'Car Manufacturing',
      keyAccountNumber: 'KA001',
      keyAccountName: 'Key Account Name',
      subKeyAccountNumber: 'SKA001',
      subKeyAccountName: 'Sub Key Account Name',
      planningCurrency: 'EUR',
      accountOwner: 'John Doe',
      internalSales: 'Jane Roe',
      demandPlanner: 'Mark Moe',
      gkam: 'G KAM Person',
      kam: 'KAM Person',
    },
    {
      globalCustomerNumber: 'C456',
      region: 'NA',
      salesOrg: 'S2',
      salesDescription: 'Sales Org 2',
      salesArea: 'Area 52',
      countryCode: 'US',
      countryDescription: 'United States',
      sector: 'Tech',
      sectorDescription: 'Technology',
      keyAccountNumber: 'KA002',
      keyAccountName: 'Key Account Name 2',
      subKeyAccountNumber: 'SKA002',
      subKeyAccountName: 'Sub Key Account Name 2',
      planningCurrency: 'USD',
      accountOwner: 'Alice Doe',
      internalSales: 'Bob Roe',
      demandPlanner: 'Charlie Moe',
      gkam: 'G KAM Person 2',
      kam: 'KAM Person 2',
    },
  ],
};

describe('CustomerInfoModalComponent and CustomPaginatorIntl', () => {
  describe('CustomerInfoModalComponent', () => {
    let component: CustomerInfoModalComponent;

    beforeEach(() => {
      component = Stub.get({
        component: CustomerInfoModalComponent,
        providers: [
          Stub.getMatDialogProvider(),
          Stub.getMatDialogDataProvider(mockDateWithMultipleCustomerInfo),
        ],
      });
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should format title correctly', () => {
      expect(component['title']).toBe('C123 - Test Customer');
    });

    it('should have correct page length', () => {
      expect(component['pageLength']()).toBe(2);
    });

    it('should handle page event correctly', () => {
      const pageEvent = { pageIndex: 1, pageSize: 1, length: 2 };
      component.handlePageEvent(pageEvent);
      expect(component['pageIndex']()).toBe(1);
    });

    it('should close dialog when onClose is called', () => {
      const dialogRefSpy = jest.spyOn(component['dialogRef'], 'close');
      component['onClose']();
      expect(dialogRefSpy).toHaveBeenCalled();
    });

    describe('getCustomerAttribute', () => {
      it('should return string value for single attribute', () => {
        const result = component['getCustomerAttribute']('region', 0);
        expect(result).toBe('EMEA');
      });

      it('should return combined string for array attributes', () => {
        const result = component['getCustomerAttribute']('salesOrg', 0);
        expect(result).toBe('S1 - Sales Org 1');
      });

      it('should return dash when attribute value is missing', () => {
        // Temporarily modify the data to test the fallback
        const originalValue = component['data'].customerInfo[0].region;
        component['data'].customerInfo[0].region = '';

        const result = component['getCustomerAttribute']('region', 0);
        expect(result).toBe('-');

        // Restore the original value
        component['data'].customerInfo[0].region = originalValue;
      });

      it('should return empty string for non-configured attribute', () => {
        const result = component['getCustomerAttribute'](
          'nonExistentAttribute',
          0
        );
        expect(result).toBe('');
      });
    });

    describe('getOwnerAttribute', () => {
      it('should return correct owner attribute value', () => {
        const result = component['getOwnerAttribute']('accountOwner', 0);
        expect(result).toBe('John Doe');
      });

      it('should return dash when owner attribute is missing', () => {
        // Temporarily modify the data to test the fallback
        const originalValue = component['data'].customerInfo[0].accountOwner;
        component['data'].customerInfo[0].accountOwner = '';

        const result = component['getOwnerAttribute']('accountOwner', 0);
        expect(result).toBe('-');

        // Restore the original value
        component['data'].customerInfo[0].accountOwner = originalValue;
      });

      it('should return dash for a different owner attribute when missing', () => {
        // Test a different owner attribute with null value
        const originalValue = component['data'].customerInfo[0].internalSales;
        component['data'].customerInfo[0].internalSales = null;

        const result = component['getOwnerAttribute']('internalSales', 0);
        expect(result).toBe('-');

        // Restore the original value
        component['data'].customerInfo[0].internalSales = originalValue;
      });

      it('should return correct value for owner attribute on different page index', () => {
        const result = component['getOwnerAttribute']('accountOwner', 1);
        expect(result).toBe('Alice Doe');
      });
    });

    describe('Pagination', () => {
      it('should initialize with page index 0', () => {
        expect(component['pageIndex']()).toBe(0);
      });

      it('should update page index when handlePageEvent is called', () => {
        component.handlePageEvent({ pageIndex: 1, pageSize: 10, length: 2 });
        expect(component['pageIndex']()).toBe(1);

        component.handlePageEvent({ pageIndex: 0, pageSize: 10, length: 2 });
        expect(component['pageIndex']()).toBe(0);
      });
    });

    describe('Customer attributes display', () => {
      it('should display attributes from the correct page index', () => {
        // Default page index 0
        let result = component['getCustomerAttribute']('region', 0);
        expect(result).toBe('EMEA');

        // Change to page index 1
        component.handlePageEvent({ pageIndex: 1, pageSize: 10, length: 2 });
        result = component['getCustomerAttribute']('region', 1);
        expect(result).toBe('NA');
      });

      it('should format combined attributes correctly', () => {
        const country = component['getCustomerAttribute']('country', 0);
        expect(country).toBe('DE - Germany');

        const keyAccount = component['getCustomerAttribute']('keyAccount', 0);
        expect(keyAccount).toBe('KA001 - Key Account Name');
      });
    });
  });

  describe('CustomPaginatorIntl', () => {
    let paginatorIntl: CustomPaginatorIntl;

    beforeEach(() => {
      paginatorIntl = new CustomPaginatorIntl();
    });

    it('should create an instance', () => {
      expect(paginatorIntl).toBeTruthy();
    });

    it('should format range label correctly', () => {
      const result = paginatorIntl.getRangeLabel(0, 10, 20);
      expect(result).toBe('1 of 2');
    });

    it('should format range label correctly with different values', () => {
      const result = paginatorIntl.getRangeLabel(2, 5, 30);
      expect(result).toBe('3 of 6');
    });

    it('should format range label when there is only one page', () => {
      const result = paginatorIntl.getRangeLabel(0, 10, 5);
      expect(result).toBe('1 of 1');
    });
  });
});
