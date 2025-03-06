import { Component, Input, OnInit, TemplateRef } from '@angular/core';

import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';

/**
 * Simple table component that can handle dataContent. Four columns can be displayed by using the enum {@link TableColumns}
 * a templateRef can be provided for the selectedValue column to provide the layout that shall be displayed otherwise the selectedValue will be displayed
 * the last column will take the remaining space, the other columns will be equally distributed.
 */
@Component({
  selector: 'gq-simple-table',
  templateUrl: './simple-table.component.html',
  standalone: false,
})
export class SimpleTableComponent implements OnInit {
  /**
   * templateRef for the selectedValue column
   */
  @Input() valueTemplate: TemplateRef<any>;
  /**
   * dataSource for the table
   */
  @Input() dataSource: TableItem[];
  /**
   * The columns that shall be displayed in the table
   * possible Columns are ['description', 'selectedValue', 'value', 'additionalDescription']
   * the column for the selectedValue is supposed to be provided by the valueTemplate
   * the columns will be displayed in the order of the array
   */
  @Input() columnsToDisplay: string[];

  /**
   * The translation key  of the table so that the translations of the columnHeaders can be found
   */
  @Input() translationKey: string;

  columnWidth: string;

  ngOnInit(): void {
    // 2 columns 1/2 width, 3 columns 1/4 width, 4 columns 1/5 width the last column will take the remaining space!!!
    switch (this.columnsToDisplay.length) {
      case 2: {
        this.columnWidth = '!w-1/2';
        break;
      }
      case 3: {
        this.columnWidth = '!w-1/4';
        break;
      }
      case 4: {
        this.columnWidth = '!w-1/5';
        break;
      }
      default: {
        this.columnWidth = '!w-1/2';
      }
    }
  }
}
