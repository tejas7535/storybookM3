import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { SelectComponent } from './select.component';
import { SelectControl } from './select-control.model';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let spectator: Spectator<SelectComponent>;

  const control = new SelectControl({
    key: 'test',
    name: 'TEST',
    disabled: false,
    formControl: new FormControl(),
    options: of([
      { value: 'testOption', name: 'TESTOPTION' },
      { value: 'testOption2', name: 'TESTOPTION2' },
    ]),
  });

  const createComponent = createComponentFactory({
    component: SelectComponent,
    declarations: [SelectComponent],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSelectModule,
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

  describe('trackByFn()', () => {
    test('should return the loop index to track', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
