import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'd360-feedback-button',
  imports: [SharedTranslocoModule, MatButtonModule, MatIconModule],
  templateUrl: './feedback-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackButtonComponent {
  /**
   * The base URL for the feedback questionnaire.
   *
   * @type {InputSignal<string>}
   * @memberof FeedbackButtonComponent
   */
  public questionnaireUrl: InputSignal<string> = input.required();
}
