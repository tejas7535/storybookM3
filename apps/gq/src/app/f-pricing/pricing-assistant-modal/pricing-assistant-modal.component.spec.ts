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
import { ProductType, QuotationDetail } from '@gq/shared/models';
import { MaterialToCompare } from '@gq/shared/models/f-pricing/material-to-compare.interface';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MATERIAL_DETAILS_MOCK } from '../../../testing/mocks';
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
    fPricingDataCompleteMock.next({
      quotationIsActive: true,
    } as FPricingPositionData);
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

      fPricingDataCompleteMock.next({
        quotationIsActive: false,
      } as FPricingPositionData);
      expect(component.comment.disabled).toBe(true);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should subscribe to comment value changes', () => {
      fPricingDataCompleteMock.next({
        quotationIsActive: true,
      } as FPricingPositionData);

      const commentValue = 'New comment';
      const dialogData = { priceComment: 'Old comment' } as QuotationDetail;
      component.dialogData = dialogData;

      component.ngAfterViewInit();
      component.comment.setValue(commentValue);

      expect(component.commentValidAndChanged).toBe(true);
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

  describe('backToGqPricingPage', () => {
    test('should set visibleOverlay to gqPricing', () => {
      component.visibleOverlay = OverlayToShow.comparisonScreen;
      component.backToGqPricingPage();
      expect(component.visibleOverlay).toBe('gqPricing');
    });
  });
  describe('confirmGqPrice', () => {
    test('should call the facades method', () => {
      component.dialogData = { gqPositionId: '12345' } as QuotationDetail;
      component['fPricingFacade'].updateFPricingData = jest.fn();
      component['fPricingFacade'].updatePriceSuccess$ = of();

      component.confirmGqPrice();

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
        updatePriceSuccess$: of(true),
      } as unknown as FPricingFacade;

      Object.defineProperty(component, 'fPricingFacade', {
        value: facadeMock,
      });

      component.confirmGqPrice();

      expect(closeDialogSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('confirmManualPrice', () => {
    test('should call the facades method', () => {
      component.dialogData = {
        gqPositionId: '12345',
        priceComment: 'test Comment',
      } as QuotationDetail;
      component['fPricingFacade'].updateManualPrice = jest.fn();
      component['fPricingFacade'].updatePriceSuccess$ = of();
      component.comment.setValue('test Comment');

      component.confirmManualPrice();

      expect(
        component['fPricingFacade'].updateManualPrice
      ).toHaveBeenCalledWith('12345', 'test Comment');
    });

    test('should close the dialog after update manual price success', () => {
      jest.resetAllMocks();
      const closeDialogSpy = jest.spyOn(component, 'closeDialog');
      closeDialogSpy.mockImplementation();

      const facadeMock: FPricingFacade = {
        updateManualPrice: jest.fn(),
        updatePriceSuccess$: of(true),
      } as unknown as FPricingFacade;

      Object.defineProperty(component, 'fPricingFacade', {
        value: facadeMock,
      });

      component.confirmManualPrice();

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
    test('should update the manualPriceToDisplay and manualPriceGPMToDisplay', () => {
      component.manualPriceToDisplay = 1;
      component.manualPriceGPMToDisplay = 1;
      component.manualPriceChanged([
        { key: 'price', value: 100 },
        { key: 'gpm', value: 15 },
      ]);
      expect(component.manualPriceToDisplay).toBe(100);
      expect(component.manualPriceGPMToDisplay).toBe(15);
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

  describe('manualPriceButtonDisabled', () => {
    test('should set manualPriceConfirmButtonDisabled to false', () => {
      component.manualPriceInputInvalidOrUnchanged = null;
      component.manualPriceInvalidOrUnchangedHandled(false);
      expect(component.manualPriceInputInvalidOrUnchanged).toBe(false);
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
      component['fPricingFacade'].loadDataForComparisonScreen = jest.fn();
      component.visibleOverlay = OverlayToShow.gqPricing;
      const material = MATERIAL_DETAILS_MOCK;
      material.productType = ProductType.CRB;
      component.material = material;
      const materialToCompare: MaterialToCompare = {
        description: 'materialDescription',
        number: 'materialNumber',
      };
      component.onComparedMaterialClicked(materialToCompare);
      expect(component.visibleOverlay).toBe('comparisonScreen');
      expect(
        component['fPricingFacade'].loadDataForComparisonScreen
      ).toHaveBeenCalled();
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
    test('should set gqPricingConfirmButtonDisabled to false', () => {
      component.gqPricingConfirmButtonDisabled = true;
      component.mvdTabClicked();
      expect(component.gqPricingConfirmButtonDisabled).toBe(false);
    });
  });

  describe('logic for ManualPrice Confirm Button', () => {
    /** from html file
   * manualPriceConfirmButtonDisabled.invalid ||
          (manualPriceConfirmButtonDisabled.invalidOrUnchanged &&
            !commentValidAndChanged)
   */

    test('disable Button, when comment not set and price not changed', () => {
      const manualPriceConfirmButtonDisabled = {
        invalid: false,
        invalidOrUnchanged: true,
        unchanged: true,
      };
      const result = checkHtmlManualPriceButtonLogic(
        manualPriceConfirmButtonDisabled,
        false
      );
      expect(result).toBe(true);
    });
    test('enable button, when comment not set and price changed', () => {
      const manualPriceConfirmButtonDisabled = {
        invalid: false,
        invalidOrUnchanged: false,
        unchanged: false,
      };
      const result = checkHtmlManualPriceButtonLogic(
        manualPriceConfirmButtonDisabled,
        false
      );
      expect(result).toBe(false);
    });
    test('should enable button when comment is set and price not changed', () => {
      const manualPriceConfirmButtonDisabled = {
        invalid: false,
        invalidOrUnchanged: true,
        unchanged: true,
      };
      const result = checkHtmlManualPriceButtonLogic(
        manualPriceConfirmButtonDisabled,
        true
      );
      expect(result).toBe(false);
    });
    test('should enable button when comment is set and price changed', () => {
      const manualPriceConfirmButtonDisabled = {
        invalid: false,
        invalidOrUnchanged: false,
        unchanged: false,
      };
      const result = checkHtmlManualPriceButtonLogic(
        manualPriceConfirmButtonDisabled,
        true
      );
      expect(result).toBe(false);
    });
    test('should disable button, when comment is set but manualPrice FormControl is invalid', () => {
      const manualPriceConfirmButtonDisabled = {
        invalid: true,
        invalidOrUnchanged: true,
        unchanged: false,
      };
      const result = checkHtmlManualPriceButtonLogic(
        manualPriceConfirmButtonDisabled,
        true
      );
      expect(result).toBe(true);
    });
  });
});

function checkHtmlManualPriceButtonLogic(
  manualPriceConfirmButtonDisabled: any,
  commentValidAndChanged: boolean
): boolean {
  return (
    manualPriceConfirmButtonDisabled.invalid ||
    (manualPriceConfirmButtonDisabled.invalidOrUnchanged &&
      !commentValidAndChanged)
  );
}
