import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'gq-finish-offer',
  templateUrl: './finish-offer-button.component.html',
  styleUrls: ['./finish-offer-button.component.scss'],
})
export class FinishOfferButtonComponent {
  constructor(private readonly router: Router) {}

  agInit(): void {}

  showDetailView(): void {
    this.router.navigate(['/offer-view']);
  }
}
