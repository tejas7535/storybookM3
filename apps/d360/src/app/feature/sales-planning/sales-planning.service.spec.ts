import { take } from 'rxjs';

import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';

import { Region } from '../global-selection/model';
import {
  CustomerInfo,
  DetailedCustomerSalesPlan,
  DetailedSalesPlanUpdateRequest,
  SalesPlanResponse,
} from './model';
import { SalesPlanningService } from './sales-planning.service';

describe('SalesPlanningService', () => {
  let spectator: SpectatorHttp<SalesPlanningService>;

  const createService = createHttpFactory({
    service: SalesPlanningService,
  });

  beforeEach(() => {
    spectator = createService();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

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

    spectator.service
      .getCustomerInfo(customerNumber, language)
      .pipe(take(1))
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

    spectator
      .expectOne(
        `api/sales-planning/customer-info?customerNumber=${customerNumber}&language=${language}`,
        HttpMethod.GET
      )
      .flush(mockData);
  });

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

    spectator.service
      .getCustomerSalesPlan(customerNumber)
      .pipe(take(1))
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

    spectator
      .expectOne(
        `api/sales-planning/customer-sales-plan?customerNumber=${customerNumber}`,
        HttpMethod.GET
      )
      .flush(mockData);
  });

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
    const language = 'de';

    spectator.service
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

    spectator
      .expectOne(
        `/api/sales-planning/detailed-customer-sales-plan?customerNumber=${customerNumber}&language=${language}&currency=${planningCurrency}&planningLevelMaterialType=${planningLevelMaterialType}&detailLevel=${detailLevel}`,
        HttpMethod.GET
      )
      .flush(mockData);
  });

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

    spectator.service
      .updateDetailedCustomerSalesPlan(customerNumber, updateRequest)
      .pipe(take(1))
      .subscribe(() => {
        done();
      });

    spectator
      .expectOne(
        `/api/sales-planning/detailed-customer-sales-plan?customerNumber=${customerNumber}`,
        HttpMethod.PUT
      )
      .flush(null);
  });

  // The expectation is implicit in the correct HTTP request
  // eslint-disable-next-line jest/expect-expect
  it('should delete detailed customer sales plan', (done) => {
    const customerNumber = '12345';
    const planningYear = '2026';
    const planningMonth = '01';
    const planningMaterial = '07';

    spectator.service
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

    spectator
      .expectOne(
        `/api/sales-planning/detailed-customer-sales-plan?customerNumber=${customerNumber}&planningYear=${planningYear}&planningMonth=${planningMonth}&planningMaterial=${planningMaterial}`,
        HttpMethod.DELETE
      )
      .flush(null);
  });

  it('should update sales deductions correctly', (done) => {
    const customerNumber = '12345';
    const planningYear = '2026';
    const adjustedPercentage = 5.5;

    spectator.service
      .updateSalesDeductions(customerNumber, planningYear, adjustedPercentage)
      .pipe(take(1))
      .subscribe(() => {
        done();
      });

    const req = spectator.expectOne(
      `api/sales-planning/sales-deductions?customerNumber=${customerNumber}&planningYear=${planningYear}`,
      HttpMethod.PUT
    );

    expect(req.request.body).toEqual({
      adjustedPercentage,
    });

    req.flush(null);
  });

  it('should update cash discounts correctly', (done) => {
    const customerNumber = '12345';
    const planningYear = '2026';
    const adjustedPercentage = 2.3;

    spectator.service
      .updateCashDiscounts(customerNumber, planningYear, adjustedPercentage)
      .pipe(take(1))
      .subscribe(() => {
        done();
      });

    const req = spectator.expectOne(
      `api/sales-planning/cash-discounts?customerNumber=${customerNumber}&planningYear=${planningYear}`,
      HttpMethod.PUT
    );

    expect(req.request.body).toEqual({
      adjustedPercentage,
    });

    req.flush(null);
  });

  it('should update other revenues correctly', (done) => {
    const customerNumber = '12345';
    const planningYear = '2026';
    const planningCurrency = 'EUR';
    const adjustedValue = 15_000;

    spectator.service
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

    const req = spectator.expectOne(
      `api/sales-planning/other-revenues?customerNumber=${customerNumber}&planningYear=${planningYear}`,
      HttpMethod.PUT
    );

    expect(req.request.body).toEqual({
      planningCurrency,
      adjustedValue,
    });

    req.flush(null);
  });
});
