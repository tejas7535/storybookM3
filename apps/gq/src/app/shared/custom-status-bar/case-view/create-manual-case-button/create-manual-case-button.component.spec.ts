import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

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
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
