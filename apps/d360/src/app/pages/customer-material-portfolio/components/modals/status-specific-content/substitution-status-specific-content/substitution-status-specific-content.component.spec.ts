import { FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { StatusSpecificContentProps } from '../status-specific-content.component';
import { SubstitutionStatusSpecificContentComponent } from './substitution-status-specific-content.component';

describe('SubstitutionStatusSpecificContentComponent', () => {
  let spectator: Spectator<SubstitutionStatusSpecificContentComponent>;
  const createComponent = createComponentFactory({
    component: SubstitutionStatusSpecificContentComponent,
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
