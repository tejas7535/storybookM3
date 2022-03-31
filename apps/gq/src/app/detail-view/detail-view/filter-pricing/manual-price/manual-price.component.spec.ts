import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { ColumnFields } from '../../../../shared/ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../../shared/components/editing-modal/editing-modal.component';
import {
  PriceSource,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { HelperService } from '../../../../shared/services/helper-service/helper-service.service';
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
      MatFormFieldModule,
      MatInputModule,
      ReactiveComponentModule,
      ReactiveFormsModule,
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
      component.quotationDetail = { price: 10 } as any;
      component.setGpi = jest.fn();
      component.setPrice = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.manualPriceFormControl).toBeDefined();
      expect(component.setGpi).toHaveBeenCalledTimes(1);
      expect(component.setPrice).toHaveBeenCalledTimes(1);
    });
  });
  describe('addSubscriptions', () => {
    test('should add subscription', () => {
      component.manualPriceFormControl = new FormControl(10);
      component['subscription'].add = jest.fn();

      component.addSubscriptions();

      expect(component['subscription'].add).toHaveBeenCalledTimes(1);
    });
    test('should trigger subscription', () => {
      component.manualPriceFormControl = new FormControl(10);
      component.setGpi = jest.fn();
      component.setGpm = jest.fn();
      component.addSubscriptions();

      component.manualPriceFormControl.setValue(1);

      expect(component.setGpi).toHaveBeenCalledTimes(1);
      expect(component.setGpm).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component['subscription'].unsubscribe = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.setGpi = jest.fn();
      component.setGpm = jest.fn();
      component.setPrice = jest.fn();
    });
    test('should not set margins', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges();

      expect(component.setPrice).toHaveBeenCalledTimes(1);
      expect(component.setGpi).toHaveBeenCalledTimes(0);
      expect(component.setGpm).toHaveBeenCalledTimes(0);
    });
    test('should  set gpi', () => {
      component.manualPriceFormControl = { setValue: jest.fn() } as any;
      component.price = 10;
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges();

      expect(component.setPrice).toHaveBeenCalledTimes(1);
      expect(component.setGpi).toHaveBeenCalledTimes(1);
      expect(component.setGpm).toHaveBeenCalledTimes(1);
      expect(component.manualPriceFormControl.setValue).toHaveBeenCalledTimes(
        1
      );
      expect(component.manualPriceFormControl.setValue).toHaveBeenCalledWith(
        '10'
      );
    });
  });
  describe('selectPrice', () => {
    test('should emit Output EventEmitter', () => {
      component.editMode = true;
      component.selectManualPrice.emit = jest.fn();
      component.manualPriceFormControl = { value: 100 } as any;

      component.selectPrice();

      const expected = new UpdatePrice(100, PriceSource.MANUAL);
      expect(component.editMode).toBeFalsy();
      expect(component.selectManualPrice.emit).toHaveBeenCalledWith(expected);
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

  describe('onKeyPress', () => {
    test('should call HelperService', () => {
      HelperService.validateNumberInputKeyPress = jest.fn();

      component.onKeyPress({} as any, {} as any);

      expect(HelperService.validateNumberInputKeyPress).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('onPaste', () => {
    test('should set price', () => {
      HelperService.validateNumberInputPaste = jest.fn();

      component.onPaste({} as any);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledTimes(1);
    });
  });

  describe('setGpi', () => {
    test('should set gpi', () => {
      component.gpi = undefined;
      component.manualPriceFormControl = { value: 10 } as any;
      component.quotationDetail = { gpc: 10 } as any;

      component.setGpi();

      expect(component.gpi).toBeDefined();
    });
  });
  describe('setGpm', () => {
    test('should set gpm', () => {
      component.gpm = undefined;
      component.manualPriceFormControl = { value: 10 } as any;
      component.quotationDetail = { sqv: 10 } as any;

      component.setGpm();

      expect(component.gpm).toBeDefined();
    });
  });
  describe('setPrice', () => {
    test('should reset manual price, if user selects gq or sap price', () => {
      component.quotationDetail = {
        price: 10,
        recommendedPrice: 20,
        priceSource: PriceSource.SAP_SPECIAL,
      } as any;

      component.setPrice();

      expect(component.price).toEqual(undefined);
    });
    test('should set price to quotationDetail price', () => {
      const price = 20;
      component.quotationDetail = {
        price,
        recommendedPrice: 20,
        priceSource: PriceSource.MANUAL,
      } as any;

      component.setPrice();

      expect(component.price).toBe(price);
    });
  });
  describe('openEditing', () => {
    test('should enable editMode', () => {
      component.editMode = false;

      component.openEditing();

      expect(component.editMode).toBeTruthy();
    });
  });

  describe('openMarginEditing', () => {
    test('should open editing modal for gpi', () => {
      component['quotationDetail'] = QUOTATION_DETAIL_MOCK;
      component.openMarginEditing(true);

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingModalComponent,
        {
          data: {
            quotationDetail: QUOTATION_DETAIL_MOCK,
            field: ColumnFields.GPI,
          },
          disableClose: true,
          width: '684px',
        }
      );
    });
    test('should open editing modal for gpm', () => {
      component['quotationDetail'] = QUOTATION_DETAIL_MOCK;
      component.openMarginEditing(false);

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingModalComponent,
        {
          data: {
            quotationDetail: QUOTATION_DETAIL_MOCK,
            field: ColumnFields.GPM,
          },
          disableClose: true,
          width: '684px',
        }
      );
    });
  });
});
