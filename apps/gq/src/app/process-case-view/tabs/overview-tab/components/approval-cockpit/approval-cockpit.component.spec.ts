import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ApprovalModalType } from '../../models';
import { ApprovalDecisionModalComponent } from '../approval-decision-modal/approval-decision-modal.component';
import { ForwardApprovalWorkflowModalComponent } from '../forward-approval-workflow-modal/forward-approval-workflow-modal.component';
import { ApprovalCockpitComponent } from './approval-cockpit.component';

describe('ApprovalCockpitComponent', () => {
  let component: ApprovalCockpitComponent;
  let spectator: Spectator<ApprovalCockpitComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalCockpitComponent,
    providers: [
      {
        provide: ApprovalFacade,
        useValue: {},
      },
      { provide: MatDialog, useValue: {} },
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

  test('should open reject approval dialog', () => {
    const openMock = jest.fn();
    component['matDialog'].open = openMock;

    component.openRejectionDialog();

    expect(openMock).toHaveBeenCalledTimes(1);
    expect(openMock).toHaveBeenCalledWith(ApprovalDecisionModalComponent, {
      width: '634px',
      data: {
        type: ApprovalModalType.REJECT_CASE,
      },
    });
  });

  test('should open forward approval dialog', () => {
    const openMock = jest.fn();
    component['matDialog'].open = openMock;

    component.openForwardDialog();

    expect(openMock).toHaveBeenCalledTimes(1);
    expect(openMock).toHaveBeenCalledWith(
      ForwardApprovalWorkflowModalComponent,
      {
        width: '634px',
        autoFocus: false,
      }
    );
  });

  test('should open approve approval dialog', () => {
    const openMock = jest.fn();
    component['matDialog'].open = openMock;

    component.openApprovalDialog();

    expect(openMock).toHaveBeenCalledTimes(1);
    expect(openMock).toHaveBeenCalledWith(ApprovalDecisionModalComponent, {
      width: '634px',
      data: {
        type: ApprovalModalType.APPROVE_CASE,
      },
    });
  });
});
