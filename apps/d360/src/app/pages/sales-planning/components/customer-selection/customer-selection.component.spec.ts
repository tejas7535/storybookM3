import { of } from 'rxjs';

import { AppRoutePath } from '../../../../app.routes.enum';
import { CustomerInfo } from '../../../../feature/sales-planning/model';
import { CustomerInfoModalComponent } from '../customer-info-modal/customer-info-modal.component';
import { Stub } from './../../../../shared/test/stub.class';
import { CustomerSelectionComponent } from './customer-selection.component';

describe('CustomerSelectionComponent', () => {
  let component: CustomerSelectionComponent;

  const mockSalesPlanResponse = {
    invoiceSalesTwoYearsAgo: 1000,
    invoiceSalesPreviousYear: 2000,
    unconstrainedPlanThisYear: 3000,
    constrainedPlanThisYear: 4000,
    unconstrainedPlanNextYear: 5000,
    constrainedPlanNextYear: 6000,
    unconstrainedPlanTwoYearsFromNow: 7000,
    constrainedPlanTwoYearsFromNow: 8000,
    unconstrainedPlanThreeYearsFromNow: 8000,
    constrainedPlanThreeYearsFromNow: 9000,
    planningCurrency: 'EUR',
  };

  const mockCustomerInfo: CustomerInfo[] = [
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
  ];

  beforeEach(() => {
    component = Stub.getForEffect<CustomerSelectionComponent>({
      component: CustomerSelectionComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getSalesPlanningServiceProvider({
          getCustomerSalesPlan: mockSalesPlanResponse,
          getCustomerInfo: mockCustomerInfo,
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    jest.spyOn(component, 'handleCustomerChange').mockImplementation(() => {});
    jest
      .spyOn(component as any, 'openCustomerInfoModal')
      .mockImplementation(() => {});
    jest
      .spyOn(component as any, 'fetchCustomerSalesPlan')
      .mockImplementation(() => {});
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      jest.spyOn(sessionStorage, 'getItem');
    });

    it('should set formGroup value with customer from sessionStorage if it exists', () => {
      const mockCustomerNumber = 'C123';
      sessionStorage.getItem = jest
        .fn()
        .mockReturnValue(
          JSON.stringify({ customerNumber: mockCustomerNumber })
        );
      const patchValueSpy = jest.spyOn(component['formGroup'], 'patchValue');

      component.ngOnInit();

      expect(patchValueSpy).toHaveBeenCalledWith({
        customer: mockCustomerNumber,
      });
    });

    it('should not set formGroup value if customer does not exist in sessionStorage', () => {
      sessionStorage.getItem = jest.fn().mockReturnValue(null);
      const patchValueSpy = jest.spyOn(component['formGroup'], 'patchValue');

      component.ngOnInit();

      expect(patchValueSpy).not.toHaveBeenCalled();
    });

    it('should subscribe to formGroup valueChanges and call handleCustomerChange', () => {
      const mockCustomerNumber = 'C123';
      sessionStorage.getItem = jest
        .fn()
        .mockReturnValue(
          JSON.stringify({ customerNumber: [mockCustomerNumber] })
        );

      const handleCustomerChangeSpy = jest.spyOn(
        component,
        'handleCustomerChange'
      );

      component.ngOnInit();

      Stub.detectChanges();

      expect(handleCustomerChangeSpy).toHaveBeenCalledWith({
        option: mockCustomerNumber,
      });
    });
  });

  describe('handleCustomerChange', () => {
    it('should set selectedCustomer to null if event option is null or id is null', () => {
      const setSpy = jest.spyOn(component['selectedCustomer'], 'set');

      component.handleCustomerChange({ option: null });

      expect(setSpy).toHaveBeenCalledWith(null);

      component.handleCustomerChange({ option: { id: null, text: 'Test' } });

      expect(setSpy).toHaveBeenCalledWith(null);
    });

    it('should set selectedCustomer with customerNumber and customerName if event option is valid', () => {
      const setSpy = jest.spyOn(component['selectedCustomer'], 'set');
      const mockEvent = {
        option: { id: 'C123', text: 'Customer 123' },
      };

      component.handleCustomerChange(mockEvent);

      expect(setSpy).toHaveBeenCalledWith({
        customerNumber: 'C123',
        customerName: 'Customer 123',
      });
    });

    it('should reset selectedCustomerSalesPlan, selectedCustomerPlanningCurrency, and selectedCustomerInfo', () => {
      const salesPlanSpy = jest.spyOn(
        component['selectedCustomerSalesPlan'],
        'set'
      );
      const planningCurrencySpy = jest.spyOn(
        component['selectedCustomerPlanningCurrency'],
        'set'
      );
      const customerInfoSpy = jest.spyOn(
        component['selectedCustomerInfo'],
        'set'
      );

      component.handleCustomerChange({
        option: { id: 'C123', text: 'Customer 123' },
      });

      expect(salesPlanSpy).toHaveBeenCalledWith([]);
      expect(planningCurrencySpy).toHaveBeenCalledWith(null);
      expect(customerInfoSpy).toHaveBeenCalledWith([]);
    });

    it('should call fetchCustomerSalesPlan', () => {
      const fetchSpy = jest.spyOn(component as any, 'fetchCustomerSalesPlan');

      component.handleCustomerChange({
        option: { id: 'C123', text: 'Customer 123' },
      });

      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe('fetchCustomerSalesPlan', () => {
    it('should set selectedCustomerSalesPlan and selectedCustomerPlanningCurrency when selectedCustomer exists', (done) => {
      const mockCustomerNumber = 'C123';
      const mockResponse = {
        invoiceSalesTwoYearsAgo: 1000,
        invoiceSalesPreviousYear: 2000,
        unconstrainedPlanThisYear: 3000,
        constrainedPlanThisYear: 4000,
        unconstrainedPlanNextYear: 5000,
        constrainedPlanNextYear: 6000,
        unconstrainedPlanTwoYearsFromNow: 7000,
        constrainedPlanTwoYearsFromNow: 8000,
        unconstrainedPlanThreeYearsFromNow: 9000,
        constrainedPlanThreeYearsFromNow: 10_000,
        planningCurrency: 'EUR',
      };

      jest
        .spyOn(component['salesPlanningService'], 'getCustomerSalesPlan')
        .mockReturnValue(of(mockResponse as any));

      component['selectedCustomer'].set({
        customerNumber: mockCustomerNumber,
        customerName: 'Customer 123',
      });

      const salesPlanSpy = jest.spyOn(
        component['selectedCustomerSalesPlan'],
        'set'
      );
      const currencySpy = jest.spyOn(
        component['selectedCustomerPlanningCurrency'],
        'set'
      );
      const emitSpy = jest.spyOn(
        component['onCustomerSelectionChange'],
        'emit'
      );

      component['fetchCustomerSalesPlan']();

      setTimeout(() => {
        expect(salesPlanSpy).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              constrained: mockResponse.invoiceSalesTwoYearsAgo,
              year: new Date().getFullYear() - 2,
            }),
            expect.objectContaining({
              constrained: mockResponse.invoiceSalesPreviousYear,
              year: new Date().getFullYear() - 1,
            }),
            expect.objectContaining({
              unconstrained: mockResponse.unconstrainedPlanThisYear,
              constrained: mockResponse.constrainedPlanThisYear,
              year: new Date().getFullYear(),
            }),
          ])
        );
        expect(currencySpy).toHaveBeenCalledWith(mockResponse.planningCurrency);
        expect(emitSpy).toHaveBeenCalledWith({
          customerName: 'Customer 123',
          customerNumber: mockCustomerNumber,
          planningCurrency: mockResponse.planningCurrency,
        });
        done();
      });
    });

    it('should reset sessionStorage and emit null values when selectedCustomer does not exist', () => {
      jest.spyOn(component['selectedCustomer'], 'set').mockImplementation();
      component['selectedCustomer'].set(null);

      const sessionStorageSpy = jest.spyOn(sessionStorage, 'setItem');
      const emitSpy = jest.spyOn(
        component['onCustomerSelectionChange'],
        'emit'
      );

      component['fetchCustomerSalesPlan']();

      expect(sessionStorageSpy).toHaveBeenCalledWith(
        AppRoutePath.SalesValidationPage,
        JSON.stringify(null)
      );
      expect(emitSpy).toHaveBeenCalledWith({
        customerName: null,
        customerNumber: null,
        planningCurrency: null,
      });
    });
  });

  describe('handleCustomerInfoClick', () => {
    it('should fetch customer info and open the modal if selectedCustomerInfo is empty', (done) => {
      jest.spyOn(component['selectedCustomerInfo'], 'set');
      jest
        .spyOn(component['salesPlanningService'], 'getCustomerInfo')
        .mockReturnValue(of(mockCustomerInfo));
      const openModalSpy = jest.spyOn(
        component as any,
        'openCustomerInfoModal'
      );

      component['selectedCustomer'].set({
        customerNumber: 'C123',
        customerName: 'Customer 123',
      });

      component['handleCustomerInfoClick']();

      setTimeout(() => {
        expect(
          component['salesPlanningService'].getCustomerInfo
        ).toHaveBeenCalledWith(
          'C123',
          component['translocoService'].getActiveLang()
        );
        expect(component['selectedCustomerInfo'].set).toHaveBeenCalledWith(
          mockCustomerInfo
        );
        expect(openModalSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should open the modal directly if selectedCustomerInfo is not empty', () => {
      const openModalSpy = jest
        .spyOn(component as any, 'openCustomerInfoModal')
        .mockImplementation(() => {});

      component['selectedCustomerInfo'].set([
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
      ]);

      component['handleCustomerInfoClick']();

      expect(openModalSpy).toHaveBeenCalled();
    });
  });

  describe('openCustomerInfoModal', () => {
    it('should open the CustomerInfoModalComponent with the correct data', () => {
      const dialogSpy = jest.spyOn(component['dialog'], 'open');

      component['selectedCustomerInfo'].set(mockCustomerInfo);
      component['selectedCustomer'].set({
        customerNumber: 'C123',
        customerName: 'Customer 123',
      });

      component['openCustomerInfoModal']();

      expect(dialogSpy).toHaveBeenCalledWith(CustomerInfoModalComponent, {
        data: {
          customerInfo: mockCustomerInfo,
          customerNumber: 'C123',
          customerName: 'Customer 123',
        },
        autoFocus: false,
        disableClose: true,
        panelClass: ['form-dialog'],
        minWidth: '50vw',
      });
    });
  });
});
