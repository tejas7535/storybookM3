import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import { pasteRowDataItemsToAddMaterial } from '../../../core/store';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../core/store/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import {
  COLUMN_DEFS,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'gq-add-material-input-table',
  templateUrl: './add-material-input-table.component.html',
  styleUrls: ['./add-material-input-table.component.scss'],
})
export class AddMaterialInputTableComponent {
  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = COLUMN_DEFS;
  public statusBar = STATUS_BAR_CONFIG;
  public frameworkComponents = FRAMEWORK_COMPONENTS;

  private currentCell: MaterialTableItem;

  @Input() rowData: any[];
  constructor(private readonly store: Store<ProcessCaseState>) {}

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
      const item: MaterialTableItem = {
        materialNumber: el[0],
        quantity: el[1],
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      };

      return item;
    });
    this.store.dispatch(
      pasteRowDataItemsToAddMaterial({
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
