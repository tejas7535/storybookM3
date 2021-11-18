import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AdditionalInformation } from './additional-information.model';

@Component({
  selector: 'cdba-additional-information-widget',
  templateUrl: './additional-information-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalInformationWidgetComponent {
  @Input() public data: AdditionalInformation;

  public currentYear = new Date().getFullYear();
}
