import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ApprovalCockpitComponent } from './approval-cockpit.component';

describe('ApprovalCockpitComponent', () => {
  let component: ApprovalCockpitComponent;
  let spectator: Spectator<ApprovalCockpitComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalCockpitComponent,
    imports: [MatDialogModule],
    providers: [
      {
        provide: ApprovalFacade,
        useValue: {},
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
