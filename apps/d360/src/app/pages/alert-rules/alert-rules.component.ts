import { Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    MatButton,
    ActionButtonComponent,
    ProjectedContendDirective,
    MatIcon,
    PushPipe,
    LoadingSpinnerModule,
  ],
  templateUrl: './alert-rules.component.html',
  styleUrl: './alert-rules.component.scss',
})
export class AlertRulesComponent {
  @ViewChild('alertRuleTableComponent')
  protected alertRuleTableComponent: AlertRuleTableComponent;

  protected loading$;

  constructor(
    private readonly dialog: MatDialog,
    private readonly selectableOptionsService: SelectableOptionsService
  ) {
    this.loading$ = this.selectableOptionsService.loading$;
  }

  // TODO use as page title --> like Page does in the react application
  protected readonly title = `${translate('tabbar.functions.label', {})} | ${translate(
    'tabbarMenu.alert-rule-editor.label',
    {}
  )}`;

  handleCreateSingleAlertRule() {
    const dialogRef = this.dialog.open(AlertRuleEditSingleModalComponent, {
      data: {
        gridApi: this.alertRuleTableComponent.gridApi,
        alertRule: {
          deactivated: false,
          id: '00000000-0000-0000-0000-000000000000',
          startDate: new Date(Date.now()),
          endDate: new Date('9999-12-31'),
          generation: 'R',
        },
        title: 'create',
      } as AlertRuleModalProps,
      disableClose: true,
    });

    // TODO check if this works we need to update the row data in ag-grid
    dialogRef.afterClosed().subscribe((_result) => {
      // TODO implement updateData
    });
  }

  handleCreateMultiAlertRule() {
    const dialogRef = this.dialog.open(AlertRuleEditMultiModalComponent, {
      disableClose: true,
    });

    // TODO check if this works we need to update the row data in ag-grid
    dialogRef.afterClosed().subscribe((_esult) => {
      // TODO implement updateData
    });
  }

  handleDeleteMultiAlertRule() {
    const dialogRef = this.dialog.open(AlertRuleDeleteMultiModalComponent, {
      disableClose: true,
    });

    // TODO check if this works we need to update the row data in ag-grid
    dialogRef.afterClosed().subscribe((_result) => {
      // TODO implement updateData
    });
  }
}
