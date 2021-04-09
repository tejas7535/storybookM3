import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ForbiddenComponent } from './forbidden.component';
import * as en from './i18n/de.json';

describe('ForbiddenComponent', () => {
  let spectator: Spectator<ForbiddenComponent>;
  let component: ForbiddenComponent;

  const createComponent = createComponentFactory({
    component: ForbiddenComponent,
    imports: [
      provideTranslocoTestingModule({ 'forbidden/en': en }),
      MatButtonModule,
      FlexLayoutModule,
      RouterTestingModule,
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
