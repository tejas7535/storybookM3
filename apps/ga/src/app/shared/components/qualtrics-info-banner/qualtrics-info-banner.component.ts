import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoBannerComponent } from '@ga/shared/components/info-banner/info-banner.component';
import { QualtricsSurveyComponent } from '@ga/shared/components/qualtrics-survey/qualtrics-survey.component';

@Component({
  standalone: true,
  selector: 'ga-qualtrics-info-banner',
  templateUrl: './qualtrics-info-banner.component.html',
  imports: [
    CommonModule,
    InfoBannerComponent,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
  ],
})
export class QualtricsInfoBannerComponent implements OnInit, OnDestroy {
  shouldDisplayBanner = false;
  private languageCode = '';
  private readonly providedLanguages: string[] = ['de', 'en'];
  private readonly subscription = new Subscription();

  constructor(
    private readonly dialog: MatDialog,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    // Once Qualtrics will provide survey implementation in all languages shouldDisplayBanner can be removed.
    this.subscription.add(
      this.translocoService.langChanges$.subscribe((language) => {
        this.languageCode = language;
        this.shouldDisplayBanner = this.providedLanguages.includes(language);
      })
    );
  }

  openSurveyDialog() {
    this.dialog.open(QualtricsSurveyComponent, {
      data: {
        languageCode: this.languageCode,
      },
      autoFocus: false,
      hasBackdrop: true,
      width: '90vw',
      maxWidth: '90vw',
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
