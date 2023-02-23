import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { AppRoutePath } from './../../../../app-route-path.enum';
import { DetailRoutePath } from './../../../../detail-view/detail-route-path.enum';
import { SapPriceCellComponent } from './sap-price-cell.component';

describe('SapPriceCellComponent', () => {
  let component: SapPriceCellComponent;
  let spectator: Spectator<SapPriceCellComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: SapPriceCellComponent,
    imports: [RouterTestingModule, SharedPipesModule],
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
    test('should create valid URL, set value and navigationExtras', () => {
      const url =
        '/detail-view/sap?customer_number=queryParamValue_customer_number&sales_org=queryParamValue_sales_org&quotation_number=queryParamValue_quotation_number&gqPositionId=123456789';
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
        [`${AppRoutePath.DetailViewPath}/${DetailRoutePath.SapPath}`],
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
});
