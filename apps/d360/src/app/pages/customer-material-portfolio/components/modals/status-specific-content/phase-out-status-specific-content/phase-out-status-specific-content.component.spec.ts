import { FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { StatusSpecificContentProps } from '../status-specific-content.component';
import { PhaseOutStatusSpecificContentComponent } from './phase-out-status-specific-content.component';

describe('PhaseOutStatusSpecificContentComponent', () => {
  let spectator: Spectator<PhaseOutStatusSpecificContentComponent>;
  const createComponent = createComponentFactory({
    component: PhaseOutStatusSpecificContentComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        props: {
          data: {},
          showValidation: false,
          formGroup: new FormGroup({}),
        } as StatusSpecificContentProps,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
