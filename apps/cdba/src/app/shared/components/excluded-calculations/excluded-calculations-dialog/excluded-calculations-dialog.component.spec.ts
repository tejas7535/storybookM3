import { MatIconModule } from '@angular/material/icon';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CostRoles } from '@cdba/core/auth/auth.config';
import { EXCLUDED_CALCULATIONS_MOCK } from '@cdba/testing/mocks';

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

  describe('formatMissingCostRoles', () => {
    it('should format the missing cost roles', () => {
      expect(
        component.formatMissingCostRoles(
          EXCLUDED_CALCULATIONS_MOCK.missingCostRoles
        )
      ).toBe('<CO_PC-INFORMATION>');
    });
  });

  describe('formatCostRole', () => {
    it('should map CDBA_COST_TYPE_SQV to SD-INFORMATION_SAW', () => {
      expect(component['formatCostRole'](CostRoles.Sqv)).toBe(
        '<SD-INFORMATION_SAW>'
      );
    });

    it('should map CDBA_COST_TYPE_GPC to CO_PC-INFORMATION', () => {
      expect(component['formatCostRole'](CostRoles.Gpc)).toBe(
        '<CO_PC-INFORMATION>'
      );
    });
  });
});
