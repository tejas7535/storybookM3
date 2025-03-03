import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import {
  getQuotationDetails,
  getQuotationDetailsByGPSD,
  getQuotationDetailsByPL,
} from '@gq/core/store/active-case/active-case.selectors';
import { QuotationDetail } from '@gq/shared/models/quotation-detail/quotation-detail.model';
import { CalculationService } from '@gq/shared/services/rest/calculation/calculation.service';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPipe, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { PROCESS_CASE_STATE_MOCK } from '../../../../../../testing/mocks';
import { BarChartData } from '../../models';
import { QuotationByProductLineOrGpsdComponent } from './quotation-by-product-line-or-gpsd.component';

describe('QuotationByProductLineOrGpsdComponent', () => {
  let component: QuotationByProductLineOrGpsdComponent;
  let spectator: Spectator<QuotationByProductLineOrGpsdComponent>;
  let store: MockStore;

  const quotationDetailsMock = [
    {
      material: { gpsdGroupId: 'GPSD01', productLineId: '01' },
    },
    {
      material: { gpsdGroupId: 'GPSD02', productLineId: '01' },
    },
  ] as QuotationDetail[];

  const groupByPLMock = new Map([['01', [...quotationDetailsMock]]]);

  const groupByGPSDMock = new Map([
    ['GPSD01', [quotationDetailsMock[0]]],
    ['GPSD02', [quotationDetailsMock[1]]],
  ]);

  const createComponent = createComponentFactory({
    component: QuotationByProductLineOrGpsdComponent,
    imports: [MockPipe(PushPipe)],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          'azure-auth': {},
        },
      }),
      MockProvider(TransformationService, {
        transformPercentage: jest.fn().mockReturnValue('17 %'),
      }),
      MockProvider(CalculationService, {
        getQuotationKpiCalculation: jest
          .fn()
          .mockReturnValue(
            of({ totalNetValue: 100, totalWeightedAverageGpm: 0.17 })
          ),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.overrideSelector(getQuotationDetails, quotationDetailsMock);
    store.overrideSelector(getQuotationDetailsByGPSD, groupByGPSDMock);
    store.overrideSelector(getQuotationDetailsByPL, groupByPLMock);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should calculate bar chartData',
      marbles((m) => {
        spectator.detectChanges();

        m.expect(component.gpsdBarChartData$).toBeObservable(
          m.cold('a', {
            a: [
              {
                name: 'GPSD01',
                gpm: '17 %',
                value: 100,
                share: '17 %',
                numberOfItems: 1,
              } as BarChartData,
              {
                name: 'GPSD02',
                gpm: '17 %',
                value: 100,
                share: '17 %',
                numberOfItems: 1,
              } as BarChartData,
            ],
          })
        );

        m.expect(component.plBarChartData$).toBeObservable(
          m.cold('a', {
            a: [
              {
                name: 'PL 01',
                gpm: '17 %',
                value: 100,
                share: '17 %',
                numberOfItems: 2,
              } as BarChartData,
            ],
          })
        );
      })
    );
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
