import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RfqStatus } from '@gq/shared/models/quotation-detail/rfq-status.enum';
import { translate } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CellClassParams } from 'ag-grid-community';
import { when } from 'jest-when';

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
      expect(component.isRfq).toBe(false);
      expect(component.itemId).toEqual('translate it');
      expect(translate).toHaveBeenCalledTimes(1);
      expect(translate).toBeCalledWith('shared.itemId', { id: 10 });
    });

    test('should set imagePath and Tooltip when position is an open RFQ', () => {
      const params = {
        value: 10,
        data: {
          gqPositionId: '123',
          rfqData: {
            rfqId: '123',
            status: RfqStatus.OPEN,
          },
        },
      };

      when(translate).calledWith('shared.rfqOpen').mockReturnValue('Open RFQ');

      component.agInit(params as any);

      expect(component.imagePath).toEqual('assets/png/rfq_open.png');
      expect(component.toolTipText).toEqual('Open RFQ');
    });

    test('should set imagePath and Tooltip when position is an closed RFQ', () => {
      const params = {
        value: 10,
        data: {
          gqPositionId: '123',
          rfqData: {
            rfqId: '123',
            status: RfqStatus.CLOSED,
          },
        },
      };

      when(translate)
        .calledWith('shared.rfqClosed')
        .mockReturnValue('Closed RFQ');

      component.agInit(params as any);

      expect(component.imagePath).toEqual('assets/png/rfq_closed.png');
      expect(component.toolTipText).toEqual('Closed RFQ');
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
