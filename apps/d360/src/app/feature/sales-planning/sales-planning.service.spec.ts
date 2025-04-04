import { HttpClient, HttpParams } from '@angular/common/http';

import { of, take } from 'rxjs';

import { Stub } from '../../shared/test/stub.class';
import { Region } from '../global-selection/model';
import {
  CustomerInfo,
  DetailedCustomerSalesPlan,
  DetailedSalesPlanUpdateRequest,
  SalesPlanResponse,
} from './model';
import { SalesPlanningService } from './sales-planning.service';

describe('SalesPlanningService', () => {
  let service: SalesPlanningService;
  let httpClient: HttpClient;

  beforeEach(() => {
    service = Stub.get({ component: SalesPlanningService });
    httpClient = service['http'];
  });

  describe('getCustomerInfo', () => {});
  it('should fetch customer info', (done) => {
    const mockData: CustomerInfo[] = [
      {
        globalCustomerNumber: '1230',
        region: Region.Europe,
        salesOrg: '0631',
        salesDescription: 'Schaeff. IOEM/MRO FR',
        salesArea: 'West Europe',
        countryCode: 'FR',
        countryDescription: 'Frankreich',
        sector: 'V713',
        sectorDescription: 'Bahn Radsatzl. Perso',
        planningCurrency: 'EUR',
        keyAccountNumber: '000071',
        keyAccountName: 'Alstom',
        subKeyAccountNumber: '100030',
        subKeyAccountName: 'Bombardier',
        accountOwner: 'Account, Owner XX/TT-ZZ',
        internalSales: 'Internal, Sales XX/TT-ZZ',
        demandPlanner: 'Demand, Planner XX/TT-ZZ',
        kam: 'Kam, Person XX/TT-ZZ',
        gkam: 'Gkam, Person XX/TT-ZZ',
      },
    ];
    const customerNumber = '12345';
    const language = 'en';
    const getSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockData));

    service
      .getCustomerInfo(customerNumber, language)
      .pipe(take(1))
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

    expect(getSpy).toHaveBeenCalledWith(
      `api/sales-planning/customer-info?customerNumber=${customerNumber}&language=${language}`
    );
  });

  describe('getCustomerSalesPlan', () => {
    it('should fetch customer sales plan', (done) => {
      const mockData: SalesPlanResponse = {
        customerNumber: '1230',
        planningCurrency: 'EUR',
        invoiceSalesPreviousYear: 45_300,
        invoiceSalesTwoYearsAgo: 41_493.08,
        unconstrainedPlanThisYear: 57_848,
        constrainedPlanThisYear: 67_649,
        constrainedPlanNextYear: 0,
        unconstrainedPlanNextYear: 149_500,
        constrainedPlanTwoYearsFromNow: 0,
        unconstrainedPlanTwoYearsFromNow: 487_600,
        constrainedPlanThreeYearsFromNow: 0,
        unconstrainedPlanThreeYearsFromNow: 0,
      };
      const customerNumber = '12345';
      const getSpy = jest
        .spyOn(httpClient, 'get')
        .mockReturnValue(of(mockData));

      service
        .getCustomerSalesPlan(customerNumber)
        .pipe(take(1))
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          done();
        });

      expect(getSpy).toHaveBeenCalledWith(
        `api/sales-planning/customer-sales-plan?customerNumber=${customerNumber}`
      );
    });
  });

  describe('getDetailedCustomerSalesPlan', () => {
    it('should fetch detailed customer sales plan with parameters', (done) => {
      const mockData: DetailedCustomerSalesPlan[] = [
        {
          customerNumber: '1230',
          planningCurrency: 'EUR',
          planningYear: '2026',
          planningMonth: '00',
          detailLevel: '2',
          planningMaterial: '',
          planningMaterialText: '',
          planningLevelMaterialType: 'PL',
          totalSalesPlanConstrained: 0,
          totalSalesPlanUnconstrained: 149_500,
          totalSalesPlanAdjusted: 0,
          addOneOriginalValue: 0,
          budgetNetSales: 609_339.34,
          budgetInvoicedSales: 609_339.34,
          planNetSales: 0,
          planInvoiceSales: 0,
          firmBusinessServices: 0,
          firmBusinessCoverage: 0,
          firmBusiness: 0,
          opportunitiesDemandRelevant: 149_500,
          opportunitiesDemandRelevantConstrained: 0,
          opportunitiesForecastRelevant: 0,
          opportunitiesTotal: 0,
          opportunitiesNotSalesPlanRelevant: 0,
          plannedValueDemand360: 0,
          openPlannedValueDemand360: 0,
          apShareConstrained: 0,
          apShareUnconstrained: 0,
          apShareAdjustedUnconstrained: 0,
          apMaterialDemandPlanCount: 0,
          spShareUnconstrained: 0,
          spShareConstrained: 0,
          spShareAdjustedUnconstrained: 0,
          spMaterialDemandPlanCount: 0,
          opShareUnconstrained: 0,
          opShareAdjustedUnconstrained: 0,
          opShareConstrained: 0,
          opMaterialDemandPlanCount: 0,
          salesDeduction: 0,
          cashDiscount: 0,
          otherRevenues: 0,
          salesPlanUnconstrained: 0,
          salesPlanConstrained: 0,
          deliveriesAcrossYears: 0,
          ordersAcrossYearsFuture: 0,
          ordersAcrossYearsPast: 0,
          editStatus: '',
          infoIcon: '',
          apShareOriginalUnconstrained: 0,
          spShareOriginalUnconstrained: 0,
          opShareOriginalUnconstrained: 0,
        },
      ];
      const customerNumber = '12345';
      const planningCurrency = 'USD';
      const planningLevelMaterialType = 'PL';
      const detailLevel = '3';
      const language = 'en';
      const getSpy = jest
        .spyOn(httpClient, 'get')
        .mockReturnValue(of(mockData));
      const params = new HttpParams()
        .set('customerNumber', customerNumber)
        .set('language', language)
        .set('currency', planningCurrency)
        .set('planningLevelMaterialType', planningLevelMaterialType)
        .set('detailLevel', detailLevel);

      service
        .getDetailedCustomerSalesPlan({
          customerNumber,
          planningCurrency: 'USD',
          planningLevelMaterialType: 'PL',
          detailLevel: '3',
        })
        .pipe(take(1))
        .subscribe((data) => {
          expect(data).toEqual(mockData);
          done();
        });

      expect(getSpy).toHaveBeenCalledWith(
        `/api/sales-planning/detailed-customer-sales-plan`,
        expect.objectContaining({ params })
      );
    });
  });

  describe('updateDetailedCustomerSalesPlan', () => {
    // The expectation is implicit in the correct HTTP request
    // eslint-disable-next-line jest/expect-expect
    it('should update detailed customer sales plan', (done) => {
      const customerNumber = '12345';
      const updateRequest: DetailedSalesPlanUpdateRequest = {
        planningYear: '2026',
        planningMonth: '01',
        planningMaterial: '06',
        planningCurrency: 'USD',
        planningLevelMaterialType: 'PL',
        adjustedValue: 100_000,
      };
      const putSpy = jest.spyOn(httpClient, 'put');
      const params = new HttpParams().set('customerNumber', customerNumber);

      service
        .updateDetailedCustomerSalesPlan(customerNumber, updateRequest)
        .pipe(take(1))
        .subscribe(() => {
          done();
        });

      expect(putSpy).toHaveBeenCalledWith(
        `/api/sales-planning/detailed-customer-sales-plan`,
        updateRequest,
        expect.objectContaining({
          params,
        })
      );
    });
  });

  describe('deleteDetailedCustomerSalesPlan', () => {
    // The expectation is implicit in the correct HTTP request
    // eslint-disable-next-line jest/expect-expect
    it('should delete detailed customer sales plan', (done) => {
      const deleteSpy = jest.spyOn(httpClient, 'delete');
      const customerNumber = '12345';
      const planningYear = '2026';
      const planningMonth = '01';
      const planningMaterial = '07';
      const params = new HttpParams()
        .set('customerNumber', customerNumber)
        .set('planningYear', planningYear)
        .set('planningMonth', planningMonth)
        .set('planningMaterial', planningMaterial);

      service
        .deleteDetailedCustomerSalesPlan(
          customerNumber,
          planningYear,
          planningMonth,
          planningMaterial
        )
        .pipe(take(1))
        .subscribe(() => {
          done();
        });

      expect(deleteSpy).toHaveBeenCalledWith(
        `/api/sales-planning/detailed-customer-sales-plan`,
        expect.objectContaining({ params })
      );
    });
  });

  describe('updateSalesDeductions', () => {
    it('should update sales deductions correctly', (done) => {
      const putSpy = jest.spyOn(httpClient, 'put');
      const customerNumber = '12345';
      const planningYear = '2026';
      const adjustedPercentage = 5.5;

      const params = new HttpParams()
        .set('customerNumber', customerNumber)
        .set('planningYear', planningYear);

      service
        .updateSalesDeductions(customerNumber, planningYear, adjustedPercentage)
        .pipe(take(1))
        .subscribe(() => {
          done();
        });

      expect(putSpy).toHaveBeenCalledWith(
        `api/sales-planning/sales-deductions`,
        { adjustedPercentage },
        expect.objectContaining({ params })
      );
    });
  });

  describe('updateCashDiscounts', () => {
    it('should update cash discounts correctly', (done) => {
      const putSpy = jest.spyOn(httpClient, 'put');
      const customerNumber = '12345';
      const planningYear = '2026';
      const adjustedPercentage = 2.3;

      const params = new HttpParams()
        .set('customerNumber', customerNumber)
        .set('planningYear', planningYear);

      service
        .updateCashDiscounts(customerNumber, planningYear, adjustedPercentage)
        .pipe(take(1))
        .subscribe(() => {
          done();
        });

      expect(putSpy).toHaveBeenCalledWith(
        `api/sales-planning/cash-discounts`,
        { adjustedPercentage },
        expect.objectContaining({ params })
      );
    });
  });

  describe('updateOtherRevenues', () => {
    it('should update other revenues correctly', (done) => {
      const putSpy = jest.spyOn(httpClient, 'put');
      const customerNumber = '12345';
      const planningYear = '2026';
      const planningCurrency = 'EUR';
      const adjustedValue = 15_000;
      const params = new HttpParams()
        .set('customerNumber', customerNumber)
        .set('planningYear', planningYear);

      service
        .updateOtherRevenues(
          customerNumber,
          planningYear,
          planningCurrency,
          adjustedValue
        )
        .pipe(take(1))
        .subscribe(() => {
          done();
        });

      expect(putSpy).toHaveBeenCalledWith(
        `api/sales-planning/other-revenues`,
        { planningCurrency, adjustedValue },
        expect.objectContaining({ params })
      );
    });
  });

  describe('updateShares', () => {
    it('should update the shares correctly', (done) => {
      const putSpy = jest.spyOn(httpClient, 'put');
      const customerNumber = '12345';
      const planningYear = '2026';
      const adjustedShares = { apShare: 10, spShare: 20, opShare: 70 };
      const params = new HttpParams()
        .set('customerNumber', customerNumber)
        .set('planningYear', planningYear);

      service
        .updateShares(customerNumber, planningYear, adjustedShares)
        .pipe(take(1))
        .subscribe(() => {
          done();
        });

      expect(putSpy).toHaveBeenCalledWith(
        `api/sales-planning/material-share`,
        adjustedShares,
        expect.objectContaining({ params })
      );
    });
  });

  describe('deleteShares', () => {
    it('should delete the shares correctly', (done) => {
      const deleteSpy = jest.spyOn(httpClient, 'delete');
      const customerNumber = '12345';
      const planningYear = '2026';
      const params = new HttpParams()
        .set('customerNumber', customerNumber)
        .set('planningYear', planningYear);

      service
        .deleteShares(customerNumber, planningYear)
        .pipe(take(1))
        .subscribe(() => {
          done();
        });

      expect(deleteSpy).toHaveBeenCalledWith(
        `api/sales-planning/material-share`,
        expect.objectContaining({ params })
      );
    });
  });
});
