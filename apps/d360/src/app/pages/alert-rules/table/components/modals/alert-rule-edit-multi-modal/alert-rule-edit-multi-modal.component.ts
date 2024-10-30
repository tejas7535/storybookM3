import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertRulesService } from '../../../../../../feature/alert-rules/alert-rules.service';
import {
  AlertRule,
  AlertRuleSaveResponse,
  ExecDay,
  ExecInterval,
} from '../../../../../../feature/alert-rules/model';
import { SelectableOptionsService } from '../../../../../../shared/services/selectable-options.service';
import {
  errorsFromSAPtoMessage,
  PostResult,
} from '../../../../../../shared/utils/error-handling';
import {
  execIntervalOptions,
  getThresholdRequirements,
  ThresholdsRequiredForAlertType,
  whenOptions,
} from '../alert-rule-edit-single-modal/alert-rule-options-config';
import {
  ErrorMessage,
  getSpecialParseFunctions,
} from '../alert-rule-logic-helper';

@Component({
  selector: 'app-alert-rule-multi-modal',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule],
  templateUrl: './alert-rule-edit-multi-modal.component.html',
  styleUrl: './alert-rule-edit-multi-modal.component.scss',
})
export class AlertRuleEditMultiModalComponent {
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
    public dialogRef: MatDialogRef<AlertRuleEditMultiModalComponent>
  ) {
    this.alertRuleService
      .getRuleTypeData()
      .subscribe(
        (res) => (this.thresholdRequirements = getThresholdRequirements(res))
      );
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

  protected parseErrors(
    res: PostResult<AlertRuleSaveResponse>
  ): ErrorMessage<AlertRule>[] {
    const errors: ErrorMessage<AlertRule>[] = [];
    res.response.forEach((r) => {
      if (r.result.messageType === 'ERROR') {
        errors.push({
          dataIdentifier: {
            // Ignore ID here because it will be changed for new Alert Rules
            type: r.type,
            region: r.region,
            salesArea: r.salesArea,
            salesOrg: r.salesOrg,
            customerNumber: r.customerNumber,
            materialNumber: r.materialNumber,
            materialClassification: r.materialClassification,
            sectorManagement: r.sectorManagement,
            demandPlannerId: r.demandPlannerId,
            productionLine: r.productionLine,
            productLine: r.productLine,
            gkamNumber: r.gkamNumber,
            demandPlanner: r.demandPlannerId,
          },
          errorMessage: errorsFromSAPtoMessage(r.result),
        });
      }
    });

    return errors;
  }
}
