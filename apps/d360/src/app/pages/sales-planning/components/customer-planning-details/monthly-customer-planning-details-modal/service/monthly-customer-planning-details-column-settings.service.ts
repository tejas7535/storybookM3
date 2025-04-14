import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  AbstractColumnSettingsService,
  ColumnDefinition,
} from '../../../../../../shared/services/abstract-column-settings.service';
import { getColumnDefinitions, TimeScope } from '../../column-definition';

@Injectable({ providedIn: 'root' })
export class MonthlyCustomerPlanningDetailsColumnSettingsService<
  COLUMN_KEYS extends string,
  COLDEF extends ColumnDefinition<COLUMN_KEYS>,
> extends AbstractColumnSettingsService<COLUMN_KEYS, COLDEF> {
  protected readonly tableName = 'sales-planning-customer-details-monthly';

  protected constructor(httpClient: HttpClient) {
    super(httpClient, getColumnDefinitions(TimeScope.Monthly));
    this.refreshColumnSettings$().subscribe();
  }
}
