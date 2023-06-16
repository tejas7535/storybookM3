import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AddMaterialButtonComponent } from './add-material-button.component';

describe('CreateCaseButtonComponent', () => {
  let component: AddMaterialButtonComponent;
  let spectator: Spectator<AddMaterialButtonComponent>;

  const createComponent = createComponentFactory({
    component: AddMaterialButtonComponent,
    declarations: [AddMaterialButtonComponent],
    imports: [
      CommonModule,
      SharedTranslocoModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({}),
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
