import { Component, Input, OnInit } from '@angular/core';

import { FeedbackBannerComponent } from '@schaeffler/feedback-banner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  standalone: true,
  selector: 'ea-qualtrics-info-banner',
  templateUrl: './qualtrics-info-banner.component.html',
  imports: [FeedbackBannerComponent, SharedTranslocoModule],
})
export class QualtricsInfoBannerComponent implements OnInit {
  @Input({ required: true })
  bearingDesingation: string;

  public readonly providedLanguages: string[] = ['de', 'en'];
  public surveyUrl: string;

  ngOnInit(): void {
    this.surveyUrl = `https://schaefflertech.qualtrics.com/jfe/form/SV_8BQzm549jixUDyu?bearingDesignation=${this.bearingDesingation}&Q_Language=`;
  }
}
