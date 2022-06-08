import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { ToggleComponent } from './toggle.component';
import { ToggleControl } from './toggle.model';

describe('ToggleComponent', () => {
  let component: ToggleComponent;
  let spectator: Spectator<ToggleComponent>;

  const control = new ToggleControl({
    key: 'testToggle',
    name: 'TEST_TOGGLE',
    disabled: false,
    default: false,
    formControl: new FormControl(),
  });

  const createComponent = createComponentFactory({
    component: ToggleComponent,
    declarations: [ToggleComponent],
    imports: [
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSlideToggleModule,
      NoopAnimationsModule,
      PushModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('control', control);
    spectator.detectChanges();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
