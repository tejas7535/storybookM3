import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { of } from 'rxjs';

import { CONTROL_META, VariablePropertyMeta } from '@caeonline/dynamic-forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { MaterialModule } from './../../../material.module';
import { StringNumberMemberComponent } from './string-number-member.component';

describe('SelectMemberComponent', () => {
  let component: StringNumberMemberComponent;
  let spectator: Spectator<StringNumberMemberComponent>;

  const createComponent = createComponentFactory({
    component: StringNumberMemberComponent,
    imports: [
      TranslocoTestingModule,
      PushPipe,
      MaterialModule,
      ReactiveFormsModule,
    ],
    declarations: [StringNumberMemberComponent],
    providers: [
      {
        provide: CONTROL_META,
        useValue: {
          member: {},
          listValues$: of([]),
          page: { id: 'some page id' },
        } as VariablePropertyMeta,
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getControl', () => {
    it('should return give form control from meta', () => {
      const mockedFormControl = new FormControl('test');
      const mockedFormGroup = new FormGroup({ value: mockedFormControl });
      component['meta'].control = mockedFormGroup;

      const result = component.control;

      expect(result).toEqual(mockedFormControl);
    });

    it('should return a new form control if meta has none', () => {
      component['meta'].control = undefined;

      const result = component.control;

      expect(JSON.stringify(result)).toBe(JSON.stringify(new FormControl('')));
    });
  });
});
