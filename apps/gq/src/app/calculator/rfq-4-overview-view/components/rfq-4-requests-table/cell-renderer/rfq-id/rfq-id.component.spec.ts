import { Router, RouterModule } from '@angular/router';

import { CalculatorPaths } from '@gq/calculator/routing/calculator-paths.enum';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RfqIdComponent } from './rfq-id.component';

describe('RfqIdComponent', () => {
  let component: RfqIdComponent;
  let spectator: Spectator<RfqIdComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: RfqIdComponent,
    imports: [RouterModule.forRoot([])],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(router).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set rfqId and valueFormatted', () => {
      const params = {
        valueFormatted: 'RFQ123',
        data: { rfqId: '123' },
      };

      component.agInit(params as any);

      expect(component.valueFormatted).toEqual(params.valueFormatted);
      expect(component.rfqRequest).toEqual(params.data);
    });
    test('should set urlQueryParams and url', () => {
      const params = {
        valueFormatted: 'RFQ123',
        data: { rfqId: '123' },
      };

      component.agInit(params as any);

      expect(component.urlQueryParams).toEqual({
        queryParamsHandling: 'merge',
        queryParams: { rfqId: '123' },
      });
      expect(component.url).toContain('/rfq-4-detail-view?rfqId=123');
    });
  });
  describe('navigate', () => {
    test('should call router.navigate with correct parameters', () => {
      const event = new MouseEvent('click');
      const params = {
        valueFormatted: 'RFQ123',
        data: { rfqId: '123' },
      };

      component.agInit(params as any);

      jest.spyOn(router, 'navigate').mockImplementation();

      component.navigate(event);

      expect(router.navigate).toHaveBeenCalledWith(
        [`${CalculatorPaths.Rfq4DetailViewPath}`],
        component.urlQueryParams
      );
    });
  });
});
