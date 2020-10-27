import { Component, EventEmitter, Input, Output } from '@angular/core';

import { QuotationDetail } from '../../core/store/models';

@Component({
  selector: 'gq-offer-drawer',
  templateUrl: './offer-drawer.component.html',
  styleUrls: ['./offer-drawer.component.scss'],
})
export class OfferDrawerComponent {
  @Input() rowData: QuotationDetail[];

  @Output() readonly toggleOfferDrawer: EventEmitter<
    boolean
  > = new EventEmitter();

  public drawerToggle(): void {
    this.toggleOfferDrawer.emit(true);
  }
}
