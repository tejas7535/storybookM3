import { NavigationExtras, Router, RouterModule } from '@angular/router';

import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import { MaterialsCriteriaSelection } from '@gq/shared/components/global-search-bar/materials-result-table/material-criteria-selection.enum';
import { QuotationStatus } from '@gq/shared/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { AppRoutePath } from '../../../../../app/app-route-path.enum';
import { VIEW_QUOTATION_MOCK } from '../../../../../testing/mocks';
import { ColumnUtilityService } from '../../services';
import { GqIdComponent } from './gq-id.component';

describe('GqIdComponent', () => {
  let component: GqIdComponent;
  let spectator: Spectator<GqIdComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: GqIdComponent,
    imports: [RouterModule.forRoot([])],
    providers: [mockProvider(ColumnUtilityService)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set itemId and gqPositionId', () => {
      const params = {
        valueFormatted: 'GQ123',
        data: VIEW_QUOTATION_MOCK,
        node: { data: { itemId: '123', gqPositionId: '456' } },
      };

      jest
        .spyOn(component['columnUtilityService'], 'determineCaseNavigationPath')
        .mockReturnValue([AppRoutePath.ProcessCaseViewPath]);

      component.agInit(params as any);

      expect(component.valueFormatted).toEqual(params.valueFormatted);
      expect(component.quotation).toEqual(params.data);
    });
    test('should adjust queryParams for materials tab when selected criteria is MaterialNumber', () => {
      const params = {
        valueFormatted: 'GQ123',
        data: VIEW_QUOTATION_MOCK,
        context: {
          filter: MaterialsCriteriaSelection.MATERIAL_NUMBER,
          columnUtilityService: {
            materialTransform: jest.fn(() => '123'),
          },
        },
        node: { data: { materialNumber15: '123' } },
      };

      jest
        .spyOn(component['columnUtilityService'], 'determineCaseNavigationPath')
        .mockReturnValue([AppRoutePath.ProcessCaseViewPath]);

      component.agInit(params as any);

      expect(component.urlQueryParams.queryParams).toEqual({
        quotation_number: VIEW_QUOTATION_MOCK.gqId,
        customer_number: VIEW_QUOTATION_MOCK.customerIdentifiers.customerId,
        sales_org: VIEW_QUOTATION_MOCK.customerIdentifiers.salesOrg,
        'filter_material.materialNumber15': '123',
      });
    });

    test('should adjust queryParams for materials tab when selected criteria is MaterialDescription', () => {
      const params = {
        valueFormatted: 'GQ123',
        data: VIEW_QUOTATION_MOCK,
        context: {
          filter: MaterialsCriteriaSelection.MATERIAL_DESCRIPTION,
        },
        node: { data: { materialDescription: 'description' } },
      };

      jest
        .spyOn(component['columnUtilityService'], 'determineCaseNavigationPath')
        .mockReturnValue([AppRoutePath.ProcessCaseViewPath]);

      component.agInit(params as any);

      expect(component.urlQueryParams.queryParams).toEqual({
        quotation_number: VIEW_QUOTATION_MOCK.gqId,
        customer_number: VIEW_QUOTATION_MOCK.customerIdentifiers.customerId,
        sales_org: VIEW_QUOTATION_MOCK.customerIdentifiers.salesOrg,
        'filter_material.materialDescription': 'description',
      });
    });

    test('should adjust queryParams for materials tab when selected criteria is CustomerMaterialNumber', () => {
      const params = {
        valueFormatted: 'GQ123',
        data: VIEW_QUOTATION_MOCK,
        context: {
          filter: MaterialsCriteriaSelection.CUSTOMER_MATERIAL_NUMBER,
        },
        node: { data: { customerMaterial: 'customerMaterial' } },
      };

      jest
        .spyOn(component['columnUtilityService'], 'determineCaseNavigationPath')
        .mockReturnValue([AppRoutePath.ProcessCaseViewPath]);

      component.agInit(params as any);

      expect(component.urlQueryParams.queryParams).toEqual({
        quotation_number: VIEW_QUOTATION_MOCK.gqId,
        customer_number: VIEW_QUOTATION_MOCK.customerIdentifiers.customerId,
        sales_org: VIEW_QUOTATION_MOCK.customerIdentifiers.salesOrg,
        filter_customerMaterial: 'customerMaterial',
      });
    });
  });

  describe('navigate', () => {
    test('should navigate', () => {
      const event = { preventDefault: jest.fn() };
      const quotation = {
        gqId: 999,
        customerIdentifiers: { customerId: '1', salesOrg: '267' },
        status: QuotationStatus.IN_APPROVAL,
        enabledForApprovalWorkflow: false,
      } as any;

      const urlQueryParams: NavigationExtras = {
        queryParamsHandling: 'merge',
        queryParams: {
          quotation_number: quotation.gqId,
          customer_number: quotation.customerIdentifiers.customerId,
          sales_org: quotation.customerIdentifiers.salesOrg,
        },
      };

      component['router'].navigate = jest.fn();
      component.quotation = quotation;
      component.urlQueryParams = urlQueryParams;

      const determineCaseNavigationPathSpy = jest.spyOn(
        component['columnUtilityService'],
        'determineCaseNavigationPath'
      );
      const navigationPath = [
        AppRoutePath.ProcessCaseViewPath,
        ProcessCaseRoutePath.OverviewPath,
      ];
      determineCaseNavigationPathSpy.mockReturnValue(navigationPath);

      component.navigate(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(determineCaseNavigationPathSpy).toHaveBeenCalledWith(
        quotation.status,
        quotation.enabledForApprovalWorkflow
      );
      expect(component['router'].navigate).toHaveBeenCalledTimes(1);
      expect(component['router'].navigate).toHaveBeenCalledWith(
        navigationPath,
        urlQueryParams
      );
    });
  });

  describe('set URL', () => {
    test('should create valid URL', () => {
      const url = `/process-case?quotation_number=${VIEW_QUOTATION_MOCK.gqId}&customer_number=${VIEW_QUOTATION_MOCK.customerIdentifiers.customerId}&sales_org=${VIEW_QUOTATION_MOCK.customerIdentifiers.salesOrg}`;
      router.createUrlTree = jest.fn().mockReturnValue(url);

      const determineCaseNavigationPathSpy = jest.spyOn(
        component['columnUtilityService'],
        'determineCaseNavigationPath'
      );
      const navigationPath = [AppRoutePath.ProcessCaseViewPath];
      determineCaseNavigationPathSpy.mockReturnValue(navigationPath);

      component.agInit({
        valueFormatted: 'GQ123',
        data: VIEW_QUOTATION_MOCK,
        node: { data: { itemId: '123', gqPositionId: '456' } },
      } as any);

      expect(router.createUrlTree).toHaveBeenCalledTimes(1);
      expect(router.createUrlTree).toHaveBeenCalledWith(navigationPath, {
        queryParamsHandling: 'merge',
        queryParams: {
          quotation_number: VIEW_QUOTATION_MOCK.gqId,
          customer_number: VIEW_QUOTATION_MOCK.customerIdentifiers.customerId,
          sales_org: VIEW_QUOTATION_MOCK.customerIdentifiers.salesOrg,
        },
      });
      expect(determineCaseNavigationPathSpy).toHaveBeenCalledWith(
        VIEW_QUOTATION_MOCK.status,
        VIEW_QUOTATION_MOCK.enabledForApprovalWorkflow
      );
      expect(component.url).toEqual(url);
    });
  });
});
