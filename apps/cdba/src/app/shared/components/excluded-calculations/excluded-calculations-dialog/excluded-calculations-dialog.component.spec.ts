import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EXCLUDED_CALCULATIONS_MOCK } from '@cdba/testing/mocks/index';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ExcludedCalculationsDialogComponent } from './excluded-calculations-dialog.component';

describe('ExcludedCalculationsDialogComponent', () => {
  let component: ExcludedCalculationsDialogComponent;
  let spectator: Spectator<ExcludedCalculationsDialogComponent>;

  const createComponent = createComponentFactory({
    component: ExcludedCalculationsDialogComponent,
    imports: [MatIconModule, provideTranslocoTestingModule({ en: {} })],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format the missing cost roles', () => {
    expect(
      component.formatMissingCostRoles(
        EXCLUDED_CALCULATIONS_MOCK.missingCostRoles
      )
    ).toBe('<CO_PC-INFORMATION>');
  });
});
