import { FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { StatusSpecificContentProps } from '../status-specific-content.component';
import { InactivateStatusSpecificContentComponent } from './inactivate-status-specific-content.component';

describe('InactivateStatusSpecificContentComponent', () => {
  let spectator: Spectator<InactivateStatusSpecificContentComponent>;
  const createComponent = createComponentFactory({
    component: InactivateStatusSpecificContentComponent,
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
