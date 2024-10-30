import { FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { StatusSpecificContentProps } from '../status-specific-content.component';
import { PhaseInStatusSpecificContentComponent } from './phase-in-status-specific-content.component';

describe('PhaseInStatusSpecificContentComponent', () => {
  let spectator: Spectator<PhaseInStatusSpecificContentComponent>;
  const createComponent = createComponentFactory({
    component: PhaseInStatusSpecificContentComponent,
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
