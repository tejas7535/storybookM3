import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DeliveryTimeInputComponent } from './delivery-time-input.component';

describe('DeliveryTimeInputComponent', () => {
  let component: DeliveryTimeInputComponent;
  let spectator: Spectator<DeliveryTimeInputComponent>;
  const fb = new FormBuilder();

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.control(null),
  });

  const createComponent = createComponentFactory({
    component: DeliveryTimeInputComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), ReactiveFormsModule],
    providers: [
      {
        provide: FormGroupDirective,
        useValue: formGroupDirective,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        formControlName: 'test',
        deliveryTimeUnitFormControlName: 'test',
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
