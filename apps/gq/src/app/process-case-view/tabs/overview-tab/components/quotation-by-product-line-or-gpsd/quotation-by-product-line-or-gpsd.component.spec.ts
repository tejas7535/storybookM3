import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  getQuotationDetails,
  getQuotationDetailsByGPSD,
  getQuotationDetailsByPL,
} from '@gq/core/store/selectors';
import { StatusBarProperties } from '@gq/shared/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { HelperService } from '@gq/shared/services/helper-service/helper-service.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { PROCESS_CASE_STATE_MOCK } from '../../../../../../testing/mocks';
import { BarChartData } from '../../models';
import { QuotationByProductLineOrGpsdComponent } from './quotation-by-product-line-or-gpsd.component';
jest.mock('@gq/shared/services/price-service/price.service', () => ({
  PriceService: {
    calculateStatusBarValues: jest
      .fn()
      .mockReturnValue({ gpi: 10, gpm: 10, netValue: 100, avgGqRating: 2 }),
  },
}));
describe('QuotationByProductLineOrGpsdComponent', () => {
  let component: QuotationByProductLineOrGpsdComponent;
  let spectator: Spectator<QuotationByProductLineOrGpsdComponent>;
  let store: MockStore;

  const quotationDetailsMock: QuotationDetail[] = [
    {
      material: { gpsdGroupId: 'GPSD01', productLineId: '01' },
    } as unknown as QuotationDetail,
    {
      material: { gpsdGroupId: 'GPSD02', productLineId: '01' },
    } as unknown as QuotationDetail,
  ];
  const groupByPLMock = new Map([['01', [...quotationDetailsMock]]]);

  const groupByGPSDMock = new Map([
    ['GPSD01', [quotationDetailsMock[0]]],
    ['GPSD02', [quotationDetailsMock[1]]],
  ]);

  const createComponent = createComponentFactory({
    component: QuotationByProductLineOrGpsdComponent,
    imports: [MockModule(PushModule)],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          'azure-auth': {},
        },
      }),
      MockProvider(HelperService, {
        transformPercentage: jest.fn().mockReturnValue('17 %'),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInt', () => {
    beforeEach(() => {
      store.overrideSelector(getQuotationDetails, quotationDetailsMock);
      store.overrideSelector(getQuotationDetailsByGPSD, groupByGPSDMock);
      store.overrideSelector(getQuotationDetailsByPL, groupByPLMock);
    });

    test(
      'should calculate bar chartData',
      marbles((m) => {
        component['calculateShare'] = jest.fn().mockReturnValue('20%');
        m.expect(component['gpsdBarChartData$']).toBeObservable(
          m.cold('a', {
            a: [
              {
                name: 'GPSD01',
                gpm: '17 %',
                value: 100,
                share: '20%',
              } as BarChartData,
              {
                name: 'GPSD02',
                gpm: '17 %',
                value: 100,
                share: '20%',
              } as BarChartData,
            ],
          })
        );

        m.expect(component['plBarChartData$']).toBeObservable(
          m.cold('a', {
            a: [
              {
                name: 'PL 01',
                gpm: '17 %',
                value: 100,
                share: '20%',
              } as BarChartData,
            ],
          })
        );
      })
    );
  });
  describe('calculateShare', () => {
    test('should calculate the share', () => {
      const result = component['calculateShare'].call(
        component,
        { netValue: 1 } as StatusBarProperties,
        { netValue: 2 } as StatusBarProperties
      );
      expect(result).toBe('17 %');
    });
  });
  describe('ngOnDestroy', () => {
    test('should emit', () => {
      component['shutdown$$'].next = jest.fn();
      component['shutdown$$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['shutdown$$'].next).toHaveBeenCalled();
      expect(component['shutdown$$'].complete).toHaveBeenCalled();
    });
  });
});
