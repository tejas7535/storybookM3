import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';

import { RowNode } from '@ag-grid-community/all-modules';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Store } from '@ngrx/store';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';
import { SnackBarService } from '@schaeffler/snackbar';

import { DataService } from '../../shared/data.service';
import { UpdateDatesParams } from '../../shared/models/dates-update.model';
import { SalesSummary } from '../../shared/models/sales-summary.model';

@Component({
  selector: 'sedo-sales-row-details',
  templateUrl: './sales-row-details.component.html',
  styleUrls: ['./sales-row-details.component.scss'],
})
export class SalesRowDetailsComponent
  implements ICellRendererAngularComp, OnDestroy
{
  public datesFormGroup = new FormGroup({
    eopDateControl: new FormControl('', Validators.required),
    edoDateControl: new FormControl('', Validators.required),
  });
  public rowData: SalesSummary;

  private rowNode: RowNode;
  private timedOutCloser: number;

  readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store,
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
    this.rowData = params.data;
    this.rowNode = params.node;
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
            this.rowNode.setDataValue(
              'eopDateVerified',
              this.datesFormGroup.get('eopDateControl').value
            );
            this.rowNode.setDataValue(
              'edoDate',
              this.datesFormGroup.get('edoDateControl').value
            );
            this.snackBarService.showSuccessMessage('Update successful');

            resolve();
          })
          .catch(() => {
            this.snackBarService.showErrorMessage('Update failed');

            resolve();
          });
      } else {
        if (!this.datesFormGroup.get('eopDateControl').valid) {
          this.snackBarService.showWarningMessage(
            'Cannot update with invalid or empty EOP Date field'
          );
        } else if (!this.datesFormGroup.get('edoDateControl').valid) {
          this.snackBarService.showWarningMessage(
            'Cannot update with invalid or empty EDO Date field'
          );
        }
        resolve();
      }
    });
  }

  private setInitialFormValues(): void {
    this.datesFormGroup
      .get('edoDateControl')
      .addValidators(this.edoValidator.bind(this));

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
      this.store.select(getUserUniqueIdentifier).subscribe((userId: string) => {
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

  private edoValidator(): ValidationErrors {
    const eopTimestamp = new Date(
      SalesRowDetailsComponent.convertToIsoDateString(
        this.datesFormGroup.get('eopDateControl').value
      )
    ).getTime();
    const edoTimestamp = new Date(
      SalesRowDetailsComponent.convertToIsoDateString(
        this.datesFormGroup.get('edoDateControl').value
      )
    ).getTime();

    return edoTimestamp < eopTimestamp ? { disallowedEdo: true } : undefined;
  }

  public iconEnter(trigger: MatMenuTrigger): void {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  public iconLeave(trigger: MatMenuTrigger): void {
    this.timedOutCloser = window.setTimeout(() => {
      trigger.closeMenu();
    }, 1500);
  }
}
