import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateCustomerCaseComponent } from '../../../../case-view/case-creation/create-customer-case/create-customer-case.component';

@Component({
  selector: 'gq-create-customer-case-button',
  templateUrl: './create-customer-case-button.component.html',
})
export class CreateCustomerCaseButtonComponent {
  constructor(private readonly dialog: MatDialog) {}

  agInit(): void {}
  createCustomerCase(): void {
    this.dialog.open(CreateCustomerCaseComponent, {
      width: '70%',
      height: '95%',
    });
  }
}
