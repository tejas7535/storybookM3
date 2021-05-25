import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ImportCaseButtonComponent } from './import-case-button.component';

describe('ImportCaseComponent', () => {
  let component: ImportCaseButtonComponent;
  let spectator: Spectator<ImportCaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: ImportCaseButtonComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
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
