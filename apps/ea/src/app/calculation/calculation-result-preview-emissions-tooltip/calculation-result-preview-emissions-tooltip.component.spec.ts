import { MatDialog } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationDisclaimerComponent } from '../calculation-disclaimer/calculation-disclaimer.component';
import { CalculationResultPreviewEmissionsTooltipComponent } from './calculation-result-preview-emissions-tooltip.component';

describe('CalculationResultPreviewEmissionsTooltipComponent', () => {
  let component: CalculationResultPreviewEmissionsTooltipComponent;
  let spectator: Spectator<CalculationResultPreviewEmissionsTooltipComponent>;

  const createComponent = createComponentFactory({
    component: CalculationResultPreviewEmissionsTooltipComponent,
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  describe('onInit', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('openMoreInformation', () => {
    it('should open the dialog', () => {
      component.openMoreInformation();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        CalculationDisclaimerComponent,
        {
          hasBackdrop: true,
          autoFocus: true,
          maxWidth: '750px',
        }
      );
    });
  });
});
