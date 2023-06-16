import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TabbedOptionsComponent } from './tabbed-options.component';

describe('TabbedOptionsComponent', () => {
  let component: TabbedOptionsComponent;
  let spectator: Spectator<TabbedOptionsComponent>;

  const createComponent = createComponentFactory({
    component: TabbedOptionsComponent,
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
