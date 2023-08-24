import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { BetaFeature } from '@cdba/shared/constants/beta-feature';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

@Component({
  selector: 'cdba-beta-feature-settings',
  templateUrl: './beta-feature-settings.component.html',
  styleUrls: ['./beta-feature-settings.component.scss'],
})
export class BetaFeatureSettingsComponent {
  @ViewChild('highFiveDialog') highFiveDialogTemplate: TemplateRef<any>;

  public disableToggles = false;
  private highFiveTimeout: number;
  private reloadPage: boolean;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly betaFeatureService: BetaFeatureService
  ) {}

  public handleFeatureToggleChange(
    betaFeature: `${BetaFeature}`,
    betaFeatureState: boolean,
    reloadPage?: boolean
  ): void {
    let timeoutDelay = 500;

    this.reloadPage = reloadPage;
    this.betaFeatureService.setBetaFeature(betaFeature, betaFeatureState);
    this.disableToggles = true;

    if (betaFeatureState) {
      timeoutDelay = 5000;

      this.dialog.open(this.highFiveDialogTemplate, {
        backdropClass: ['!bg-surface', '!opacity-90'],
        panelClass: 'high-five-dialog',
      });
    }

    this.highFiveTimeout = window.setTimeout(() => {
      this.handleSettingFinalization();
    }, timeoutDelay);
  }

  public onHighFiveClick(): void {
    if (this.highFiveTimeout) {
      window.clearTimeout(this.highFiveTimeout);
    }

    this.handleSettingFinalization();
  }

  private handleSettingFinalization(): void {
    this.disableToggles = false;
    this.dialog.closeAll();

    if (this.reloadPage) {
      location.reload();
    }
  }
}
