import { Component, Input, OnInit } from '@angular/core';

import { FeedbackBannerComponent } from '@schaeffler/feedback-banner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-qualtrics-info-banner',
  templateUrl: './qualtrics-info-banner.component.html',
  imports: [FeedbackBannerComponent, SharedTranslocoModule],
})
export class QualtricsInfoBannerComponent implements OnInit {
  @Input({ required: true })
  bearingDesingation: string;

  @Input()
  public readonly survey: 'default' | 'legacy' = 'default';

  public readonly providedLanguages: string[] = ['de', 'en'];
  public surveyUrl: string;

  ngOnInit(): void {
    if (this.survey === 'default') {
      this.surveyUrl = `https://schaefflertech.qualtrics.com/jfe/form/SV_8BQzm549jixUDyu?bearingDesignation=${this.bearingDesingation}&Q_Language=`;
    }
    if (this.survey === 'legacy') {
      this.surveyUrl = `https://schaefflertech.qualtrics.com/jfe/form/SV_abAew4g7C4e86BE?bearingDesignation=${this.bearingDesingation}&Q_Language=`;
    }
  }
}
