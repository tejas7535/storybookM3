import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { catchError, EMPTY, Observable, switchMap, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { GridApi } from 'ag-grid-community';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertRulesService } from '../../feature/alert-rules/alert-rules.service';
import { AlertRule, AlertRuleResponse } from '../../feature/alert-rules/model';
import { TableToolbarComponent } from '../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import {
  HeaderActionBarComponent,
  ProjectedContendDirective,
} from '../../shared/components/header-action-bar/header-action-bar.component';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { AlertRuleTableComponent } from './table/components/alert-rule-table/alert-rule-table.component';
import { AlertRuleDeleteMultiModalComponent } from './table/components/modals/alert-rule-delete-multi-modal/alert-rule-delete-multi-modal.component';
import { AlertRuleEditMultiModalComponent } from './table/components/modals/alert-rule-edit-multi-modal/alert-rule-edit-multi-modal.component';
import {
  AlertRuleEditSingleModalComponent,
  AlertRuleModalProps,
} from './table/components/modals/alert-rule-edit-single-modal/alert-rule-edit-single-modal.component';

@Component({
  selector: 'd360-alert-rules',
  standalone: true,
  imports: [
    AlertRuleTableComponent,
    SharedTranslocoModule,
    HeaderActionBarComponent,
    MatButtonModule,
    ProjectedContendDirective,
    MatIcon,
    PushPipe,
    LoadingSpinnerModule,
    StyledSectionComponent,
    TableToolbarComponent,
  ],
  templateUrl: './alert-rules.component.html',
  styleUrl: './alert-rules.component.scss',
})
export class AlertRulesComponent implements OnDestroy {
  private readonly alertRuleService: AlertRulesService =
    inject(AlertRulesService);
  private readonly dialog: MatDialog = inject(MatDialog);
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);

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

  // TODO: Move the translation strings for the page title (Browser Tabbar) to the Routes and implement a TitleStrategy to translate them
  public readonly title = `${translate('tabbar.functions.label', {})} | ${translate(
    'tabbarMenu.alert-rule-editor.label',
    {}
  )}`;

  protected hasFilters(): boolean {
    if (!this.gridApi) {
      return false;
    }

    return Object.keys(this.gridApi.getFilterModel()).length > 0;
  }

  /**
   * Receive the grid api.
   *
   * @protected
   * @param {GridApi} api
   * @memberof AlertRulesComponent
   */
  protected getApi(api: GridApi): void {
    this.gridApi = api;
  }

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
        switchMap((reloadData: boolean) =>
          reloadData ? this.loadData$() : EMPTY
        ),
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
        switchMap((reloadData: boolean) =>
          reloadData ? this.loadData$() : EMPTY
        ),

        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * @inheritdoc
   */
  public ngOnDestroy(): void {
    // close all open dialogs
    this.dialog.closeAll();
  }

  /**
   * Reloads the data and sets them to the available grid
   *
   * @protected
   * @return {Observable<AlertRuleResponse>}
   * @memberof AlertRulesComponent
   */
  protected loadData$(): Observable<AlertRuleResponse> {
    this.gridApi?.showLoadingOverlay();

    // TODO: use setGridOption instead of showLoadingOverlay when ag-grid is updated to v31
    // this.gridApi?.setGridOption('loading', true);

    return this.alertRuleService.getAlertRuleData().pipe(
      tap((response: AlertRuleResponse) => {
        if (response?.content) {
          this.gridApi?.setRowData(response.content);
        }
        this.gridApi?.hideOverlay();

        // TODO: use setGridOption instead of hideOverlay when ag-grid is updated to v31
        // this.gridApi?.setGridOption('loading', false);
      }),
      catchError(() => {
        this.gridApi?.hideOverlay();
        // TODO: use setGridOption instead of hideOverlay when ag-grid is updated to v31
        // this.gridApi?.setGridOption('loading', false);

        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
