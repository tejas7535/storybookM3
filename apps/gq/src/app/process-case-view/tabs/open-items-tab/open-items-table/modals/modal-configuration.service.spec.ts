import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { translate } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ModalConfigurationService } from './modal-configuration.service';
import { RecalculationProcessAction } from './models/recalculation-process-action.enum';
import { ProcessesModalWrapperComponent } from './processes-modal-wrapper/processes-modal-wrapper.component';

describe('ModalConfigurationService', () => {
  let service: ModalConfigurationService;
  let spectator: SpectatorService<ModalConfigurationService>;

  const createService = createServiceFactory({
    service: ModalConfigurationService,
    providers: [
      { provide: MatDialog, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { gqpPosId: '123' },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ModalConfigurationService);
  });

  test('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('getMenuItemsByStatus', () => {
    describe('OPEN', () => {
      test('should return menu items for OPEN status', () => {
        const status = Rfq4Status.OPEN;
        const quotationDetail = {} as any;

        const result = service.getMenuItemsByStatus(status, quotationDetail);

        expect(result).toHaveLength(2);
        expect(result[0].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.startProcess')
        );
        expect(result[1].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.cancelProcess')
        );
      });
      test('should return Menu for OPEN status with enabled Menu', () => {
        const status = Rfq4Status.OPEN;
        const quotationDetail = {
          rfq4: {
            sqvApprovalStatus: SqvApprovalStatus.APPROVED,
          },
        } as any;

        const result = service.getMenuItemsByStatus(status, quotationDetail);

        expect(result).toHaveLength(2);
        expect(result[0].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.startProcess')
        );
        expect(result[0].disabled).toBeFalsy();
      });
      test('should return Menu for OPEN status with disabled Menu', () => {
        const status = Rfq4Status.OPEN;
        const quotationDetail = {
          rfq4: {
            sqvApprovalStatus: SqvApprovalStatus.APPROVAL_NEEDED,
          },
        } as any;

        const result = service.getMenuItemsByStatus(status, quotationDetail);

        expect(result).toHaveLength(2);
        expect(result[0].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.startProcess')
        );
        expect(result[0].disabled).toBeTruthy();
      });
    });

    describe('CANCELLED', () => {
      test('should return menu items for CANCELLED status and set Reopen disabled to true for allowedToReopen', () => {
        const status = Rfq4Status.CANCELLED;
        const quotationDetail = { rfq4: { allowedToReopen: false } } as any;

        const result = service.getMenuItemsByStatus(status, quotationDetail);

        expect(result).toHaveLength(2);
        expect(result[0].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.showHistory')
        );
        expect(result[1].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.reopenProcess')
        );
        expect(result[1].disabled).toBeTruthy();
      });
      test('should return menu items for CANCELLED status and set Reopen disabled to true for approval needed', () => {
        const status = Rfq4Status.CANCELLED;
        const quotationDetail = {
          rfq4: { sqvApprovalStatus: SqvApprovalStatus.APPROVAL_NEEDED },
        } as any;

        const result = service.getMenuItemsByStatus(status, quotationDetail);

        expect(result).toHaveLength(2);
        expect(result[0].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.showHistory')
        );
        expect(result[1].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.reopenProcess')
        );
        expect(result[1].disabled).toBeTruthy();
      });

      test('should return menu items for CANCELLED status and set Reopen disabled to false', () => {
        const status = Rfq4Status.CANCELLED;
        const quotationDetail = { rfq4: { allowedToReopen: true } } as any;

        const result = service.getMenuItemsByStatus(status, quotationDetail);

        expect(result).toHaveLength(2);
        expect(result[0].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.showHistory')
        );
        expect(result[1].caption).toBe(
          translate('shared.openItemsTable.actionMenuItems.reopenProcess')
        );
        expect(result[1].disabled).toBeFalsy();
      });
    });

    test('should return menu items for IN_PROGRESS status', () => {
      const status = Rfq4Status.IN_PROGRESS;
      const quotationDetail = {} as any;

      const result = service.getMenuItemsByStatus(status, quotationDetail);

      expect(result).toHaveLength(2);
      expect(result[0].caption).toBe(
        translate('shared.openItemsTable.actionMenuItems.showHistory')
      );
      expect(result[1].caption).toBe(
        translate('shared.openItemsTable.actionMenuItems.cancelProcess')
      );
    });

    test('should return menu items for CONFIRMED status', () => {
      const status = Rfq4Status.CONFIRMED;
      const quotationDetail = { rfq4: { allowedToReopen: true } } as any;

      const result = service.getMenuItemsByStatus(status, quotationDetail);

      expect(result).toHaveLength(2);
      expect(result[0].caption).toBe(
        translate('shared.openItemsTable.actionMenuItems.showHistory')
      );
      expect(result[1].caption).toBe(
        translate('shared.openItemsTable.actionMenuItems.reopenProcess')
      );
    });
  });
  describe('openProcessDialog', () => {
    test('should open process dialog', () => {
      const process = RecalculationProcessAction.START;
      const quotationDetail = {} as any;
      const openMock = jest.fn();
      service['dialog'].open = openMock;
      service['openProcessDialog'](process, quotationDetail);

      expect(openMock).toHaveBeenCalledWith(
        ProcessesModalWrapperComponent,
        expect.anything()
      );
    });
  });

  describe('isStartProcessDisabled', () => {
    test('should return true when rfq4 is set and approvalStatus is Approval_needed', () => {
      const quotationDetail = {
        rfq4: {
          sqvApprovalStatus: SqvApprovalStatus.APPROVAL_NEEDED,
        },
      } as any;

      const result = service['isStartProcessDisabled'](quotationDetail);

      expect(result).toBe(true);
    });
    test('should return false, when rfq4 are null', () => {
      const quotationDetail = {
        rfq4: null,
      } as any;

      const result = service['isStartProcessDisabled'](quotationDetail);

      expect(result).toBeFalsy();
    });
    test('should retunr false when rfq4 is set and approvalStatus is not Approval_needed', () => {
      const quotationDetail = {
        rfq4: {
          sqvApprovalStatus: SqvApprovalStatus.APPROVED,
        },
      } as any;

      const result = service['isStartProcessDisabled'](quotationDetail);

      expect(result).toBe(false);
    });
  });
});
