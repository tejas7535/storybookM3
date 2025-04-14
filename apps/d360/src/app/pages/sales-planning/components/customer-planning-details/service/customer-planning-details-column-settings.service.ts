import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  AbstractColumnSettingsService,
  ColumnDefinition,
} from '../../../../../shared/services/abstract-column-settings.service';
import { getColumnDefinitions, TimeScope } from '../column-definition';

@Injectable({ providedIn: 'root' })
export class YearlyCustomerPlanningDetailsColumnSettingsService<
  COLUMN_KEYS extends string,
  COLDEF extends ColumnDefinition<COLUMN_KEYS>,
> extends AbstractColumnSettingsService<COLUMN_KEYS, COLDEF> {
  protected readonly tableName = 'sales-planning-customer-details-yearly';

  protected constructor(httpClient: HttpClient) {
    super(httpClient, getColumnDefinitions(TimeScope.Yearly));
    this.refreshColumnSettings$().subscribe();
  }
}
