import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { ColumnFields } from '../../../../shared/ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../../shared/components/modal/editing-modal/editing-modal.component';
import { PriceSource } from '../../../../shared/models/quotation-detail';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { FilterPricingCardComponent } from '../filter-pricing-card/filter-pricing-card.component';
import { QuantityDisplayComponent } from '../quantity/quantity-display/quantity-display.component';
import { ManualPriceComponent } from './manual-price.component';

describe('ManualPriceComponent', () => {
  let component: ManualPriceComponent;
  let spectator: Spectator<ManualPriceComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: ManualPriceComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      LoadingSpinnerModule,
      MatIconModule,
      MatCardModule,
      PushModule,
      SharedPipesModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    declarations: [QuantityDisplayComponent, FilterPricingCardComponent],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    matDialogSpyObject = spectator.inject(MatDialog);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should create manualPriceFormControl', () => {
      component.setPrice = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();
      expect(component.setPrice).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges', () => {
    test('should set prices', () => {
      component.setPrice = jest.fn();

      component.ngOnChanges();

      expect(component.setPrice).toHaveBeenCalledTimes(1);
    });
  });

  describe('set isLoading', () => {
    test('should set isLoading false', () => {
      component._isLoading = false;

      component.isLoading = true;

      expect(component.isLoading).toEqual(false);
    });
    test('should set isLoading true', () => {
      component._isLoading = true;

      component.isLoading = true;

      expect(component.isLoading).toEqual(true);
    });
  });

  describe('setPrice', () => {
    test('should reset manual price, if user selects gq or sap price', () => {
      component.quotationDetail = {
        price: 10,
        recommendedPrice: 20,
        gpi: 0.5,
        gpm: 0.6,
        priceSource: PriceSource.SAP_SPECIAL,
      } as any;

      component.setPrice();

      expect(component.price).toEqual(undefined);
      expect(component.gpi).toEqual(undefined);
      expect(component.gpm).toEqual(undefined);
    });
    test('should set manual price kpis to quotationDetail values', () => {
      component.quotationDetail = {
        price: 20,
        recommendedPrice: 20,
        gpi: 0.5,
        gpm: 0.6,
        priceSource: PriceSource.MANUAL,
      } as any;

      component.setPrice();

      expect(component.price).toBe(20);
      expect(component.gpi).toBe(0.5);
      expect(component.gpm).toBe(0.6);
    });
  });

  describe('openEditing', () => {
    beforeEach(() => {
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
    });
    test('should open editing modal for gpi', () => {
      component.openEditing(ColumnFields.GPI);

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingModalComponent,
        {
          data: {
            quotationDetail: QUOTATION_DETAIL_MOCK,
            field: ColumnFields.GPI,
          },
          width: '684px',
        }
      );
    });
    test('should open editing modal for gpm', () => {
      component.openEditing(ColumnFields.GPM);

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingModalComponent,
        {
          data: {
            quotationDetail: QUOTATION_DETAIL_MOCK,
            field: ColumnFields.GPM,
          },
          width: '684px',
        }
      );
    });
    test('should open editing modal for price', () => {
      component.openEditing(ColumnFields.PRICE);

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingModalComponent,
        {
          data: {
            quotationDetail: QUOTATION_DETAIL_MOCK,
            field: ColumnFields.PRICE,
          },
          width: '684px',
        }
      );
    });
  });
});
