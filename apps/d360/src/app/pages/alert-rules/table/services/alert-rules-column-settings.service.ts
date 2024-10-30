import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  AbstractColumnSettingsService,
  ColumnDefinition,
} from '../../../../shared/services/abstract-column-settings.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { alertRuleColumnDefinitions } from '../column-definition';

@Injectable({
  providedIn: 'root',
})
export class AlertRulesColumnSettingsService<
  COLUMN_KEYS extends string,
  COLDEF extends ColumnDefinition<COLUMN_KEYS>,
> extends AbstractColumnSettingsService<COLUMN_KEYS, COLDEF> {
  tableName = 'alert-rules';

  constructor(
    httpClient: HttpClient,
    agGridLocalizationService: AgGridLocalizationService
  ) {
    super(httpClient, alertRuleColumnDefinitions(agGridLocalizationService));
    this.refreshColumnSettings();
  }
}
