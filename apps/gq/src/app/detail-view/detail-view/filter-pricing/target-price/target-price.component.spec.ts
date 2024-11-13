import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { By } from '@angular/platform-browser';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import { QuotationStatus } from '@gq/shared/models';
import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import { TargetPriceSourcePipe } from '@gq/shared/pipes/target-price-source/target-price-source.pipe';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  ACTIVE_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { TargetPriceComponent } from './target-price.component';

describe('TargetPriceComponent', () => {
  let component: TargetPriceComponent;
  let spectator: Spectator<TargetPriceComponent>;
  let fixture: ComponentFixture<TargetPriceComponent>;
  let editingModalServiceSpy: SpyObject<EditingModalService>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: TargetPriceComponent,
    detectChanges: false,
    imports: [
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
      TargetPriceSourcePipe,
    ],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    providers: [
      provideMockStore({
        initialState: {
          activeCase: {
            ...ACTIVE_CASE_STATE_MOCK,
          },
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      mockProvider(EditingModalService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    fixture = spectator.fixture;
    store = spectator.inject(MockStore);
    editingModalServiceSpy = spectator.inject(EditingModalService);
    component.quotationDetail = QUOTATION_DETAIL_MOCK;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should set quotationDetail, gpi and gpm', () => {
    const quotationDetail = {
      targetPrice: 10,
      gpc: 12,
      sqv: 20,
    } as unknown as QuotationDetail;

    jest.spyOn(pricingUtils, 'calculateMargin');

    component.quotationDetail = quotationDetail;

    expect(component.quotationDetail).toEqual(quotationDetail);
    expect(pricingUtils.calculateMargin).toHaveBeenCalledWith(
      quotationDetail.targetPrice,
      quotationDetail.gpc
    );
    expect(pricingUtils.calculateMargin).toHaveBeenCalledWith(
      quotationDetail.targetPrice,
      quotationDetail.sqv
    );
    expect(pricingUtils.calculateMargin).toHaveBeenCalledWith(
      quotationDetail.targetPrice,
      undefined
    );
    expect(pricingUtils.calculateMargin).toBeCalledTimes(3);
  });

  test('should set gpmRfq when RFQ data is present', () => {
    jest.resetAllMocks();
    const quotationDetail = {
      targetPrice: 10,
      gpc: 12,
      sqv: 20,
      rfqData: {
        sqv: 35,
      },
    } as unknown as QuotationDetail;

    jest.spyOn(pricingUtils, 'calculateMargin');

    component.quotationDetail = quotationDetail;

    expect(component.quotationDetail).toEqual(quotationDetail);
    expect(pricingUtils.calculateMargin).toHaveBeenCalledWith(
      quotationDetail.targetPrice,
      quotationDetail.gpc
    );
    expect(pricingUtils.calculateMargin).toHaveBeenCalledWith(
      quotationDetail.targetPrice,
      quotationDetail.sqv
    );
    expect(pricingUtils.calculateMargin).toHaveBeenCalledWith(
      quotationDetail.targetPrice,
      quotationDetail.rfqData.sqv
    );
    expect(pricingUtils.calculateMargin).toBeCalledTimes(3);
  });

  describe('set isLoading', () => {
    test('should set isLoading true', () => {
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
      component['_isLoading'] = true;
      spectator.setInput('isLoading', true);

      expect(component.isLoading).toBeTruthy();
    });

    test('should set isLoading false', () => {
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
      component['_isLoading'] = true;
      spectator.setInput('isLoading', false);

      expect(component.isLoading).toBeFalsy();
    });
  });

  test('should emit targetPriceSelected event with the correct target price', () => {
    component.targetPriceSelected.emit = jest.fn();
    component.selectTargetPrice();
    const expectedUpdatePrice = new UpdatePrice(
      QUOTATION_DETAIL_MOCK.targetPrice,
      PriceSource.TARGET_PRICE
    );

    expect(component.isLoading).toBeTruthy();
    expect(component.targetPriceSelected.emit).toHaveBeenCalledWith(
      expectedUpdatePrice
    );
  });

  test('should open target price editing modal', () => {
    component.openTargetPriceEditingModal();
    expect(editingModalServiceSpy.openEditingModal).toHaveBeenCalledWith({
      quotationDetail: QUOTATION_DETAIL_MOCK,
      field: ColumnFields.TARGET_PRICE,
    });
  });

  test('should show edit button if quotation is active', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('mat-icon'))).toBeTruthy();
  });

  test('should not show edit button if quotation is not active', () => {
    store.setState({
      activeCase: {
        ...ACTIVE_CASE_STATE_MOCK,
        quotation: {
          ...QUOTATION_MOCK,
          status: QuotationStatus.DELETED,
        },
      },
    });

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('mat-icon'))).toBeFalsy();
  });
});
