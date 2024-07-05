import { Component, Input } from '@angular/core';

import { QuotationAttachment } from '@gq/shared/models';

import { GeneralInformation } from './../../models';

@Component({
  selector: 'gq-general-information',
  templateUrl: './general-information.component.html',
})
export class GeneralInformationComponent {
  @Input() info: GeneralInformation;
  @Input() attachments: QuotationAttachment[];
  @Input() workflowInProgress: boolean;
  @Input() quotationFullyApproved: boolean;
  @Input() showOfferType: boolean;
}
