import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertRulesService } from '../../../../../../feature/alert-rules/alert-rules.service';
import {
  AlertRule,
  ExecDay,
  ExecInterval,
} from '../../../../../../feature/alert-rules/model';
import { SelectableOptionsService } from '../../../../../../shared/services/selectable-options.service';
import {
  execIntervalOptions,
  getThresholdRequirements,
  ThresholdsRequiredForAlertType,
  whenOptions,
} from '../alert-rule-edit-single-modal/alert-rule-options-config';
import { getSpecialParseFunctions } from '../alert-rule-logic-helper';

@Component({
  selector: 'app-alert-rule-delete-multi-modal',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule],
  templateUrl: './alert-rule-delete-multi-modal.component.html',
  styleUrl: './alert-rule-delete-multi-modal.component.scss',
})
export class AlertRuleDeleteMultiModalComponent {
  protected loading = this.selectableOptionsService.loading$;
  protected thresholdRequirements: ThresholdsRequiredForAlertType[] = [];
  protected alertTypes = this.selectableOptionsService.get(
    'alertTypesForRuleEditor'
  );
  protected demandPlanners =
    this.selectableOptionsService.get('demandPlanners');
  protected regionOptions = this.selectableOptionsService.get('region');
  protected sectorMgmtOptions = this.selectableOptionsService.get('sectorMgmt');
  protected salesAreaOptions = this.selectableOptionsService.get('salesArea');
  protected salesOrgOptions = this.selectableOptionsService.get('salesOrg');
  protected gkamOptions = this.selectableOptionsService.get('gkam');
  protected productLineOptions =
    this.selectableOptionsService.get('productLine');

  constructor(
    private readonly selectableOptionsService: SelectableOptionsService,
    private readonly alertRuleService: AlertRulesService,
    // private readonly translocoLocaleService: TranslocoLocaleService,
    public dialogRef: MatDialogRef<AlertRuleDeleteMultiModalComponent>
  ) {
    this.alertRuleService.getRuleTypeData().subscribe((ruleTypeData) => {
      this.thresholdRequirements = getThresholdRequirements(ruleTypeData);
    });
  }

  private readonly intervalOpts = execIntervalOptions.map((o) => ({
    id: o,
    text: translate(
      `alert_rules.edit_modal.label.interval.${o as ExecInterval}`,
      {}
    ),
  }));
  private readonly whenOpts = whenOptions.map((o) => ({
    id: o,
    text: translate(`alert_rules.edit_modal.label.when.${o as ExecDay}`, {}),
  }));

  // TODO use ErrorMessage from TableUploadModal
  // private checkData(data: AlertRule[]): ErrorMessage<AlertRule>[] {
  //   const errors: ErrorMessage<AlertRule>[] = [];
  //   data.forEach((alertRule) => {
  //     errors.push(...checkAlertRuleData(alertRule, this.thresholdRequirements));
  //   });
  //
  //   return errors;
  // }

  protected specialParseFunctionsForFields: Map<
    keyof AlertRule,
    (value: string) => string
  > = getSpecialParseFunctions(
    this.alertTypes,
    this.regionOptions,
    this.salesAreaOptions,
    this.salesOrgOptions,
    this.sectorMgmtOptions,
    this.demandPlanners,
    this.gkamOptions,
    this.productLineOptions,
    this.intervalOpts,
    this.whenOpts
  );
  // TODO handle this here check how we can use this...
  // .set('startDate', parseDateIfPossible('test', this.translocoLocaleService)).set('endDate', parseDateIfPossible('test', this.translocoLocaleService));
}
