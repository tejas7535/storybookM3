import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { BehaviorSubject, take, tap } from 'rxjs';

import { GridApi } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '../../app.routes.enum';
import { AlertRule, AlertRuleResponse } from '../../feature/alert-rules/model';
import {
  HeaderActionBarComponent,
  ProjectedContendDirective,
} from '../../shared/components/header-action-bar/header-action-bar.component';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import { AlertRuleTableComponent } from './table/components/alert-rule-table/alert-rule-table.component';
import { AlertRuleDeleteMultiModalComponent } from './table/components/modals/alert-rule-delete-multi-modal/alert-rule-delete-multi-modal.component';
import { AlertRuleEditMultiModalComponent } from './table/components/modals/alert-rule-edit-multi-modal/alert-rule-edit-multi-modal.component';
import {
  AlertRuleEditSingleModalComponent,
  AlertRuleModalProps,
} from './table/components/modals/alert-rule-edit-single-modal/alert-rule-edit-single-modal.component';

@Component({
  selector: 'd360-alert-rules',
  imports: [
    AlertRuleTableComponent,
    SharedTranslocoModule,
    HeaderActionBarComponent,
    MatButtonModule,
    ProjectedContendDirective,
    MatIcon,
    StyledSectionComponent,
  ],
  templateUrl: './alert-rules.component.html',
  styleUrl: './alert-rules.component.scss',
})
export class AlertRulesComponent implements OnDestroy, OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);

  /**
   * This behavior subject is used to trigger a reload of the table data.
   *
   * @protected
   * @memberof AlertRulesComponent
   */
  protected readonly reload$ = new BehaviorSubject<boolean>(false);

  /**
   * The DestroyRef instance used for takeUntilDestroyed().
   *
   * @private
   * @type {DestroyRef}
   * @memberof AlertRulesComponent
   */
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * The loading indicator for reloading data.
   *
   * @type {WritableSignal<boolean>}
   * @memberof AlertRulesComponent
   */
  public loading: WritableSignal<boolean> = signal(false);

  /**
   * The grid api instance.
   *
   * @protected
   * @type {(GridApi | null)}
   * @memberof AlertRulesComponent
   */
  protected gridApi: GridApi | null = null;

  /**
   * Opens the AlertRuleEditSingleModal.
   *
   * @protected
   * @memberof AlertRulesComponent
   */
  protected handleCreateSingleAlertRule(data?: AlertRule): void {
    this.dialog
      .open(AlertRuleEditSingleModalComponent, {
        data: {
          alertRule: {
            ...(data ?? {
              deactivated: false,
              id: '00000000-0000-0000-0000-000000000000',
              startDate: new Date(Date.now()),
              endDate: new Date('9999-12-31'),
              generation: 'R',
            }),
          },
          title: data?.id ? 'edit' : 'create',
        } as AlertRuleModalProps,
        disableClose: true,
        autoFocus: false,
        panelClass: ['form-dialog', 'alert-rule'],
      })
      .afterClosed()
      .pipe(
        tap((response: AlertRuleResponse[]) =>
          this.gridApi?.applyTransaction(
            data?.id ? { update: response } : { add: response }
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Opens the AlertRuleEditMultiModal.
   *
   * @protected
   * @memberof AlertRulesComponent
   */
  protected handleCreateMultiAlertRule(): void {
    this.dialog
      .open(AlertRuleEditMultiModalComponent, {
        disableClose: true,
        panelClass: ['table-dialog', 'alert-rule'],
        autoFocus: false,
        maxHeight: 'calc(100% - 64px)',
        maxWidth: 'none',
        width: 'calc(100% - 64px)',
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((reloadData: boolean) => reloadData && this.reload$.next(true)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Open the AlertRuleDeleteMultiModal.
   *
   * @protected
   * @memberof AlertRulesComponent
   */
  protected handleDeleteMultiAlertRule(): void {
    this.dialog
      .open(AlertRuleDeleteMultiModalComponent, {
        disableClose: true,
        panelClass: ['table-dialog', 'alert-rule'],
        autoFocus: false,
        maxHeight: 'calc(100% - 64px)',
        maxWidth: 'none',
        width: 'calc(100% - 64px)',
      })
      .afterClosed()
      .pipe(
        take(1),
        tap((reloadData: boolean) => reloadData && this.reload$.next(true)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    // close all open dialogs
    this.dialog.closeAll();
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    try {
      const urlData: {
        customerNumber: string | null;
        materialNumber: string | null;
        createNewTask?: boolean;
      } | null = JSON.parse(
        sessionStorage.getItem(AppRoutePath.AlertRuleManagementPage) || 'null'
      );

      if (urlData?.createNewTask) {
        this.handleCreateSingleAlertRule(urlData as AlertRule);
      }
    } catch (error: unknown) {
      console.error(error);
    }
  }
}
