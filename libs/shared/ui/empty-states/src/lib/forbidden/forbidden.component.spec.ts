import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ForbiddenComponent } from './forbidden.component';
import * as en from './i18n/en.json';

describe('ForbiddenComponent', () => {
  let spectator: Spectator<ForbiddenComponent>;
  let component: ForbiddenComponent;

  const createComponent = createComponentFactory({
    component: ForbiddenComponent,
    imports: [
      provideTranslocoTestingModule({ 'forbidden/en': en }),
      MatButtonModule,
      RouterTestingModule,
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
