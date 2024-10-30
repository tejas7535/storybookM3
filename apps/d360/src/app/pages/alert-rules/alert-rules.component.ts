import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { EMPTY, Observable, switchMap, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertRulesService } from '../../feature/alert-rules/alert-rules.service';
import { AlertRule, AlertRuleResponse } from '../../feature/alert-rules/model';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import {
  HeaderActionBarComponent,
  ProjectedContendDirective,
} from '../../shared/components/header-action-bar/header-action-bar.component';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { AlertRuleTableComponent } from './table/components/alert-rule-table/alert-rule-table.component';
import { AlertRuleDeleteMultiModalComponent } from './table/components/modals/alert-rule-delete-multi-modal/alert-rule-delete-multi-modal.component';
import { AlertRuleEditMultiModalComponent } from './table/components/modals/alert-rule-edit-multi-modal/alert-rule-edit-multi-modal.component';
import {
  AlertRuleEditSingleModalComponent,
  AlertRuleModalProps,
} from './table/components/modals/alert-rule-edit-single-modal/alert-rule-edit-single-modal.component';

@Component({
  selector: 'app-alert-rules',
  standalone: true,
  imports: [
    AlertRuleTableComponent,
    SharedTranslocoModule,
    HeaderActionBarComponent,
    MatButtonModule,
    ActionButtonComponent,
    ProjectedContendDirective,
    MatIcon,
    PushPipe,
    LoadingSpinnerModule,
  ],
  templateUrl: './alert-rules.component.html',
  styleUrl: './alert-rules.component.scss',
})
export class AlertRulesComponent implements OnDestroy {
  @ViewChild('alertRuleTableComponent')
  protected alertRuleTableComponent: AlertRuleTableComponent;
  private readonly alertRuleService: AlertRulesService =
    inject(AlertRulesService);
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

  constructor(
    private readonly dialog: MatDialog,
    protected readonly selectableOptionsService: SelectableOptionsService
  ) {}

  // TODO use as page title --> like Page does in the react application
  protected readonly title = `${translate('tabbar.functions.label', {})} | ${translate(
    'tabbarMenu.alert-rule-editor.label',
    {}
  )}`;

  /**
   * Opens the AlertRuleEditSingleModal.
   *
   * @protected
   * @memberof AlertRulesComponent
   */
  protected handleCreateSingleAlertRule(data?: AlertRule) {
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
        switchMap((reloadData: boolean) =>
          reloadData ? this.reloadData$() : EMPTY
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  handleCreateMultiAlertRule() {
    this.dialog
      .open(AlertRuleEditMultiModalComponent, {
        // disableClose: true,
      })
      .afterClosed()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // TODO implement updateData
      });
  }

  handleDeleteMultiAlertRule() {
    this.dialog
      .open(AlertRuleDeleteMultiModalComponent, {
        // disableClose: true,
      })
      .afterClosed()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // TODO implement updateData
      });
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
   * @private
   * @return {Observable<AlertRuleResponse>}
   * @memberof AlertRulesComponent
   */
  private reloadData$(): Observable<AlertRuleResponse> {
    this.loading.set(true);

    return this.alertRuleService.getAlertRuleData().pipe(
      tap((response: AlertRuleResponse) => {
        if (response?.content) {
          this.alertRuleTableComponent?.grid?.api?.setRowData(response.content);
        }
        this.loading.set(false);
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
