import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { AppRoutePath } from '../../../../../app/app-route-path.enum';
import { VIEW_QUOTATION_MOCK } from '../../../../../testing/mocks';
import { GqIdComponent } from './gq-id.component';

describe('GqIdComponent', () => {
  let component: GqIdComponent;
  let spectator: Spectator<GqIdComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: GqIdComponent,
    imports: [RouterTestingModule],
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
      };

      component.agInit(params as any);

      expect(component.valueFormatted).toEqual(params.valueFormatted);
      expect(component.quotation).toEqual(params.data);
    });
  });

  describe('navigate', () => {
    test('should navigate', () => {
      const event = { preventDefault: jest.fn() };
      component['router'].navigate = jest.fn();
      component.quotation = {
        customerIdentifiers: { customerId: '1', salesOrg: '267' },
      } as any;

      component.navigate(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(component['router'].navigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('set URL', () => {
    test('should create valid URL', () => {
      const url = `/process-case?quotation_number=${VIEW_QUOTATION_MOCK.gqId}&customer_number=${VIEW_QUOTATION_MOCK.customerIdentifiers.customerId}&sales_org=${VIEW_QUOTATION_MOCK.customerIdentifiers.salesOrg}`;
      router.createUrlTree = jest.fn().mockReturnValue(url);

      component.agInit({
        valueFormatted: 'GQ123',
        data: VIEW_QUOTATION_MOCK,
      } as any);

      expect(router.createUrlTree).toHaveBeenCalledTimes(1);
      expect(router.createUrlTree).toHaveBeenCalledWith(
        [AppRoutePath.ProcessCaseViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            quotation_number: VIEW_QUOTATION_MOCK.gqId,
            customer_number: VIEW_QUOTATION_MOCK.customerIdentifiers.customerId,
            sales_org: VIEW_QUOTATION_MOCK.customerIdentifiers.salesOrg,
          },
        }
      );
      expect(component.url).toEqual(url);
    });
  });
});
