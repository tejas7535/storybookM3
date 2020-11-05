import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import { pasteRowDataItems } from '../../../core/store';
import { CaseTableItem } from '../../../core/store/models';
import { CaseState } from '../../../core/store/reducers/create-case/create-case.reducer';
import {
  COLUMN_DEFS,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'gq-input-table',
  templateUrl: './input-table.component.html',
  styleUrls: ['./input-table.component.scss'],
})
export class InputTableComponent {
  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = COLUMN_DEFS;
  public statusBar = STATUS_BAR_CONFIG;
  public frameworkComponents = FRAMEWORK_COMPONENTS;

  private currentCell: CaseTableItem;

  @Input() rowData: any[];
  constructor(private readonly store: Store<CaseState>) {}

  async onPasteStart(): Promise<void> {
    const text = await navigator.clipboard.readText();
    const linesArray = text
      // split by lines
      .split(/\r?\n/)
      // split by tab
      .map((el) => el.split('\t'))
      // remove empty objects
      .filter(
        (el) => (el[0] && el[0].length > 0) || (el[1] && el[1].length > 0)
      );

    const tableArray = linesArray.map((el) => {
      const item: CaseTableItem = {
        materialNumber: el[0],
        quantity: el[1],
      };

      return item;
    });
    this.store.dispatch(
      pasteRowDataItems({
        items: tableArray,
        pasteDestination: this.currentCell,
      })
    );
    this.currentCell = undefined;
  }
  onCellClicked(params: any): void {
    this.currentCell = params.data;
  }
}
