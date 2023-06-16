import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { CellClassParams } from 'ag-grid-community';

import { AppRoutePath } from '../../../../../app/app-route-path.enum';
import { PositionIdComponent } from './position-id.component';

describe('PositionIdComponent', () => {
  let component: PositionIdComponent;
  let spectator: Spectator<PositionIdComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: PositionIdComponent,
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
        value: 10,
        data: {
          gqPositionId: '123',
        },
      };

      component.agInit(params as any);

      expect(component.gqPositionId).toEqual(params.data.gqPositionId);
      expect(component.itemId).toEqual('translate it');
      expect(translate).toHaveBeenCalledTimes(1);
      expect(translate).toBeCalledWith('shared.itemId', { id: 10 });
    });
  });

  describe('navigate', () => {
    test('should navigate', () => {
      const event = { preventDefault: jest.fn() };
      component['router'].navigate = jest.fn();

      component.navigate(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(component['router'].navigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('set URL', () => {
    test('should create valid URL', () => {
      const url =
        '/detail-view?customer_number=queryParamValue_customer_number&sales_org=queryParamValue_sales_org&quotation_number=queryParamValue_quotation_number&gqPositionId=123456789';
      router.createUrlTree = jest.fn().mockReturnValue(url);

      component.agInit({
        data: { gqPositionId: '123456789' },
      } as CellClassParams);

      expect(router.createUrlTree).toHaveBeenCalledTimes(1);
      expect(router.createUrlTree).toHaveBeenCalledWith(
        [AppRoutePath.DetailViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: { gqPositionId: '123456789' },
        }
      );
      expect(component.url).toEqual(url);
    });
  });
});
