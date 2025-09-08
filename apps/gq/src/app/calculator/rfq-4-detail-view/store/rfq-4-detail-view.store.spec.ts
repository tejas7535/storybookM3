import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { ProductionPlantService } from '@gq/calculator/rfq-4-detail-view/service/rest/production-plant.service';
import { ActiveDirectoryUser } from '@gq/shared/models';
import { CurrencyService } from '@gq/shared/services/rest/currency/currency.service';
import { MicrosoftGraphMapperService } from '@gq/shared/services/rest/microsoft-graph-mapper/microsoft-graph-mapper.service';
import { translate } from '@jsverse/transloco';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { provideMockStore } from '@ngrx/store/testing';

import {
  CALCULATOR_QUOTATION_DATA_MOCK,
  CALCULATOR_QUOTATION_DETAIL_DATA_MOCK,
  CALCULATOR_RFQ_4_PROCESS_DATA_MOCK,
  CONFIRM_RFQ_RESPONSE_MOCK,
  RFQ_CALCULATOR_ATTACHMENTS_MOCK,
  RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK,
  RFQ_DETAIL_VIEW_DATA_MOCK,
  RFQ_PRODUCTION_PLANTS,
} from '../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { AccessibleByEnum } from '../models/accessibly-by.enum';
import { RecalculateSqvStatus } from '../models/recalculate-sqv-status.enum';
import {
  FileAccessUpdate,
  RfqCalculatorAttachment,
} from '../models/rfq-calculator-attachments.interface';
import { Rfq4AttachmentsService } from '../service/rest/rfq-4-attachments.service';
import { Rfq4DetailViewService } from '../service/rest/rfq-4-detail-view.service';
import { Rfq4DetailViewStore } from './rfq-4-detail-view.store';

describe('Rfq4DetailViewStore', () => {
  const rfq4DetailViewService = {
    getRfq4DetailViewData: jest
      .fn()
      .mockReturnValue(of(RFQ_DETAIL_VIEW_DATA_MOCK)),
    assignRfq: jest.fn().mockReturnValue(
      of({
        ...CALCULATOR_RFQ_4_PROCESS_DATA_MOCK,
        assignedUserId: 'responseId',
        calculatorRequestRecalculationStatus: RecalculateSqvStatus.CONFIRMED,
      })
    ),
    saveRfq4CalculationData: jest
      .fn()
      .mockReturnValue(of(RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK)),
    confirmRfq4CalculationData: jest
      .fn()
      .mockReturnValue(of(CONFIRM_RFQ_RESPONSE_MOCK)),
  };
  const rfq4AttachmentsService = {
    getCalculatorAttachments: jest
      .fn()
      .mockReturnValue(of(RFQ_CALCULATOR_ATTACHMENTS_MOCK)),
    uploadCalculatorAttachments: jest
      .fn()
      .mockReturnValue(of(RFQ_CALCULATOR_ATTACHMENTS_MOCK)),
    downloadCalculatorAttachment: jest.fn(),
    deleteCalculatorAttachment: jest
      .fn()
      .mockReturnValue(of([] as RfqCalculatorAttachment[])),
    updateCalculatorAttachmentsAccess: jest
      .fn()
      .mockReturnValue(of(RFQ_CALCULATOR_ATTACHMENTS_MOCK)),
  };
  const aadUser: ActiveDirectoryUser = {
    firstName: 'firstName',
    lastName: 'lastName',
    userId: 'userId',
    mail: 'user@mail.com',
  };
  const microsoftGraphMapperService = {
    getActiveDirectoryUserByUserId: jest.fn().mockReturnValue(of(aadUser)),
  };
  const productionPlantService = {
    getProductionPlantsForRfq: jest.fn().mockReturnValue(
      of({
        results: RFQ_PRODUCTION_PLANTS,
        loading: false,
      })
    ),
  };
  const currencyService = {
    getExchangeRateForCurrency: jest.fn().mockReturnValue(
      of({
        EUR: 1.2,
      })
    ),
  };

  const routerRfqId = '5012';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Rfq4DetailViewStore,
        provideMockStore({
          initialState: {
            router: {
              state: {
                queryParams: { rfqId: routerRfqId },
                params: {},
              },
            },
          },
        }),
        { provide: Rfq4DetailViewService, useValue: rfq4DetailViewService },
        { provide: Rfq4AttachmentsService, useValue: rfq4AttachmentsService },
        {
          provide: MicrosoftGraphMapperService,
          useValue: microsoftGraphMapperService,
        },
        {
          provide: ProductionPlantService,
          useValue: productionPlantService,
        },
        {
          provide: CurrencyService,
          useValue: currencyService,
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
    });
  });

  test('should create', () => {
    const store = TestBed.inject(Rfq4DetailViewStore);
    expect(store).toBeTruthy();
  });

  describe('computed', () => {
    test('getQuotationData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });
      const quotation = store.getQuotationData();
      expect(quotation).toEqual(CALCULATOR_QUOTATION_DATA_MOCK);
    });
    test('getQuotationDetailData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });
      const quotationDetail = store.getQuotationDetailData();
      expect(quotationDetail).toEqual(CALCULATOR_QUOTATION_DETAIL_DATA_MOCK);
    });
    test('getRfq4ProcessData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });
      const rfq4ProcessData = store.getRfq4ProcessData();
      expect(rfq4ProcessData).toEqual(CALCULATOR_RFQ_4_PROCESS_DATA_MOCK);
    });
    test('getProductionPlants', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      patchState(unprotected(store), {
        productionPlantData: {
          productionPlants: RFQ_PRODUCTION_PLANTS,
          loading: false,
        },
      });

      const productionPlants = store.getProductionPlants();
      expect(productionPlants).toEqual(RFQ_PRODUCTION_PLANTS);
    });

    test('getStartedByUserId', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });
      const startedByUserId = store.getStartedByUserId();
      expect(startedByUserId).toEqual(
        CALCULATOR_RFQ_4_PROCESS_DATA_MOCK.startedByUserId
      );
    });
    test('getAssignedUserId', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });

      const assignedUserId = store.getAssignedUserId();
      expect(assignedUserId).toEqual(
        CALCULATOR_RFQ_4_PROCESS_DATA_MOCK.assignedUserId
      );
    });
    test('getConfirmedByUserId', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });

      const confirmedByUserId = store.getConfirmedByUserId();
      expect(confirmedByUserId).toEqual(
        CALCULATOR_RFQ_4_PROCESS_DATA_MOCK.confirmedByUserId
      );
    });
    test('getRecalculationStatus', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });

      const recalculationStatus = store.getRecalculationStatus();
      expect(recalculationStatus).toEqual(
        CALCULATOR_RFQ_4_PROCESS_DATA_MOCK.calculatorRequestRecalculationStatus
      );
    });
    test('getSelectedProdPlant', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });

      const productionPlant = store.getSelectedProdPlant();
      expect(productionPlant).toEqual(
        RFQ_DETAIL_VIEW_DATA_MOCK.rfq4RecalculationData.productionPlantNumber
      );
    });
    test('getSelectedProdPlant with process production plant', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        rfq4DetailViewData: {
          ...RFQ_DETAIL_VIEW_DATA_MOCK,
          rfq4RecalculationData: null,
        },
      });

      const productionPlant = store.getSelectedProdPlant();
      expect(productionPlant).toEqual(
        RFQ_DETAIL_VIEW_DATA_MOCK.rfq4ProcessData.processProductionPlant
      );
    });
    test('isCalculationDataInvalid', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        rfq4RecalculationDataStatus: 'INVALID',
      });

      const isCalculationDataInvalid = store.isCalculationDataInvalid();
      expect(isCalculationDataInvalid).toBeTruthy();
    });
    test('getProductStructureUrl', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        rfq4DetailViewData: {
          ...RFQ_DETAIL_VIEW_DATA_MOCK,
          quotationDetailData: {
            ...RFQ_DETAIL_VIEW_DATA_MOCK.quotationDetailData,
            materialData: {
              ...RFQ_DETAIL_VIEW_DATA_MOCK.quotationDetailData.materialData,
              productStructureUrl: 'url',
            },
          },
        },
      });

      const productStructureUrl = store.getProductStructureUrl();
      expect(productStructureUrl).toEqual('url');
    });
    test('isLoggedUserAssignedToRfq', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
        loggedUserId: RFQ_DETAIL_VIEW_DATA_MOCK.rfq4ProcessData.assignedUserId,
      });

      const isAssigned = store.isLoggedUserAssignedToRfq();
      expect(isAssigned).toBeTruthy();
    });

    test('isAttachmentUploadSuccess', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        attachmentsLoading: false,
        attachments: [{} as any],
      });

      const isSuccess = store.isAttachmentUploadSuccess();
      expect(isSuccess).toBeTruthy();
    });

    test('isAttachmentDeleteSuccess', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        attachmentsDeleting: false,
        attachments: [{} as any],
      });

      const isSuccess = store.isAttachmentDeleteSuccess();
      expect(isSuccess).toBeTruthy();
    });
  });

  describe('methods', () => {
    test('loadRfq4DetailViewData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const rfqId = '123';

      store.loadRfq4DetailViewData(rfqId);
      expect(rfq4DetailViewService.getRfq4DetailViewData).toHaveBeenCalledWith(
        rfqId
      );
      expect(store.rfq4DetailViewDataLoading()).toBeFalsy();
      expect(store.rfq4DetailViewData()).toEqual(RFQ_DETAIL_VIEW_DATA_MOCK);
    });
    test('loadRfq4DetailViewData should open snackbar when status is cancelled', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const rfqId = '123';

      rfq4DetailViewService.getRfq4DetailViewData = jest.fn().mockReturnValue(
        of({
          ...RFQ_DETAIL_VIEW_DATA_MOCK,
          rfq4ProcessData: {
            ...RFQ_DETAIL_VIEW_DATA_MOCK.rfq4ProcessData,
            calculatorRequestRecalculationStatus:
              RecalculateSqvStatus.CANCELLED,
          },
        })
      );

      store.loadRfq4DetailViewData(rfqId);
      expect(store.snackBar.open).toHaveBeenCalled();
    });

    test('loadAdUser for processStartedByUser', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const userId = 'userId';

      store.loadProcessStartedByAdUser({
        userId,
      });

      expect(
        microsoftGraphMapperService.getActiveDirectoryUserByUserId
      ).toHaveBeenCalledWith(userId);
      expect(store.processStartedByAdUserLoading()).toBeFalsy();
      expect(store.processStartedByAdUser()).toEqual(aadUser);
    });
    test('loadProductionPlants', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      store.loadProductionPlants();

      expect(
        productionPlantService.getProductionPlantsForRfq
      ).toHaveBeenCalled();
      expect(store.productionPlantData().loading).toBeFalsy();
      expect(store.productionPlantData().productionPlants).toEqual(
        RFQ_PRODUCTION_PLANTS
      );
    });
    test('loadAdUser for processAssignedToAdUser', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const userId = 'userId';

      store.loadProcessAssignedToAdUser({
        userId,
      });

      expect(
        microsoftGraphMapperService.getActiveDirectoryUserByUserId
      ).toHaveBeenCalledWith(userId);
      expect(store.processAssignedToAdUserLoading()).toBeFalsy();
      expect(store.processAssignedToAdUser()).toEqual(aadUser);
    });
    test('loadRfqConfirmedByAdUser', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const userId = 'userId';

      store.loadRfqConfirmedByAdUser({
        userId,
      });

      expect(
        microsoftGraphMapperService.getActiveDirectoryUserByUserId
      ).toHaveBeenCalledWith(userId);
      expect(store.processConfirmedByAdUserLoading()).toBeFalsy();
      expect(store.processConfirmedByAdUser()).toEqual(aadUser);
    });
    test('assignRfq', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });

      store.assignRfq();

      expect(rfq4DetailViewService.assignRfq).toHaveBeenCalledWith(
        RFQ_DETAIL_VIEW_DATA_MOCK.rfq4ProcessData.rfqId
      );
      expect(store.rfq4DetailViewDataLoading()).toBeFalsy();
      expect(store.rfq4DetailViewData().rfq4ProcessData.assignedUserId).toEqual(
        'responseId'
      );
      expect(
        store.rfq4DetailViewData().rfq4ProcessData
          .calculatorRequestRecalculationStatus
      ).toEqual(RecalculateSqvStatus.CONFIRMED);
      expect(store.snackBar.open).toHaveBeenCalled();
      expect(translate).toHaveBeenCalledWith(
        'calculator.rfq4DetailView.snackBarMessages.assignRfq'
      );
    });
    test('saveRfq4DetailViewCalculationData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      store.saveRfq4DetailViewCalculationData(
        RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK
      );

      expect(rfq4DetailViewService.saveRfq4CalculationData).toHaveBeenCalled();
      expect(store.rfq4DetailViewDataLoading()).toBeFalsy();
      expect(store.rfq4DetailViewData().rfq4RecalculationData).toEqual(
        RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK
      );
    });
    test('setCalculationDataStatus', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      store.setCalculationDataStatus('VALID');

      expect(store.rfq4RecalculationDataStatus()).toEqual('VALID');
    });
    test('triggerConfirmRecalculation', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      store.triggerConfirmRecalculation();

      expect(store.confirmRecalculationTriggered()).toEqual(true);
    });
    test('confirmRfq4DetailViewCalculationData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      store.confirmRfq4DetailViewCalculationData(
        RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK
      );

      expect(
        rfq4DetailViewService.confirmRfq4CalculationData
      ).toHaveBeenCalled();
      expect(store.rfq4DetailViewDataLoading()).toBeFalsy();
      expect(store.rfq4DetailViewData().rfq4RecalculationData).toEqual(
        RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK
      );
    });
    test('getExchangeRateForSelectedCurrency - currency service is not called', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      store.getExchangeRateForSelectedCurrency('USD');
      expect(currencyService.getExchangeRateForCurrency).not.toHaveBeenCalled();
    });
    test('getExchangeRateForSelectedCurrency', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      store.getExchangeRateForSelectedCurrency('EUR');
      expect(currencyService.getExchangeRateForCurrency).toHaveBeenCalled();
      expect(store.exchangeRateForSelectedCurrency).not.toBeNull();
      expect(store.exchangeRateForSelectedCurrencyLoading()).toBeFalsy();
    });
    test('setLoggedUser', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const userId = 'userId';

      store.setLoggedUser(userId);

      expect(store.loggedUserId()).toEqual(userId);
    });

    test('getCalculatorAttachments', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const rfqId = 123;

      store.getCalculatorAttachments(rfqId);

      expect(
        rfq4AttachmentsService.getCalculatorAttachments
      ).toHaveBeenCalledWith(rfqId);
      expect(store.attachmentsLoading()).toBeFalsy();
      expect(store.attachments()).toEqual(RFQ_CALCULATOR_ATTACHMENTS_MOCK);
    });

    test('uploadCalculatorAttachments', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const files: File[] = [new File([''], 'test.txt')];
      const rfqId = 12_345;

      store.uploadCalculatorAttachments(files);

      expect(
        rfq4AttachmentsService.uploadCalculatorAttachments
      ).toHaveBeenCalledWith(files, rfqId);
      expect(store.attachmentsLoading()).toBeFalsy();
      expect(store.attachments()).toEqual(RFQ_CALCULATOR_ATTACHMENTS_MOCK);
    });
    test('downloadCalculatorAttachment', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const attachment = RFQ_CALCULATOR_ATTACHMENTS_MOCK[0];

      store.downloadCalculatorAttachment(attachment);

      expect(
        rfq4AttachmentsService.downloadCalculatorAttachment
      ).toHaveBeenCalledWith(attachment);
    });
    test('deleteCalculatorAttachment', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const attachment: RfqCalculatorAttachment = {} as RfqCalculatorAttachment;

      store.deleteCalculatorAttachment(attachment);
      expect(
        rfq4AttachmentsService.deleteCalculatorAttachment
      ).toHaveBeenCalledWith(attachment);
      expect(store.attachmentsDeleting()).toBeFalsy();
      expect(store.attachments()).toEqual([]);
    });
    test('switchAttachmentAccess', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        attachments: RFQ_CALCULATOR_ATTACHMENTS_MOCK,
      });
      const fileToUpdate: FileAccessUpdate = {
        fileName: RFQ_CALCULATOR_ATTACHMENTS_MOCK[0].fileName,
        accessibleBy: AccessibleByEnum.CALCULATOR_SALES,
      };
      store.switchAttachmentAccess(fileToUpdate);

      expect(store.pendingAttachmentAccessUpdates()).toEqual([fileToUpdate]);
    });
    test('switchAttachmentAccess should filter files', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        attachments: RFQ_CALCULATOR_ATTACHMENTS_MOCK,
      });
      const fileToUpdate: FileAccessUpdate = {
        fileName: RFQ_CALCULATOR_ATTACHMENTS_MOCK[0].fileName,
        accessibleBy: RFQ_CALCULATOR_ATTACHMENTS_MOCK[0].accessibleBy,
      };
      store.switchAttachmentAccess(fileToUpdate);

      expect(store.pendingAttachmentAccessUpdates().length).toBe(0);
    });
    test('updateCalculatorAttachmentsAccess is not called when uploadAccessAttachments is empty', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
        pendingAttachmentAccessUpdates: [],
        attachmentsLoading: true,
      });

      store.updateCalculatorAttachmentsAccess();

      expect(
        rfq4AttachmentsService.updateCalculatorAttachmentsAccess
      ).not.toHaveBeenCalled();
      expect(store.attachments()).toEqual(RFQ_CALCULATOR_ATTACHMENTS_MOCK);
      expect(store.pendingAttachmentAccessUpdates().length).toBe(0);
      expect(store.attachmentsLoading()).toBeFalsy();
    });
    test('updateCalculatorAttachmentsAccess', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const rfqId = 12_345;
      const uploadAccessAttachments: FileAccessUpdate[] = [
        {
          fileName: 'test.txt',
          accessibleBy: AccessibleByEnum.CALCULATOR,
        },
      ];
      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
        pendingAttachmentAccessUpdates: uploadAccessAttachments,
        attachmentsLoading: true,
      });

      store.updateCalculatorAttachmentsAccess();

      expect(
        rfq4AttachmentsService.updateCalculatorAttachmentsAccess
      ).toHaveBeenCalledWith(rfqId, uploadAccessAttachments);
      expect(store.attachments()).toEqual(RFQ_CALCULATOR_ATTACHMENTS_MOCK);
      expect(store.pendingAttachmentAccessUpdates().length).toBe(0);
      expect(store.attachmentsLoading()).toBeFalsy();
    });
  });

  describe('hooks', () => {
    test('onInit calls getRfqDetailViewData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      TestBed.flushEffects();
      // Verify the rxMethod was triggered with the correct argument
      expect(rfq4DetailViewService.getRfq4DetailViewData).toHaveBeenCalledWith(
        routerRfqId
      );
      expect(store.rfq4DetailViewDataLoading()).toBeFalsy();
    });
    test('onInit calls loadProductionPlants', () => {
      TestBed.flushEffects();
      expect(
        productionPlantService.getProductionPlantsForRfq
      ).toHaveBeenCalled();
    });

    test('onInit calls getCalculatorAttachments', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      TestBed.flushEffects();
      // Verify the rxMethod was triggered with the correct argument
      expect(
        rfq4AttachmentsService.getCalculatorAttachments
      ).toHaveBeenCalledWith(routerRfqId);
      expect(store.rfq4DetailViewDataLoading()).toBeFalsy();
    });
  });
});
