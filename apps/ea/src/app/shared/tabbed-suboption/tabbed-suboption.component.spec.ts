import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TabbedSuboptionComponent } from './tabbed-suboption.component';

describe('TabbedSuboptionComponent', () => {
  let component: TabbedSuboptionComponent;
  let spectator: Spectator<TabbedSuboptionComponent>;

  const createComponent = createComponentFactory({
    component: TabbedSuboptionComponent,
    imports: [
      ReactiveFormsModule,
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
