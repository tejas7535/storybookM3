import { HttpClient } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { finalize, Observable, tap } from 'rxjs';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { CustomerMaterialNumbersModalComponent } from './modal/customer-material-numbers-modal.component';

@Component({
  selector: 'd360-customer-material-number-cell-renderer',
  templateUrl: './customer-material-number-cell-renderer.component.html',
  styleUrls: ['./customer-material-number-cell-renderer.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatDialogModule],
})
export class CustomerMaterialNumberCellRendererComponent
  implements ICellRendererAngularComp
{
  customerMaterialNumber: WritableSignal<string> = signal('');
  customerMaterialNumberCount: WritableSignal<number> = signal(0);

  materialNumber: WritableSignal<string> = signal('');
  customerNumber: WritableSignal<string> = signal('');

  isLoading: WritableSignal<boolean> = signal(false);
  customerMaterialNumbers: WritableSignal<string[]> = signal([]);

  readonly dialog = inject(MatDialog);
  readonly httpClient = inject(HttpClient);
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  agInit(params: ICellRendererParams): void {
    this.updateSignals(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateSignals(params);

    return true;
  }

  private updateSignals(params: ICellRendererParams) {
    this.customerMaterialNumber.set(params.data['customerMaterialNumber']);
    this.customerMaterialNumberCount.set(
      params.data['customerMaterialNumberCount']
    );
    this.materialNumber.set(params.data['materialNumber']);
    this.customerNumber.set(params.data['customerNumber']);
  }

  private fetchAllCustomerMaterialNumbers(): Observable<any> {
    this.isLoading.set(true);

    return this.httpClient
      .get<
        string[]
      >(`/api/material-customer/customer-material-numbers?customerNumber=${this.customerNumber()}&materialNumber=${this.materialNumber()}`)
      .pipe(
        tap((data) => this.customerMaterialNumbers.set(data)),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      );
  }

  openDialog() {
    if (this.customerMaterialNumbers().length === 0) {
      this.fetchAllCustomerMaterialNumbers().subscribe();
    }

    this.dialog.open(CustomerMaterialNumbersModalComponent, {
      data: {
        customerMaterialNumbers: this.customerMaterialNumbers,
        isLoading: this.isLoading,
      },
      width: '500px',
    });
  }
}
