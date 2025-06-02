import {
  Component,
  inject,
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
  protected isLoading: WritableSignal<boolean> = signal(false);
  protected customerMaterialNumbers: WritableSignal<string[]> = signal([]);

  protected data: CustomerMaterialNumbersDialogData = inject(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.isLoading = this.data.isLoading;
    this.customerMaterialNumbers = this.data.customerMaterialNumbers;
  }

  protected copyCustomerMaterialNumbersToClipboard(): void {
    navigator.clipboard.writeText(this.customerMaterialNumbers().join('\n'));
  }
}
