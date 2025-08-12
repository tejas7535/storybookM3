import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { BetaFeature } from '@cdba/shared/constants/beta-feature';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

@Component({
  selector: 'cdba-beta-feature-settings',
  templateUrl: './beta-feature-settings.component.html',
  standalone: false,
})
export class BetaFeatureSettingsComponent implements OnInit {
  @ViewChild('highFiveDialog') highFiveDialogTemplate: TemplateRef<any>;

  disableToggles = false;
  private highFiveTimeout: number;
  private reloadPage: boolean;

  showComparisonSummaryToggle = true;
  comparisonSummaryActivated = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly betaFeatureService: BetaFeatureService
  ) {}

  ngOnInit(): void {
    this.comparisonSummaryActivated = this.betaFeatureService.getBetaFeature(
      BetaFeature.COMPARISON_SUMMARY
    );
  }

  onComparisonSummaryToggleChange(
    matSlideToggleChange: MatSlideToggleChange
  ): void {
    this.handleFeatureToggleChange(
      BetaFeature.COMPARISON_SUMMARY,
      matSlideToggleChange.checked,
      true
    );
  }

  handleFeatureToggleChange(
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
        backdropClass: ['!bg-surface-legacy', '!opacity-90'],
        panelClass: 'high-five-dialog',
      });
    }

    this.highFiveTimeout = window.setTimeout(() => {
      this.handleSettingFinalization();
    }, timeoutDelay);
  }

  onHighFiveClick(): void {
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
