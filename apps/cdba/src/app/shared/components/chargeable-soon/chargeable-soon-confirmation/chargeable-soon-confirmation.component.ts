import { Component } from '@angular/core';

@Component({
  selector: 'cdba-browser-support-dialog',
  templateUrl: './chargeable-soon-confirmation.component.html',
})
export class ChargeableSoonConfirmationComponent {
  public emailTemplate = `mailto:it-support-sg@schaeffler.com?subject=Assignment Group: CDBA_Support_G; Category: CDBA_Access&body=Hallo, %0D%0A %0D%0A Bitte löschen Sie meinen CDBA Zugang. %0D%0A %0D%0A ------ %0D%0A %0D%0A Hello, %0D%0A %0D%0A Please delete my CDBA account.`;
}
