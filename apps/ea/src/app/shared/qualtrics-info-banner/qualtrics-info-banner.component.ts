import { Component } from '@angular/core';

import { FeedbackBannerComponent } from '@schaeffler/feedback-banner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  standalone: true,
  selector: 'ea-qualtrics-info-banner',
  templateUrl: './qualtrics-info-banner.component.html',
  imports: [FeedbackBannerComponent, SharedTranslocoModule],
})
export class QualtricsInfoBannerComponent {
  public readonly providedLanguages: string[] = ['de', 'en'];
  public readonly surveyUrl =
    'https://schaefflertech.qualtrics.com/jfe/form/SV_8BQzm549jixUDyu?Q_Language=';
}
