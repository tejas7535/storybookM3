import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

import { TranslationKey } from '../models/translation-key.enum';
import { TableColumns } from '../simple-table/models/table-columns.enum';

@Component({
  selector: 'gq-technical-value-drivers-table',
  templateUrl: './technical-value-drivers-table.component.html',
})
export class TechnicalValueDriversTableComponent {
  @Input() dataSource: TableItem[];
  @Output() technicalValueDriversChange = new EventEmitter<TableItem>();

  private readonly featureToggleService = inject(FeatureToggleConfigService);

  readonly columns = [
    TableColumns.DESCRIPTION,
    ...(this.featureToggleService.isEnabled('editTechnicalValueDriver')
      ? [TableColumns.SELECTED_VALUE]
      : []),
    TableColumns.VALUE,
    TableColumns.ADDITIONAL_DESCRIPTION,
  ];
  readonly translationKey = TranslationKey;

  onTechnicalValueDriversValueChange(changedValue: number, id: number): void {
    const changedTechnicalValueDriver = this.dataSource.find(
      (item) => item.id === id
    );

    if (changedTechnicalValueDriver) {
      this.technicalValueDriversChange.emit({
        ...changedTechnicalValueDriver,
        editableValue: changedValue,
      });
    }
  }
}
