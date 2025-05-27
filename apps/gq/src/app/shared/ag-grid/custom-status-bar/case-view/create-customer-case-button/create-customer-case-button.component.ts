import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-create-customer-case-button',
  templateUrl: './create-customer-case-button.component.html',
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    SharedTranslocoModule,
  ],
})
export class CreateCustomerCaseButtonComponent {
  private readonly router: Router = inject(Router);

  agInit(): void {}
  createCustomerCase(): void {
    this.router.navigate([AppRoutePath.CreateCaseFromCustomerPath]);
  }
}
