import { Component } from '@angular/core';

import { FeedbackBannerComponent } from '@schaeffler/feedback-banner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mm-qualtrics-info-banner',
  templateUrl: './qualtrics-info-banner.component.html',
  imports: [FeedbackBannerComponent, SharedTranslocoModule],
})
export class QualtricsInfoBannerComponent {
  public readonly providedLanguages: string[] = [
    'de',
    'en',
    'es',
    'fr',
    'ru',
    'zh',
  ];
  public readonly surveyUrl =
    'https://schaefflertech.qualtrics.com/jfe/form/SV_e5rEWZ7GrR1v0O2?Q_Language=';
}
