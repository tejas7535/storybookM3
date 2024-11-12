import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../../../../shared/components/inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import {
  LAYOUT_IDS,
  LayoutId,
  LOCALSTORAGE_LAYOUT,
} from './column-layout-management-modal.model';

export interface ColumnLayoutManagementModalData {
  resetLayout: (layoutId: LayoutId) => any;
  saveLayout: (layoutId: LayoutId) => any;
  loadLayout: (layoutId: LayoutId) => any;
}

@Component({
  selector: 'd360-column-layout-management-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    FilterDropdownComponent,
    MatButton,
    MatDivider,
    MatIcon,
    SharedTranslocoModule,
  ],
  templateUrl: './column-layout-management-modal.component.html',
  styleUrl: './column-layout-management-modal.component.scss',
})
export class ColumnLayoutManagementModalComponent implements OnInit {
  readonly options: SelectableValue[] = [
    {
      id: '1',
      text: translate('material_customer.toolbar.layout_1'),
    },
    {
      id: '2',
      text: translate('material_customer.toolbar.layout_2'),
    },
  ];

  protected readonly displayFnText = DisplayFunctions.displayFnText;

  public layoutForm = new FormGroup({
    currentLayout: new FormControl<{ id: LayoutId; text: string }>({
      id: '1',
      text: '',
    }),
  });

  ngOnInit(): void {
    const storedLayout = this.getStoredLayout();
    this.layoutForm.setValue({
      currentLayout: {
        id: storedLayout,
        text: this.options.find((option) => option.id === storedLayout)?.text,
      },
    });
  }

  getStoredLayout(): LayoutId {
    const storedLayout = localStorage.getItem(LOCALSTORAGE_LAYOUT);
    const defaultLayoutId = '1';

    return storedLayout && LAYOUT_IDS.includes(storedLayout as LayoutId)
      ? (storedLayout as LayoutId)
      : defaultLayoutId;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ColumnLayoutManagementModalData,
    public dialog: MatDialog
  ) {}
}
