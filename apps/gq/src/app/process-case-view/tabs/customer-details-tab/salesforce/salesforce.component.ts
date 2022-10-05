import { Component, Input } from '@angular/core';

import { AccountPotential } from '../../../../shared/models/customer/account-potential.model';

@Component({
  selector: 'gq-salesforce',
  templateUrl: './salesforce.component.html',
})
export class SalesforceComponent {
  @Input() accountPotential: AccountPotential;
  @Input() currency: string;
}
