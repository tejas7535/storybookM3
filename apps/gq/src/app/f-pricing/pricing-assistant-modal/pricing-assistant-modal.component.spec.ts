import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { BehaviorSubject, of } from 'rxjs';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { FPricingPositionData } from '@gq/core/store/f-pricing/models/f-pricing-position-data.interface';
import { EditingModal } from '@gq/shared/components/modal/editing-modal/models/editing-modal.model';
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
  const fPricingDataCompleteMock: BehaviorSubject<FPricingPositionData> =
    new BehaviorSubject({} as FPricingPositionData);

  const createComponent = createComponentFactory({
    component: PricingAssistantModalComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    declarations: [MockPipe(NumberCurrencyPipe)],
    providers: [
      MockProvider(FPricingFacade, {
        fPricingDataComplete$: fPricingDataCompleteMock.asObservable(),
      }),
      MockProvider(MatDialog),
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { quotationId: '123' },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    fPricingDataCompleteMock.next({} as FPricingPositionData);
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
          panelClass: 'show-more',
          autoFocus: false,
        }
      );
    });
  });

  describe('confirm', () => {
    test('should call the facades method', () => {
      component.dialogData = { gqPositionId: '12345' } as QuotationDetail;
      component['fPricingFacade'].updateFPricingData = jest.fn();
      component['fPricingFacade'].updateFPricingDataSuccess$ = of();

      component.confirm();

      expect(
        component['fPricingFacade'].updateFPricingData
      ).toHaveBeenCalledWith('12345');
    });

    test('should close the dialog', () => {
      jest.resetAllMocks();
      const closeDialogSpy = jest.spyOn(component, 'closeDialog');
      closeDialogSpy.mockImplementation();

      const facadeMock: FPricingFacade = {
        updateFPricingData: jest.fn(),
        updateFPricingDataSuccess$: of(true),
      } as unknown as FPricingFacade;

      Object.defineProperty(component, 'fPricingFacade', {
        value: facadeMock,
      });

      component.confirm();

      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('manualPriceClicked', () => {
    test('should set visibleOverlay to manualPricing', () => {
      component.visibleOverlay = OverlayToShow.gqPricing;
      component.manualPriceClicked();
      expect(component.visibleOverlay).toBe('manualPricing');
    });
    test('should call the facades method', () => {
      component['fPricingFacade'].changePrice = jest.fn();
      component.manualPriceClicked();
      expect(component['fPricingFacade'].changePrice).toHaveBeenCalled();
    });
  });

  describe('manualPriceChanged', () => {
    test('should update the manualPriceData', () => {
      component.manualPriceData = {
        quotationDetail: {
          price: 1,
          gpm: 1,
        } as QuotationDetail,
      } as EditingModal;
      component.manualPriceChanged([
        { key: 'price', value: 100 },
        { key: 'gpm', value: 15 },
      ]);
      expect(component.manualPriceData.quotationDetail.price).toBe(100);
      expect(component.manualPriceData.quotationDetail.gpm).toBe(15);
    });

    test('should call the facades method', () => {
      component['fPricingFacade'].changePrice = jest.fn();
      component.manualPriceChanged([
        { key: 'price', value: 100 },
        { key: 'gpm', value: 15 },
      ]);
      expect(component['fPricingFacade'].changePrice).toHaveBeenCalled();
    });
  });
  describe('gqPriceClicked', () => {
    test('should set visibleOverlay to gqPricing', () => {
      component.visibleOverlay = OverlayToShow.manualPricing;
      component.gqPriceClicked();
      expect(component.visibleOverlay).toBe('gqPricing');
    });

    test('should call the facades method', () => {
      component['fPricingFacade'].changePrice = jest.fn();
      component.gqPriceClicked();
      expect(component['fPricingFacade'].changePrice).toHaveBeenCalled();
    });

    test('Should show add manual price button', () => {
      component.manualPriceData = {
        quotationDetail: {
          price: 0,
          gpm: 0,
        } as QuotationDetail,
      } as EditingModal;
      component.gqPriceClicked();
      expect(component.showAddManualPriceButton).toBe(true);
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

  describe('mvdTabClicked', () => {
    test('should set mvdTabActivated to true', () => {
      component.mvdTabActivated = false;
      component.mvdTabClicked();
      expect(component.mvdTabActivated).toBe(true);
    });
  });
  describe('getInitialPriceValue', () => {
    test('should return value from TargetPrice', () => {
      component.dialogData = {
        priceSource: 'TARGET_PRICE',
        targetPrice: 100,
        price: 200,
      } as QuotationDetail;
      const result = component['getInitialPriceValue']();
      expect(result).toBe(100);
    });

    test('should return price value from manuelPrice', () => {
      component.dialogData = {
        priceSource: 'MANUAL',
        targetPrice: 100,
        price: 200,
      } as QuotationDetail;
      const result = component['getInitialPriceValue']();
      expect(result).toBe(200);
    });
  });
});
