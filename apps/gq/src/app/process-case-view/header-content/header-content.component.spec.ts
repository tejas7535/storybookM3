import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { EditCaseModalComponent } from '@gq/shared/components/modal/edit-case-modal/edit-case-modal.component';
import { HideIfQuotationNotActiveDirective } from '@gq/shared/directives/hide-if-quotation-not-active/hide-if-quotation-not-active.directive';
import {
  Customer,
  Keyboard,
  PurchaseOrderType,
  QuotationStatus,
} from '@gq/shared/models';
import { OfferType } from '@gq/shared/models/offer-type.interface';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { PushPipe } from '@ngrx/component';
import { MockDirective } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { QUOTATION_MOCK } from '../../../testing/mocks/models/quotation.mock';
import { HeaderContentComponent } from './header-content.component';

describe('HeaderContentComponent', () => {
  let component: HeaderContentComponent;
  let spectator: Spectator<HeaderContentComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;
  let fakeTranslocoService: SpyObject<TranslocoService>;
  let transformationService: TransformationService;

  const createComponent = createComponentFactory({
    component: HeaderContentComponent,
    declarations: [MockDirective(HideIfQuotationNotActiveDirective)],
    imports: [
      MatIconModule,
      InfoIconModule,
      SharedPipesModule,
      PushPipe,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      {
        provide: TransformationService,
        useValue: {
          transformDate: jest.fn(),
        },
      },
    ],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    matDialogSpyObject = spectator.inject(MatDialog);
    matDialogSpyObject.open.andReturn({
      afterClosed: jest.fn(() => of(true)),
    });
    fakeTranslocoService = spectator.inject(TranslocoService);
    fakeTranslocoService.selectTranslate = jest
      .fn()
      .mockReturnValue(of('translated')) as any;
    component = spectator.debugElement.componentInstance;
    transformationService = spectator.inject(TransformationService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('case editing modal', () => {
    beforeEach(() => {
      component.updateQuotation.emit = jest.fn();
      component.showEditIcon = true;
    });
    test('Should pass purchaseOrderType and partnerRoleType and caseCustomer and offerType to Modal', () => {
      component.purchaseOrderType = {
        id: 'HBX',
        name: 'HBX Name Value',
      } as PurchaseOrderType;
      component.partnerRoleType = {
        id: '6000036',
        name: 'MRO Mining',
      } as SectorGpsd;
      component.customer = {
        identifier: { customerId: '123456', salesOrg: '0815' },
      } as Customer;

      component.offerType = { id: 1, name: 'offer type name' } as OfferType;
      component.openCaseEditingModal();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditCaseModalComponent,
        {
          width: '660px',
          position: {
            top: '50px',
          },
          panelClass: 'edit-case-modal',
          data: {
            caseName: undefined,
            bindingPeriodValidityEndDate: undefined,
            customerPurchaseOrderDate: undefined,
            enableSapFieldEditing: false,
            quotationToDate: undefined,
            requestedDeliveryDate: undefined,
            currency: undefined,
            salesOrg: undefined,
            shipToParty: {
              id: undefined,
              value: undefined,
              value2: undefined,
            },
            caseCustomer: {
              identifier: { customerId: '123456', salesOrg: '0815' },
            } as Customer,
            purchaseOrderType: {
              id: 'HBX',
              name: 'HBX Name Value',
            } as PurchaseOrderType,
            partnerRoleType: {
              id: '6000036',
              name: 'MRO Mining',
            } as SectorGpsd,
            offerType: { id: 1, name: 'offer type name' } as OfferType,
            disabled: false,
            isSapCase: false,
          },
        }
      );
    });
    test('should pass caseName to Modal', () => {
      component.caseName = 'case-name';

      component.openCaseEditingModal();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditCaseModalComponent,
        {
          width: '660px',
          position: {
            top: '50px',
          },
          panelClass: 'edit-case-modal',
          data: {
            caseName: 'case-name',
            bindingPeriodValidityEndDate: undefined,
            customerPurchaseOrderDate: undefined,
            enableSapFieldEditing: false,
            quotationToDate: undefined,
            requestedDeliveryDate: undefined,
            currency: undefined,
            salesOrg: undefined,
            shipToParty: {
              id: undefined,
              value: undefined,
              value2: undefined,
            },
            disabled: false,
            isSapCase: false,
          },
        }
      );
    });

    test('should pass shipToParty and salesOrg to Modal', () => {
      component.caseName = 'case-name';
      component.shipToParty = CUSTOMER_MOCK;

      component.openCaseEditingModal();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditCaseModalComponent,
        {
          width: '660px',
          position: {
            top: '50px',
          },
          panelClass: 'edit-case-modal',
          data: {
            caseName: 'case-name',
            bindingPeriodValidityEndDate: undefined,
            customerPurchaseOrderDate: undefined,
            enableSapFieldEditing: false,
            quotationToDate: undefined,
            requestedDeliveryDate: undefined,
            currency: undefined,
            salesOrg: CUSTOMER_MOCK.identifier.salesOrg,
            shipToParty: {
              id: CUSTOMER_MOCK.identifier.customerId,
              value: CUSTOMER_MOCK.name,
              value2: CUSTOMER_MOCK.country,
            },
            disabled: false,
            isSapCase: false,
          },
        }
      );
    });

    test('should emit output for caseName and currency', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of({ caseName: 'test', currency: 'EUR' })),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(1);
      expect(component.updateQuotation.emit).toHaveBeenCalledWith({
        caseName: 'test',
        currency: 'EUR',
      });
    });
    test('should emit output for caseName', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of({ caseName: 'test' })),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(1);
      expect(component.updateQuotation.emit).toHaveBeenCalledWith({
        caseName: 'test',
      });
    });
    test('should emit output for currency', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of({ currency: 'EUR' })),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(1);
      expect(component.updateQuotation.emit).toHaveBeenCalledWith({
        currency: 'EUR',
      });
    });

    test('should not emit output', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of()),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(0);
    });

    test('should set shipToParty', () => {
      component.shipToParty = undefined;
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() =>
          of({
            caseName: '12',
            shipToParty: { customerId: '125', salesOrg: '0815' },
          })
        ),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledWith({
        caseName: '12',
        shipToParty: { customerId: '125', salesOrg: '0815' },
      });
    });
  });

  describe('quotation input', () => {
    test(
      'translations for quotation mock',
      marbles((m) => {
        const mockDate = '2022-02-01';
        transformationService.transformDate = jest
          .fn()
          .mockReturnValue(mockDate);

        spectator.setInput('quotation', QUOTATION_MOCK);

        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledTimes(2);
        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledWith(
          'header.gqHeader',
          {
            gqCreationDate: mockDate,
            gqCreationName: QUOTATION_MOCK.gqCreatedByUser.name,
            gqUpdatedDate: mockDate,
            gqUpdatedName: QUOTATION_MOCK.gqLastUpdatedByUser.name,
          },
          'process-case-view'
        );
        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledWith(
          'header.sapHeader',
          {
            sapCreationName: QUOTATION_MOCK.sapCreatedByUser.name,
            sapCreationDate: mockDate,
            sapUpdatedDate: mockDate,
          },
          'process-case-view'
        );
        m.expect(component.gqHeader$).toBeObservable('(a|)', {
          a: 'translated',
        });
        m.expect(component.sapHeader$).toBeObservable('(a|)', {
          a: 'translated',
        });
      })
    );
    test(
      'translations for missing sap updated date',
      marbles((m) => {
        const mockDate = '2022-02-01';
        transformationService.transformDate = jest
          .fn()
          .mockImplementation((value) => (value ? mockDate : Keyboard.DASH));

        spectator.setInput('quotation', {
          ...QUOTATION_MOCK,
          sapLastUpdated: undefined,
          sapQuotationToDate: '2202-12-21)',
        });

        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledTimes(2);
        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledWith(
          'header.gqHeader',
          {
            gqCreationDate: mockDate,
            gqCreationName: QUOTATION_MOCK.gqCreatedByUser.name,
            gqUpdatedDate: mockDate,
            gqUpdatedName: QUOTATION_MOCK.gqLastUpdatedByUser.name,
          },
          'process-case-view'
        );
        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledWith(
          'header.sapHeader',
          {
            sapCreationName: QUOTATION_MOCK.sapCreatedByUser.name,
            sapCreationDate: mockDate,
            sapUpdatedDate: Keyboard.DASH,
          },
          'process-case-view'
        );
        m.expect(component.gqHeader$).toBeObservable('(a|)', {
          a: 'translated',
        });
        m.expect(component.sapHeader$).toBeObservable('(a|)', {
          a: 'translated',
        });
      })
    );
    test('should set enableSapFieldEditing to true when status is ACTIVE', () => {
      spectator.setInput('quotation', {
        ...QUOTATION_MOCK,
        status: QuotationStatus.ACTIVE,
      });

      expect(component.enableSapFieldEditing).toBe(true);
    });
    test('should set isSapCase to true when sapId is present', () => {
      spectator.setInput('quotation', {
        ...QUOTATION_MOCK,
        sapId: '12345',
      });

      expect(component.isSapCase).toBe(true);
    });
  });
});
