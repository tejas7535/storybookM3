import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CreateManualCaseButtonComponent } from './create-manual-case-button.component';

describe('CreateManualCaseComponent', () => {
  let component: CreateManualCaseButtonComponent;
  let spectator: Spectator<CreateManualCaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: CreateManualCaseButtonComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
