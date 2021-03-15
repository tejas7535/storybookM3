import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  pasteRowDataItems,
  pasteRowDataItemsToAddMaterial,
} from '../../../core/store';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../core/store/models';
import { CaseState } from '../../../core/store/reducers/create-case/create-case.reducer';
import {
  COLUMN_DEFS,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'gq-material-input-table',
  templateUrl: './input-table.component.html',
  styleUrls: ['./input-table.component.scss'],
})
export class InputTableComponent implements OnInit {
  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = COLUMN_DEFS;
  public statusBar = STATUS_BAR_CONFIG;
  public frameworkComponents = FRAMEWORK_COMPONENTS;

  private currentCell: MaterialTableItem;

  @Input() isCaseView: boolean;
  @Input() rowData: any[];
  constructor(private readonly store: Store<CaseState>) {}

  ngOnInit(): void {
    if (!this.isCaseView) {
      this.statusBar.statusPanels[0] = {
        statusPanel: 'addMaterialButtonComponent',
        align: 'left',
      };
    }
  }

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
      // Check for valid quantity
      const parsedQuantity = el[1] ? parseInt(el[1].trim(), 10) : 0;

      const item: MaterialTableItem = {
        materialNumber: el[0].trim(),
        quantity: parsedQuantity > 0 ? parsedQuantity : 0,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      };

      return item;
    });
    this.isCaseView
      ? this.store.dispatch(
          pasteRowDataItems({
            items: tableArray,
            pasteDestination: this.currentCell,
          })
        )
      : this.store.dispatch(
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
