import { Component, Input } from '@angular/core';

import { GeneralInformation } from './../../models';

@Component({
  selector: 'gq-general-information',
  templateUrl: './general-information.component.html',
})
export class GeneralInformationComponent {
  @Input() info: GeneralInformation;
}
