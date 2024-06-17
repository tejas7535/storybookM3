import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import { PriceSource } from '@gq/shared/models/quotation-detail';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { ManualPriceComponent } from './manual-price.component';

describe('ManualPriceComponent', () => {
  let component: ManualPriceComponent;
  let spectator: Spectator<ManualPriceComponent>;
  let editingModalServiceSpy: SpyObject<EditingModalService>;

  const createComponent = createComponentFactory({
    component: ManualPriceComponent,
    detectChanges: false,
    imports: [
      MatIconModule,
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      mockProvider(EditingModalService),
    ],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    editingModalServiceSpy = spectator.inject(EditingModalService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setPrice', () => {
    test('should reset manual price, if user selects gq or sap price', () => {
      component.quotationDetail = {
        price: 10,
        recommendedPrice: 20,
        gpi: 0.5,
        gpm: 0.6,
        gpmRfq: 0.7,
        priceSource: PriceSource.SAP_SPECIAL,
      } as any;

      component.setPrice();

      expect(component.price).toEqual(undefined);
      expect(component.gpi).toEqual(undefined);
      expect(component.gpm).toEqual(undefined);
      expect(component.gpmRfq).toEqual(undefined);
    });
    test('should set manual price kpis to quotationDetail values', () => {
      component.quotationDetail = {
        price: 20,
        recommendedPrice: 20,
        gpi: 0.5,
        gpm: 0.6,
        gpmRfq: 0.7,
        priceSource: PriceSource.MANUAL,
      } as any;

      component.setPrice();

      expect(component.price).toBe(20);
      expect(component.gpi).toBe(0.5);
      expect(component.gpm).toBe(0.6);
      expect(component.gpmRfq).toBe(0.7);
    });
  });

  describe('openEditing', () => {
    beforeEach(() => {
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
    });
    test('should open editing modal for gpi', () => {
      component.openEditing(ColumnFields.GPI);

      expect(editingModalServiceSpy.openEditingModal).toHaveBeenCalledWith({
        quotationDetail: QUOTATION_DETAIL_MOCK,
        field: ColumnFields.GPI,
      });
    });
    test('should open editing modal for gpm', () => {
      component.openEditing(ColumnFields.GPM);

      expect(editingModalServiceSpy.openEditingModal).toHaveBeenCalledWith({
        quotationDetail: QUOTATION_DETAIL_MOCK,
        field: ColumnFields.GPM,
      });
    });
    test('should open editing modal for price', () => {
      component.openEditing(ColumnFields.PRICE);

      expect(editingModalServiceSpy.openEditingModal).toHaveBeenCalledWith({
        quotationDetail: QUOTATION_DETAIL_MOCK,
        field: ColumnFields.PRICE,
      });
    });
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
});
