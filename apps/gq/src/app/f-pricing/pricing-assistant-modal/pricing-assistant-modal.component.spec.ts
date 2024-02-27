import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { QuotationDetail } from '@gq/shared/models';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialDetailsComponent } from './material-details/material-details.component';
import { OverlayToShow } from './models/overlay-to-show.enum';
import { PricingAssistantModalComponent } from './pricing-assistant-modal.component';

describe('PricingAssistant.modalComponent', () => {
  let component: PricingAssistantModalComponent;
  let spectator: Spectator<PricingAssistantModalComponent>;

  const createComponent = createComponentFactory({
    component: PricingAssistantModalComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    declarations: [MockPipe(NumberCurrencyPipe)],
    providers: [
      MockProvider(FPricingFacade),
      MockProvider(MatDialog),
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { attachments: [] },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call the facades method', () => {
      component['fPricingFacade'].loadDataForPricingAssistant = jest.fn();
      component.ngOnInit();
      expect(
        component['fPricingFacade'].loadDataForPricingAssistant
      ).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component['dialogRef'].close = jest.fn();
      component['fPricingFacade'].resetDataForPricingAssistant = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalled();
      expect(
        component['fPricingFacade'].resetDataForPricingAssistant
      ).toHaveBeenCalled();
    });
  });

  describe('showMore', () => {
    test('should open a dialog', () => {
      component.dialogData = { gqPositionId: '12345' } as QuotationDetail;
      component['dialog'].open = jest.fn();
      component.showMore();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        MaterialDetailsComponent,
        {
          width: '792px',
          data: component.dialogData,
          autoFocus: false,
        }
      );
    });
  });

  describe('manualPriceClicked', () => {
    test('should set visibleOverlay to manualPricing', () => {
      component.visibleOverlay = OverlayToShow.gqPricing;
      component.manualPriceClicked();
      expect(component.visibleOverlay).toBe('manualPricing');
    });
  });

  describe('onComparedMaterialClicked', () => {
    test('should set visibleOverlay to comparisonScreen', () => {
      component.visibleOverlay = OverlayToShow.gqPricing;
      component.onComparedMaterialClicked('material');
      expect(component.visibleOverlay).toBe('comparisonScreen');
    });
  });

  describe('closeOverlay', () => {
    test('should set visibleOverlay to gqPricing', () => {
      component.visibleOverlay = OverlayToShow.comparisonScreen;
      component.closeOverlay();
      expect(component.visibleOverlay).toBe('gqPricing');
    });
  });
});
