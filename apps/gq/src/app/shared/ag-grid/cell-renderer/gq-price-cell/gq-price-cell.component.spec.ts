import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { RolesFacade } from '@gq/core/store/facades';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import * as fPricingUtils from '@gq/shared/utils/f-pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { ICellRendererParams } from 'ag-grid-enterprise';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { AppRoutePath } from '../../../../../app/app-route-path.enum';
import { DetailRoutePath } from '../../../../../app/detail-view/detail-route-path.enum';
import { GqPriceCellComponent } from './gq-price-cell.component';

describe('GqPriceCellComponent', () => {
  let component: GqPriceCellComponent;
  let spectator: Spectator<GqPriceCellComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: GqPriceCellComponent,
    imports: [RouterTestingModule, SharedPipesModule, PushPipe],
    providers: [
      MockProvider(RolesFacade, {
        userHasAccessToComparableTransactions$: of(true),
      }),
    ],
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
    beforeEach(() => {
      jest.spyOn(fPricingUtils, 'isFNumber').mockReturnValue(true);
    });
    test('should create valid URL, set value and navigationExtras', () => {
      const url =
        '/detail-view/transactions?customer_number=queryParamValue_customer_number&sales_org=queryParamValue_sales_org&quotation_number=queryParamValue_quotation_number&gqPositionId=123456789';
      router.createUrlTree = jest.fn().mockReturnValue(url);
      const navigationExtras = {
        queryParamsHandling: 'merge',
        queryParams: { gqPositionId: '123456789' },
      };
      component.agInit({
        data: { gqPositionId: '123456789' },
        valueFormatted: 'valueFormatted',
      } as ICellRendererParams);

      expect(router.createUrlTree).toHaveBeenCalledTimes(1);
      expect(router.createUrlTree).toHaveBeenCalledWith(
        [`${AppRoutePath.DetailViewPath}/${DetailRoutePath.TransactionsPath}`],
        navigationExtras
      );
      expect(component.url).toEqual(url);
      expect(component.value).toEqual('valueFormatted');
      expect(component.navigationExtras).toEqual(navigationExtras);
    });
  });
  describe('navigate', () => {
    test('should navigate', () => {
      const event = { preventDefault: jest.fn() };
      router.navigate = jest.fn();

      component.navigate(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });
  describe('isDetailsLinkVisible$', () => {
    test(
      'should return true when is not f number and strategic price is not set',
      marbles((m) => {
        jest.spyOn(fPricingUtils, 'isFNumber').mockReturnValue(false);
        component.agInit({
          data: { gqPositionId: '123456789', strategicPrice: null },
          valueFormatted: 'valueFormatted',
        } as ICellRendererParams);

        m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
          a: true,
        });
      })
    );

    test(
      'should return false when is not f number and strategic price is set',
      marbles((m) => {
        jest.spyOn(fPricingUtils, 'isFNumber').mockReturnValue(false);
        component.agInit({
          data: { gqPositionId: '123456789', strategicPrice: 50 },
          valueFormatted: 'valueFormatted',
        } as ICellRendererParams);

        m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
          a: false,
        });
      })
    );

    test(
      'should return false when is f number and strategic price is not set',
      marbles((m) => {
        jest.spyOn(fPricingUtils, 'isFNumber').mockReturnValue(true);
        component.agInit({
          data: { gqPositionId: '123456789', strategicPrice: null },
          valueFormatted: 'valueFormatted',
        } as ICellRendererParams);

        m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
          a: false,
        });
      })
    );

    test(
      'should return false when is f number and strategic price is set',
      marbles((m) => {
        jest.spyOn(fPricingUtils, 'isFNumber').mockReturnValue(true);
        component.agInit({
          data: { gqPositionId: '123456789', strategicPrice: 50 },
          valueFormatted: 'valueFormatted',
        } as ICellRendererParams);

        m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
          a: false,
        });
      })
    );
  });
});
