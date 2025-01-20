import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Subscription } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { AlertComponent, AlertType } from '@schaeffler/alert';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoBannerComponent } from './info-banner/info-banner.component';
import { SurveyComponent } from './survey/survey.component';

@Component({
  standalone: true,
  selector: 'schaeffler-feedback-banner',
  templateUrl: './feedback-banner.component.html',
  imports: [
    InfoBannerComponent,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
    AlertComponent,
  ],
})
export class FeedbackBannerComponent implements OnInit, OnDestroy {
  @Input() public providedLanguages: string[] = [];

  @Input() public surveyUrl = '';

  @Input() public feedbackButtonText = '';

  @Input() public infoText = '';

  @Input() public experimentalDesign = false;

  public shouldDisplayBanner = false;
  public alertType: AlertType = 'info';
  private surveyUrlWithLanguageCode = '';
  private readonly subscription = new Subscription();

  public constructor(
    private readonly dialog: MatDialog,
    private readonly translocoService: TranslocoService
  ) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.translocoService.langChanges$.subscribe((language) => {
        this.surveyUrlWithLanguageCode = this.surveyUrl + language;
        this.shouldDisplayBanner = this.providedLanguages.includes(language);
      })
    );
  }

  public openSurveyDialog() {
    this.dialog.open(SurveyComponent, {
      data: {
        url: this.surveyUrlWithLanguageCode,
      },
      autoFocus: false,
      hasBackdrop: true,
      width: '90vw',
      maxWidth: '90vw',
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
