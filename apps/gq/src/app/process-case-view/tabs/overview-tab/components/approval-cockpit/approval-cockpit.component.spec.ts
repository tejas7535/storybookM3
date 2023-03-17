/* tslint:disable:no-unused-variable */

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ApprovalCockpitComponent } from './approval-cockpit.component';

describe('ApprovalCockpitComponent', () => {
  let component: ApprovalCockpitComponent;
  let spectator: Spectator<ApprovalCockpitComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalCockpitComponent,
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
