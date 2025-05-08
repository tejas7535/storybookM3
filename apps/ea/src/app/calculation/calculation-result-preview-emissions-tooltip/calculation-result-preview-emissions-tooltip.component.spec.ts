import { MatDialog } from '@angular/material/dialog';

import { DisclaimerService } from '@ea/core/services/disclaimer.service';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
      mockProvider(DisclaimerService),
    ],
  });

  describe('when upstream tooltip', () => {
    beforeEach(() => {
      spectator = createComponent();
      spectator.setInput('isDownstream', false);
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

        expect(
          component['disclaimerServie'].openCO2Disclaimer
        ).toHaveBeenCalledWith(false);
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

        expect(
          component['disclaimerServie'].openCO2Disclaimer
        ).toHaveBeenCalledWith(true);
      });
    });
  });
});
