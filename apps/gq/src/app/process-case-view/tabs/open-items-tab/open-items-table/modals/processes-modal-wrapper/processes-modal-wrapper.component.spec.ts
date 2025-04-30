import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { of } from 'rxjs';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { Rfq4ProcessModule } from '@gq/core/store/rfq-4-process/rfq-4-process.module';
import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';
import { QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { translate } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockDirective, MockModule } from 'ng-mocks';

import { ApprovalProcessAction } from '../models/approval-process-action.enum';
import { ProcessesModalWrapperComponent } from './processes-modal-wrapper.component';

describe('ProcessesModalFrameComponent', () => {
  let component: ProcessesModalWrapperComponent;
  let spectator: Spectator<ProcessesModalWrapperComponent>;
  const gqPositionId = '123456';

  const createComponent = createComponentFactory({
    component: ProcessesModalWrapperComponent,
    imports: [
      MockModule(Rfq4ProcessModule),
      MockDirective(DragDialogDirective),
    ],
    providers: [
      mockProvider(Rfq4ProcessFacade, {
        findCalculatorsLoading$: of(false),
        sendRecalculateSqvLoading$: of(false),
        calculators$: of([]),
        findCalculators: jest.fn(),
      }),
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          process: ApprovalProcessAction.START,
          quotationDetail: {
            gqPositionId,
            detailCosts: {
              rfq4Status: Rfq4Status.OPEN,
            },
          } as QuotationDetail,
        },
      },
    ],
    mocks: [MatDialog],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    test('should call clearCalculators', () => {
      component['rfq4ProcessesFacade'].clearCalculators = jest.fn();

      component.closeDialog();
      expect(
        component['rfq4ProcessesFacade'].clearCalculators
      ).toHaveBeenCalled();
    });
    test('should close the dialog', () => {
      const closeSpy = jest.spyOn(spectator.inject(MatDialogRef), 'close');
      component.closeDialog();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    test('should call findCalculators with gqPositionId', () => {
      component.modalData.process = ApprovalProcessAction.START;
      component.ngOnInit();
      expect(
        component['rfq4ProcessesFacade'].findCalculators
      ).toHaveBeenCalledWith(gqPositionId);
    });
  });

  describe('getTitle', () => {
    test('should return the correct title for OPEN status', () => {
      const quotationDetail: QuotationDetail = {
        detailCosts: {
          rfq4Status: Rfq4Status.OPEN,
        },
        quotationItemId: '12345',
      } as unknown as QuotationDetail;
      const title = component['getTitle'](quotationDetail);
      expect(title).toBe(
        translate('shared.openItemsTable.approvalProcesses.start.title')
      );
    });
  });
});
