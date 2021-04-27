import { ReactiveFormsModule } from '@angular/forms';
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
  describe('selectPrice', () => {
    test('should emit Output EventEmitter', () => {
      component.selectManualPrice.emit = jest.fn();
      component.manualPriceFormControl = { value: 1 } as any;

      component.selectPrice();

      const expected = new UpdatePrice(1, PriceSource.MANUAL);
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

  describe('Input setter', () => {
    test('should set manualPricePermission', () => {
      component.manualPricePermission = true;
      expect(component.manualPriceFormControl).toBeDefined();
      expect(component.manualPriceFormControl.disabled).toBe(false);
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
});
