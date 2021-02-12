import { Component } from '@angular/core';

@Component({
  selector: 'gq-info-cell',
  templateUrl: './offer-cart-cell.component.html',
  styleUrls: ['./offer-cart-cell.component.scss'],
})
export class OfferCartCellComponent {
  public addToOffer: boolean;

  agInit(params: any): void {
    this.addToOffer = params.value;
  }
}
