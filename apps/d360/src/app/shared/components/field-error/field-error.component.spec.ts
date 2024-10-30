import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { FieldErrorComponent } from './field-error.component';

describe('FieldErrorComponent', () => {
  let spectator: Spectator<FieldErrorComponent>;

  const createComponent = createComponentFactory({
    component: FieldErrorComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        errorMessages: [],
        nonErrorText: 'success',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
