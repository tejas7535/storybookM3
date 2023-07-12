/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { NEVER } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ApprovalWorkflowHistoryComponent } from './approval-workflow-history.component';

describe('ApprovalWorkflowHistoryComponent', () => {
  let component: ApprovalWorkflowHistoryComponent;
  let spectator: Spectator<ApprovalWorkflowHistoryComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalWorkflowHistoryComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: ApprovalFacade,
        useValue: {
          quotationStatus$: NEVER,
          numberOfReceivedApprovals$: NEVER,
          numberOfRequiredApprovals$: NEVER,
        },
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
});
