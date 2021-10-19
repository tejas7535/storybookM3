import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { BrowserSupportDialogComponent } from './browser-support-dialog.component';

describe('BrowserSupportDialogComponent', () => {
  let component: BrowserSupportDialogComponent;
  let spectator: Spectator<BrowserSupportDialogComponent>;

  const createComponent = createComponentFactory({
    component: BrowserSupportDialogComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
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
