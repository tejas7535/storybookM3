import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-create-manual-case',
  templateUrl: './create-manual-case-button.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    SharedTranslocoModule,
  ],
})
export class CreateManualCaseButtonComponent {
  private readonly router: Router = inject(Router);

  agInit(): void {}

  createManualCase(): void {
    this.router.navigate([AppRoutePath.CreateManualCasePath]);
  }
}
