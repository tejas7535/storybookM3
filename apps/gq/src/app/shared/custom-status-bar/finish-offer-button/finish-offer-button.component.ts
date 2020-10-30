import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '../../../app-route-path.enum';

@Component({
  selector: 'gq-finish-offer',
  templateUrl: './finish-offer-button.component.html',
  styleUrls: ['./finish-offer-button.component.scss'],
})
export class FinishOfferButtonComponent {
  constructor(private readonly router: Router) {}

  agInit(): void {}

  finishOffer(): void {
    this.router.navigate([AppRoutePath.OfferViewPath]);
  }
}
