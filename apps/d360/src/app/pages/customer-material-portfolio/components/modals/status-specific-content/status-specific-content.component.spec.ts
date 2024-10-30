import { FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import {
  StatusSpecificContentComponent,
  StatusSpecificContentProps,
} from './status-specific-content.component';

describe('StatusSpecificContentComponent', () => {
  let spectator: Spectator<StatusSpecificContentComponent>;
  const createComponent = createComponentFactory({
    component: StatusSpecificContentComponent,
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
