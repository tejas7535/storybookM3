import { Component, Input } from '@angular/core';

import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';

import { TranslationKey } from '../models/translation-key.enum';
import { TableColumns } from '../simple-table/models/table-columns.enum';

@Component({
  selector: 'gq-sanity-checks-table',
  templateUrl: './sanity-checks-table.component.html',
})
export class SanityChecksTableComponent {
  @Input() dataSource: TableItem[];

  readonly columns = [TableColumns.DESCRIPTION, TableColumns.VALUE];
  readonly translationKey = TranslationKey;
}
