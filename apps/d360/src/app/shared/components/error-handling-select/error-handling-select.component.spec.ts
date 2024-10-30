import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { FieldErrorComponent } from '../field-error/field-error.component';
import { ErrorHandlingSelectComponent } from './error-handling-select.component';

describe('ErrorHandlingSelectComponent', () => {
  let spectator: Spectator<ErrorHandlingSelectComponent>;

  const createComponent = createComponentFactory({
    component: ErrorHandlingSelectComponent,
    imports: [MatSelectModule, ReactiveFormsModule, FieldErrorComponent],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        label: 'Hello from Test',
        appearance: 'fill',
        color: 'primary',
        hint: 'Select a value',
        errorMessages: [],
        options: [],
        fC: new FormControl(),
        fG: new FormGroup({}),
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
