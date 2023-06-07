import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RadioButtonComponent } from './radio-button.component';

describe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let spectator: Spectator<RadioButtonComponent>;

  const createComponent = createComponentFactory({
    component: RadioButtonComponent,
    imports: [
      ReactiveFormsModule,
      MockModule(MatFormFieldModule),
      MockModule(MatInputModule),
      MatIconTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    const control = new FormControl('');
    spectator = createComponent({
      props: { formControl: control },
    });
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
