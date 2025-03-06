import { Component, Input } from '@angular/core';

import { AccountPotential } from '@gq/shared/models/customer/account-potential.model';

@Component({
  selector: 'gq-salesforce',
  templateUrl: './salesforce.component.html',
  standalone: false,
})
export class SalesforceComponent {
  @Input() accountPotential: AccountPotential;
  @Input() currency: string;
}
