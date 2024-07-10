import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock';
import { MockModule } from 'ng-mocks';

import { BetaFeatureModule } from '@cdba/shared/components/index';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import { BetaFeatureSettingsComponent } from './beta-feature-settings.component';

describe('BetaFeatureSettingsComponent', () => {
  let component: BetaFeatureSettingsComponent;
  let spectator: Spectator<BetaFeatureSettingsComponent>;
  let betaFeatureService: BetaFeatureService;
  let highFiveDialog: SpyObject<MatDialog>;

  const windowLocationReloadMock = jest.fn();

  const createComponent = createComponentFactory({
    component: BetaFeatureSettingsComponent,
    imports: [
      MockModule(MatDialogModule),
      MockModule(MatSlideToggleModule),
      MockModule(BetaFeatureModule),
    ],
    providers: [mockProvider(BetaFeatureService)],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    betaFeatureService = spectator.inject(BetaFeatureService);
    highFiveDialog = spectator.inject(MatDialog);

    jest.spyOn(component, 'handleFeatureToggleChange');

    jest.useFakeTimers();

    delete window.location;
    window.location = { reload: windowLocationReloadMock } as any;
  });

  afterEach(() => {
    jest.useRealTimers();
    windowLocationReloadMock.mockClear();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial props and services', () => {
    expect(component.disableToggles).toBe(false);
    expect(component['betaFeatureService']).toBeTruthy();
    expect(component['dialog']).toBeTruthy();
  });

  describe('handleFeatureToggleChange', () => {
    it('should handle activation', () => {
      component.handleFeatureToggleChange('portfolioAnalysis', true, true);

      expect(component.disableToggles).toBe(true);
      expect(betaFeatureService.setBetaFeature).toHaveBeenCalledWith(
        'portfolioAnalysis',
        true
      );
      expect(highFiveDialog.open).toHaveBeenCalled();
      jest.advanceTimersByTime(5000);
      expect(component.disableToggles).toBe(false);
      expect(highFiveDialog.closeAll).toHaveBeenCalled();
    });

    it('should handle deactivation', () => {
      component.handleFeatureToggleChange('portfolioAnalysis', false, false);

      expect(betaFeatureService.setBetaFeature).toHaveBeenCalledWith(
        'portfolioAnalysis',
        false
      );
      expect(highFiveDialog.open).not.toHaveBeenCalled();
    });

    it('should reload page', () => {
      component.handleFeatureToggleChange('portfolioAnalysis', false, true);
      jest.advanceTimersByTime(500);

      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
