import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { KeyName } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { LoadingSpinnerModule } from '../../../../shared/loading-spinner/loading-spinner.module';
import {
  PriceSource,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { FilterPricingCardComponent } from '../filter-pricing-card/filter-pricing-card.component';
import { ManualPriceComponent } from './manual-price.component';

describe('ManualPriceComponent', () => {
  let component: ManualPriceComponent;
  let spectator: Spectator<ManualPriceComponent>;

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
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [provideMockStore({})],
    declarations: [ManualPriceComponent, FilterPricingCardComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
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
      component.addSubscriptions();

      component.manualPriceFormControl.setValue(1);

      expect(component.setGpi).toHaveBeenCalledTimes(1);
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
      component.setPrice = jest.fn();
    });
    test('should not set gpi', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges();

      expect(component.setPrice).toHaveBeenCalledTimes(1);
      expect(component.setGpi).toHaveBeenCalledTimes(0);
    });
    test('should  set gpi', () => {
      component.manualPriceFormControl = { setValue: jest.fn() } as any;
      component.price = 10;
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges();

      expect(component.setPrice).toHaveBeenCalledTimes(1);
      expect(component.setGpi).toHaveBeenCalledTimes(1);
      expect(component.manualPriceFormControl.setValue).toHaveBeenCalledTimes(
        1
      );
      expect(component.manualPriceFormControl.setValue).toHaveBeenCalledWith(
        10
      );
    });
  });
  describe('selectPrice', () => {
    test('should emit Output EventEmitter', () => {
      component.editMode = true;
      component.selectManualPrice.emit = jest.fn();
      component.quotationDetail = { material: { priceUnit: 11 } } as any;
      component.manualPriceFormControl = { value: 100 } as any;

      component.selectPrice();

      const expected = new UpdatePrice(9.09, PriceSource.MANUAL);
      expect(component.editMode).toBeFalsy();
      expect(component.selectManualPrice.emit).toHaveBeenCalledWith(expected);
    });
  });

  describe('set isLoading', () => {
    test('should set isLoading', () => {
      component._isLoading = false;

      component.isLoading = true;

      expect(component.isLoading).toEqual(false);
    });
    test('should set isLoading', () => {
      component._isLoading = true;

      component.isLoading = true;

      expect(component.isLoading).toEqual(true);
    });
  });

  describe('onKeyPress', () => {
    test('should prevent Default', () => {
      const event = { key: 0, preventDefault: jest.fn() } as any;
      const manualPriceInput = { value: 20.022 };

      component.onKeyPress(event, manualPriceInput);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
    test('should prevent Default', () => {
      const event = { key: 0, preventDefault: jest.fn() } as any;
      const manualPriceInput = { value: 20 };

      component.onKeyPress(event, manualPriceInput);

      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });

    test('should not prevent Default', () => {
      const event = { key: KeyName.DELETE, preventDefault: jest.fn() } as any;
      const manualPriceInput = { value: 20.022 };

      component.onKeyPress(event, manualPriceInput);

      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
  });

  describe('onPaste', () => {
    test('should set price', () => {
      const event = {
        clipboardData: {
          getData: jest.fn(() => 20.022),
        },
        preventDefault: jest.fn(),
      } as any;
      component.manualPriceFormControl = { setValue: jest.fn() } as any;

      component.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(component.manualPriceFormControl.setValue).toHaveBeenCalledTimes(
        1
      );
      expect(component.manualPriceFormControl.setValue).toHaveBeenCalledWith(
        20.02
      );
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
  describe('setPrice', () => {
    test('should set price', () => {
      component.quotationDetail = { price: 10, recommendedPrice: 20 } as any;

      component.setPrice();

      expect(component.price).toEqual(10);
    });
    test('should set price to undefined', () => {
      component.quotationDetail = { price: 20, recommendedPrice: 20 } as any;

      component.setPrice();

      expect(component.price).toBeUndefined();
    });
  });
  describe('openEditing', () => {
    test('should enable editMode', () => {
      component.editMode = false;

      component.openEditing();

      expect(component.editMode).toBeTruthy();
    });
  });
});
