import { MatDialog } from '@angular/material/dialog';

import { Quotation, QuotationStatus, SAP_SYNC_STATUS } from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReleaseButtonComponent } from './release-button.component';

describe('ReleaseButtonComponent', () => {
  let component: ReleaseButtonComponent;
  let spectator: Spectator<ReleaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: ReleaseButtonComponent,
    imports: [provideTranslocoTestingModule({})],
    providers: [{ provide: MatDialog, useValue: {} }],
    detectChanges: false,
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('openDialog', () => {
    const open = jest.fn();
    component['dialog'].open = open;

    component.openDialog();

    expect(open).toHaveBeenCalledTimes(1);
  });
  describe('set quotation', () => {
    test('should set displayReleaseButton to true when all criteria are met', () => {
      const quotation = {
        customer: {
          enabledForApprovalWorkflow: true,
        },
        status: QuotationStatus.ACTIVE,
        sapId: '123',
        sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
      } as Quotation;
      component.quotation = quotation;

      expect(component.displayReleaseButton).toBe(true);
    });
  });

  test('should set displayReleaseButton to false when customer not enabled', () => {
    const quotation = {
      customer: {
        enabledForApprovalWorkflow: false,
      },
      status: QuotationStatus.ACTIVE,
      sapId: '123',
      sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
    } as Quotation;
    component.quotation = quotation;

    expect(component.displayReleaseButton).toBe(false);
  });

  test('should set displayReleaseButton to false when quotation not active', () => {
    const quotation = {
      customer: {
        enabledForApprovalWorkflow: true,
      },
      status: QuotationStatus.APPROVED,
      sapId: '123',
      sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
    } as Quotation;
    component.quotation = quotation;

    expect(component.displayReleaseButton).toBe(false);
  });

  test('should set displayReleaseButton to false when not SAP quotation', () => {
    const quotation = {
      customer: {
        enabledForApprovalWorkflow: true,
      },
      status: QuotationStatus.ACTIVE,
      sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
    } as Quotation;
    component.quotation = quotation;

    expect(component.displayReleaseButton).toBe(false);
  });
  test('should set disableReleaseButton to true when sync status not synced', () => {
    const quotation = {
      customer: {
        enabledForApprovalWorkflow: true,
      },
      status: QuotationStatus.ACTIVE,
      sapId: '123',
      sapSyncStatus: SAP_SYNC_STATUS.NOT_SYNCED,
    } as Quotation;
    component.quotation = quotation;

    expect(component.disableReleaseButton).toBe(true);
  });

  test('should set disableReleaseButton to false when sync status synced', () => {
    const quotation = {
      customer: {
        enabledForApprovalWorkflow: true,
      },
      status: QuotationStatus.ACTIVE,
      sapId: '123',
      sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
    } as Quotation;
    component.quotation = quotation;

    expect(component.disableReleaseButton).toBe(false);
  });
});
