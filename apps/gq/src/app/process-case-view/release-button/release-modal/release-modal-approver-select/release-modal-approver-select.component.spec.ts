import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ReleaseModalApproverSelectComponent } from './release-modal-approver-select.component';

describe('ReleaseModalApproverSelectComponent', () => {
  let component: ReleaseModalApproverSelectComponent;
  let spectator: Spectator<ReleaseModalApproverSelectComponent>;

  const createComponent = createComponentFactory({
    component: ReleaseModalApproverSelectComponent,
    imports: [MatSelectModule, FormsModule, ReactiveFormsModule],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
