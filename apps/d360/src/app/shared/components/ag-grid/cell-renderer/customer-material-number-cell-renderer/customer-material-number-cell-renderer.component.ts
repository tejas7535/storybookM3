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
import { ICellRendererParams } from 'ag-grid-enterprise';

import { CustomerMaterialNumbersModalComponent } from './modal/customer-material-numbers-modal.component';

@Component({
  selector: 'd360-customer-material-number-cell-renderer',
  templateUrl: './customer-material-number-cell-renderer.component.html',
  styleUrls: ['./customer-material-number-cell-renderer.component.scss'],
  imports: [MatIconModule, MatDialogModule],
})
export class CustomerMaterialNumberCellRendererComponent
  implements ICellRendererAngularComp
{
  protected customerMaterialNumber = '';
  protected customerMaterialNumberCount = 0;

  private materialNumber = '';
  private customerNumber = '';

  private readonly isLoading: WritableSignal<boolean> = signal(false);
  private readonly customerMaterialNumbers: WritableSignal<string[]> = signal(
    []
  );

  private readonly dialog = inject(MatDialog);
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public agInit(params: ICellRendererParams): void {
    this.updateData(params);
  }

  public refresh(params: ICellRendererParams): boolean {
    this.updateData(params);

    return true;
  }

  private updateData(params: ICellRendererParams) {
    this.customerMaterialNumber = params.data['customerMaterialNumber'];
    this.customerMaterialNumberCount =
      params.data['customerMaterialNumberCount'];
    this.materialNumber = params.data['materialNumber'];
    this.customerNumber = params.data['customerNumber'];
  }

  private fetchAllCustomerMaterialNumbers(): Observable<any> {
    this.isLoading.set(true);

    return this.httpClient
      .get<
        string[]
      >(`/api/material-customer/customer-material-numbers?customerNumber=${this.customerNumber}&materialNumber=${this.materialNumber}`)
      .pipe(
        tap((data) => this.customerMaterialNumbers.set(data)),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      );
  }

  protected openDialog(): void {
    if (this.customerMaterialNumbers.length === 0) {
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
