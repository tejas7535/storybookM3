import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AdditionalInformationDetails } from '@cdba/shared/models';

@Component({
  selector: 'cdba-additional-information-widget',
  templateUrl: './additional-information-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalInformationWidgetComponent {
  @Input() public additionalInformation: AdditionalInformationDetails;

  public currentYear = new Date().getFullYear();
}
