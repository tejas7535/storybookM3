import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GridApi } from '@ag-grid-community/all-modules';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { select, Store } from '@ngrx/store';

import { getClaim } from '@schaeffler/auth';
import { SnackBarService } from '@schaeffler/snackbar';

import { AppState } from '../../core/store';
import { SalesSummary } from '../../core/store/reducers/sales-summary/models/sales-summary.model';
import { DataService } from '../../shared/data.service';
import { UpdateDatesParams } from '../../shared/models/dates-update.model';

@Component({
  selector: 'seli-sales-row-details',
  templateUrl: './sales-row-details.component.html',
  styleUrls: ['./sales-row-details.component.scss'],
})
export class SalesRowDetailsComponent implements ICellRendererAngularComp {
  public datesFormGroup = new FormGroup({
    eopDateControl: new FormControl('', Validators.required),
    edoDateControl: new FormControl('', Validators.required),
  });
  public rowData: SalesSummary;
  public uniqueUserName: string;

  public gridApi: GridApi;

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
    this.setUniqueUserName();
    this.setInitialFormValues();
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
            this.gridApi.purgeServerSideCache();
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

  private setUniqueUserName(): void {
    this.store.pipe(select(getClaim('upn'))).subscribe((upn: string) => {
      this.uniqueUserName = upn.split('@')[0];
      if (this.rowData.lastModifier !== this.uniqueUserName) {
        this.datesFormGroup.disable();
      }
    });
  }
}
