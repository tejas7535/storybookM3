import {
  Component,
  Inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

export interface CustomerMaterialNumbersDialogData {
  customerMaterialNumbers: WritableSignal<string[]>;
  isLoading: WritableSignal<boolean>;
}

@Component({
  selector: 'd360-customer-material-numbers-modal',
  templateUrl: './customer-material-numbers-modal.component.html',
  styleUrls: ['./customer-material-numbers-modal.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
    MatDividerModule,
    LoadingSpinnerModule,
  ],
})
export class CustomerMaterialNumbersModalComponent implements OnInit {
  isLoading: WritableSignal<boolean> = signal(false);
  customerMaterialNumbers: WritableSignal<string[]> = signal([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: CustomerMaterialNumbersDialogData
  ) {}

  ngOnInit(): void {
    this.isLoading = this.data.isLoading;
    this.customerMaterialNumbers = this.data.customerMaterialNumbers;
  }

  copyCustomerMaterialNumbersToClipboard() {
    navigator.clipboard.writeText(this.customerMaterialNumbers().join('\n'));
  }
}
