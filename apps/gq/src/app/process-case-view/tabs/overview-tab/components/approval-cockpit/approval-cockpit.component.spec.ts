import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ApprovalCockpitComponent } from './approval-cockpit.component';

describe('ApprovalCockpitComponent', () => {
  let component: ApprovalCockpitComponent;
  let spectator: Spectator<ApprovalCockpitComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalCockpitComponent,
    imports: [MatDialogModule],
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
