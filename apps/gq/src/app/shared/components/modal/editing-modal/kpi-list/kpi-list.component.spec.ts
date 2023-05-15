import { MatIconModule } from '@angular/material/icon';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { PRICE_VALIDITY_MARGIN_THRESHOLD } from '@gq/shared/constants';
import { HelperService } from '@gq/shared/services/helper/helper.service';
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  ACTIVE_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
} from '../../../../../../testing/mocks';
import { KpiValue } from '../models/kpi-value.model';
import { KpiListComponent } from './kpi-list.component';

describe('KpiListComponent', () => {
  let component: KpiListComponent;
  let spectator: Spectator<KpiListComponent>;
  let helperService: SpyObject<HelperService>;

  const createComponent = createComponentFactory({
    component: KpiListComponent,
    imports: [MatIconModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({
        initialState: {
          activeCase: {
            ...ACTIVE_CASE_STATE_MOCK,
            selectedQuotationDetail: '5694232',
          },
        },
      }),
      {
        provide: HelperService,
        useValue: {
          transformPercentage: jest
            .fn()
            .mockImplementation((value: number) => `${value} %`),
          transformMarginDetails: jest
            .fn()
            .mockImplementation(
              (value: number, currency: string) => `${value} ${currency}`
            ),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    helperService = spectator.inject(HelperService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should use the correct data formatter to display kpi', () => {
    test('should use percent formatter to display gpi', () => {
      const kpi = { key: ColumnFields.GPI, value: 125 } as KpiValue;

      component.editingModalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.kpis = [kpi];

      expect(helperService.transformPercentage).toBeCalledWith(kpi.value);
      expect(helperService.transformPercentage).toBeCalledWith(
        QUOTATION_DETAIL_MOCK.gpi
      );
      expect(component.displayedKpis).toEqual([
        {
          ...kpi,
          displayValue: `${kpi.value} %`,
          previousDisplayValue: `${QUOTATION_DETAIL_MOCK.gpi} %`,
          hasWarning: false,
          hasError: false,
          warningText: undefined,
        },
      ]);
    });

    test('should use percent formatter to display gpm', () => {
      const kpi = { key: ColumnFields.GPM, value: 75 } as KpiValue;

      component.editingModalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.kpis = [kpi];

      expect(helperService.transformPercentage).toBeCalledWith(kpi.value);
      expect(helperService.transformPercentage).toBeCalledWith(
        QUOTATION_DETAIL_MOCK.gpm
      );
      expect(component.displayedKpis).toEqual([
        {
          ...kpi,
          displayValue: `${kpi.value} %`,
          previousDisplayValue: `${QUOTATION_DETAIL_MOCK.gpm} %`,
          hasWarning: false,
          hasError: false,
          warningText: undefined,
        },
      ]);
    });

    test('should use percent formatter to display discount', () => {
      const kpi = { key: ColumnFields.DISCOUNT, value: 20 } as KpiValue;

      component.editingModalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.kpis = [kpi];

      expect(helperService.transformPercentage).toBeCalledWith(kpi.value);
      expect(helperService.transformPercentage).toBeCalledWith(
        QUOTATION_DETAIL_MOCK.discount
      );
      expect(component.displayedKpis).toEqual([
        {
          ...kpi,
          displayValue: `${kpi.value} %`,
          previousDisplayValue: `${QUOTATION_DETAIL_MOCK.discount} %`,
          hasWarning: false,
          hasError: false,
          warningText: undefined,
        },
      ]);
    });

    test('should use number currency formatter to display price', () => {
      const kpi = { key: ColumnFields.PRICE, value: 33 } as KpiValue;

      component.editingModalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.kpis = [kpi];

      expect(helperService.transformMarginDetails).toBeCalledWith(
        kpi.value,
        ACTIVE_CASE_STATE_MOCK.quotation.currency
      );
      expect(helperService.transformMarginDetails).toBeCalledWith(
        QUOTATION_DETAIL_MOCK.price,
        ACTIVE_CASE_STATE_MOCK.quotation.currency
      );
      expect(component.displayedKpis).toEqual([
        {
          ...kpi,
          displayValue: `${kpi.value} ${ACTIVE_CASE_STATE_MOCK.quotation.currency}`,
          previousDisplayValue: `${QUOTATION_DETAIL_MOCK.price} ${ACTIVE_CASE_STATE_MOCK.quotation.currency}`,
          hasWarning: false,
          hasError: false,
          warningText: undefined,
        },
      ]);
    });

    test('should use number currency formatter to display target price', () => {
      const kpi = { key: ColumnFields.TARGET_PRICE, value: 25.99 } as KpiValue;

      component.editingModalData = {
        field: ColumnFields.TARGET_PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.kpis = [kpi];

      expect(helperService.transformMarginDetails).toBeCalledWith(
        kpi.value,
        ACTIVE_CASE_STATE_MOCK.quotation.currency
      );
      expect(helperService.transformMarginDetails).toBeCalledWith(
        QUOTATION_DETAIL_MOCK.targetPrice,
        ACTIVE_CASE_STATE_MOCK.quotation.currency
      );
      expect(component.displayedKpis).toEqual([
        {
          ...kpi,
          displayValue: `${kpi.value} ${ACTIVE_CASE_STATE_MOCK.quotation.currency}`,
          previousDisplayValue: `${QUOTATION_DETAIL_MOCK.targetPrice} ${ACTIVE_CASE_STATE_MOCK.quotation.currency}`,
          hasWarning: false,
          hasError: false,
          warningText: undefined,
        },
      ]);
    });
  });

  describe('should display the correct warnings', () => {
    test('should display warning if gpi <= margin threshold', () => {
      const kpi = {
        key: ColumnFields.GPI,
        value: PRICE_VALIDITY_MARGIN_THRESHOLD - 5,
      } as KpiValue;

      component.editingModalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.kpis = [kpi];

      expect(translate).toHaveBeenCalledWith(
        'shared.validation.gpmOrGpiTooLow'
      );
      expect(component.displayedKpis).toEqual([
        {
          ...component.displayedKpis[0],
          hasWarning: true,
          hasError: false,
          warningText: 'translate it',
        },
      ]);
    });

    test('should display warning if gpm <= margin threshold', () => {
      const kpi = {
        key: ColumnFields.GPM,
        value: PRICE_VALIDITY_MARGIN_THRESHOLD,
      } as KpiValue;

      component.editingModalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.kpis = [kpi];

      expect(translate).toHaveBeenCalledWith(
        'shared.validation.gpmOrGpiTooLow'
      );
      expect(component.displayedKpis).toEqual([
        {
          ...component.displayedKpis[0],
          hasWarning: true,
          hasError: false,
          warningText: 'translate it',
        },
      ]);
    });

    test('should display warning if price < msp', () => {
      const kpi = {
        key: ColumnFields.PRICE,
        value: QUOTATION_DETAIL_MOCK.msp - 10,
      } as KpiValue;

      component.editingModalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.kpis = [kpi];

      expect(translate).toHaveBeenCalledWith(
        'shared.validation.priceLowerThanMsp'
      );
      expect(component.displayedKpis).toEqual([
        {
          ...component.displayedKpis[0],
          hasWarning: false,
          hasError: true,
          warningText: 'translate it',
        },
      ]);
    });
  });
});
