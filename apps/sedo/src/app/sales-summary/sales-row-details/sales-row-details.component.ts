import { Component, OnDestroy } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject, takeUntil } from 'rxjs';

import { Store } from '@ngrx/store';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { RowNode } from 'ag-grid-community';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';

import { UpdateDatesParams } from '../../shared/models/dates-update.model';
import { UpdateIgnoreFlagParams } from '../../shared/models/ignore-flag-update.model';
import { SalesSummary } from '../../shared/models/sales-summary.model';
import { DataService } from '../../shared/services/data/data.service';
import { IgnoreFlag } from './enums/ignore-flag.enum';
import { IgnoreFlagDialogComponent } from './ignore-flag-dialog/ignore-flag-dialog.component';

@Component({
  selector: 'sedo-sales-row-details',
  templateUrl: './sales-row-details.component.html',
})
export class SalesRowDetailsComponent
  implements ICellRendererAngularComp, OnDestroy
{
  public datesFormGroup = new UntypedFormGroup({
    eopDateControl: new UntypedFormControl('', Validators.required),
    edoDateControl: new UntypedFormControl('', Validators.required),
  });
  public rowData: SalesSummary;

  private rowNode: RowNode;
  private timedOutCloser: number;
  private superUser = '';

  private readonly shutDown$$: Subject<void> = new Subject();

  constructor(
    private readonly store: Store,
    private readonly dataService: DataService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {}

  private static convertToIsoDateString(date: string | Date): string {
    return date instanceof Date
      ? new Date(
          date.getTime() - date.getTimezoneOffset() * 60 * 1000
        ).toISOString()
      : date;
  }

  public agInit(params: any & { superUser: string }): void {
    this.superUser = params.superUser;
    this.rowData = params.data;
    this.rowNode = params.node;
    this.setSubscription();
    this.setInitialFormValues();
  }

  public ngOnDestroy(): void {
    this.shutDown$$.next();
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
            this.snackBar.open('Success: Update successful');

            resolve();
          })
          .catch(() => {
            this.snackBar.open('Error: Update failed');

            resolve();
          });
      } else {
        if (!this.datesFormGroup.get('eopDateControl').valid) {
          this.snackBar.open(
            'Warning: Cannot update with invalid or empty EOP Date field'
          );
        } else if (!this.datesFormGroup.get('edoDateControl').valid) {
          this.snackBar.open(
            'Warning: Cannot update with invalid or empty EDO Date field'
          );
        }
        resolve();
      }
    });
  }

  public async sendUpdatedIgnoreFlag(ignoreFlag: IgnoreFlag): Promise<void> {
    return new Promise<void>((resolve) => {
      const updateIgnoreFlagParams: UpdateIgnoreFlagParams = {
        combinedKey: this.rowData.combinedKey,
        ignoreFlag,
      };
      this.dataService
        .updateIgnoreFlag(updateIgnoreFlagParams)
        .then(() => {
          this.rowNode.setDataValue(
            'ignoreFlag',
            updateIgnoreFlagParams.ignoreFlag
          );

          this.snackBar.open('Success: Update successful');

          resolve();
        })
        .catch(() => {
          this.snackBar.open('Error: Update failed');

          resolve();
        });
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
    this.store
      .select(getUserUniqueIdentifier)
      .pipe(takeUntil(this.shutDown$$))
      .subscribe((userId: string) => {
        this.handleUserAccess(userId);
      });
  }

  /**
   * key users and last_modifiers can edit items
   * @param userId userId of currently logIn user
   */
  private handleUserAccess(userId: string): void {
    // keep enabled if superUser
    if (userId.toLowerCase() === this.superUser.toLowerCase()) {
      return;
    }

    // keep enabled if keyUser
    if (
      this.rowData.keyUser &&
      this.rowData.keyUser.toLowerCase() === userId.toLowerCase()
    ) {
      return;
    }

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

  public openIgnoreDialog(): void {
    const dialogRef = this.dialog.open(IgnoreFlagDialogComponent, {
      data: this.rowData.ignoreFlag,
    });

    dialogRef.afterClosed().subscribe((ignoreFlag: IgnoreFlag) => {
      if (ignoreFlag !== undefined) {
        this.sendUpdatedIgnoreFlag(ignoreFlag);
      }
    });
  }
}
