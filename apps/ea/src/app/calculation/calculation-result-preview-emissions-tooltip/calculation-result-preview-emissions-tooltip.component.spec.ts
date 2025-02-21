import { MatDialog } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationDisclaimerComponent } from '../calculation-disclaimer/calculation-disclaimer.component';
import { CalculationResultPreviewEmissionsTooltipComponent } from './calculation-result-preview-emissions-tooltip.component';

describe('CalculationResultPreviewEmissionsTooltipComponent', () => {
  let component: CalculationResultPreviewEmissionsTooltipComponent;
  let spectator: Spectator<CalculationResultPreviewEmissionsTooltipComponent>;

  const createComponent = createComponentFactory({
    component: CalculationResultPreviewEmissionsTooltipComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(),
        },
      },
    ],
  });

  describe('when upstream tooltip', () => {
    beforeEach(() => {
      spectator = createComponent();
      component = spectator.component;
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should have upstreamHint title', () => {
      expect(component.hintTranslationKey()).toBe('upstreamHint');
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
            panelClass: 'legal-disclaimer-dialog',
            data: {
              isDownstreamDisclaimer: undefined,
            },
          }
        );
      });
    });
  });

  describe('when downstream tooltip', () => {
    beforeEach(() => {
      spectator = createComponent();
      spectator.setInput('isDownstream', true);
      component = spectator.component;
    });
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should have downstreamHint title', () => {
      expect(component.hintTranslationKey()).toBe('downstreamHint');
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
            panelClass: 'legal-disclaimer-dialog',
            data: {
              isDownstreamDisclaimer: true,
            },
          }
        );
      });
    });
  });
});
