import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';
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
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
