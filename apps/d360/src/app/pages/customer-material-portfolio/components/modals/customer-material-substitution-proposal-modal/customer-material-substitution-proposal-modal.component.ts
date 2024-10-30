import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CMPData } from '../../../../../feature/customer-material-portfolio/cmp-modal-types';

@Component({
  selector: 'app-customer-material-substitution-proposal-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './customer-material-substitution-proposal-modal.component.html',
  styleUrl: './customer-material-substitution-proposal-modal.component.scss',
})
export class CustomerMaterialSubstitutionProposalModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected data: CMPData) {}
}
