import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { GridApi } from '@ag-grid-community/all-modules';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { select, Store } from '@ngrx/store';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';
import { SnackBarService } from '@schaeffler/snackbar';

import { AppState } from '../../core/store';
import { SalesSummary } from '../../core/store/reducers/sales-summary/models/sales-summary.model';
import { DataService } from '../../shared/data.service';
import { UpdateDatesParams } from '../../shared/models/dates-update.model';

@Component({
  selector: 'sedo-sales-row-details',
  templateUrl: './sales-row-details.component.html',
  styleUrls: ['./sales-row-details.component.scss'],
})
export class SalesRowDetailsComponent
  implements ICellRendererAngularComp, OnDestroy {
  public datesFormGroup = new FormGroup({
    eopDateControl: new FormControl('', Validators.required),
    edoDateControl: new FormControl('', Validators.required),
  });
  public rowData: SalesSummary;

  public gridApi: GridApi;

  readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store<AppState>,
    private readonly dataService: DataService,
    private readonly snackBarService: SnackBarService
  ) {}

  private static convertToIsoDateString(date: string | Date): string {
    return date instanceof Date
      ? new Date(
          date.getTime() - date.getTimezoneOffset() * 60 * 1000
        ).toISOString()
      : date;
  }

  public agInit(params: any): void {
    this.gridApi = params.api;
    this.rowData = params.data;
    this.setSubscription();
    this.setInitialFormValues();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Is currently not being called but needed to fulfill the ICellRendererAngularComp interface
  public refresh(_params: any): boolean {
    return false;
  }

  public async sendUpdatedDates(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.datesFormGroup.valid) {
        const updateDatesParams = new UpdateDatesParams(
          this.rowData.combinedKey,
          SalesRowDetailsComponent.convertToIsoDateString(
            this.datesFormGroup.get('eopDateControl').value
          ),
          SalesRowDetailsComponent.convertToIsoDateString(
            this.datesFormGroup.get('edoDateControl').value
          )
        );

        this.dataService
          .updateDates(updateDatesParams)
          .then(() => {
            this.gridApi.refreshServerSideStore({ purge: true });
            this.snackBarService
              .showSuccessMessage('Update successful')
              .subscribe();

            resolve();
          })
          .catch(() => {
            this.snackBarService.showErrorMessage('Update failed').subscribe();

            resolve();
          });
      }
    });
  }

  private setInitialFormValues(): void {
    this.datesFormGroup.setValue({
      eopDateControl:
        this.rowData.eopDateTemp !== null
          ? this.rowData.eopDateTemp
          : this.rowData.eopDateVerified,
      edoDateControl: this.rowData.edoDate,
    });

    this.datesFormGroup.markAsPristine();
  }

  private setSubscription(): void {
    this.subscription.add(
      this.store
        .pipe(select(getUserUniqueIdentifier))
        .subscribe((userId: string) => {
          this.handleUserAccess(userId);
        })
    );
  }

  private handleUserAccess(userId: string): void {
    if (
      !this.rowData.lastModifier ||
      this.rowData.lastModifier.toLowerCase() !== userId.toLowerCase()
    ) {
      this.datesFormGroup.disable();
    }
  }
}
