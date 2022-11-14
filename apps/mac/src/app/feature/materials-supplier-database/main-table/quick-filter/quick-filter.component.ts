import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { filter, Observable, Subject, takeUntil } from 'rxjs';

import { PushModule } from '@ngrx/component';
import { ColumnApi, ColumnState, GridApi } from 'ag-grid-community';
import {} from 'ag-grid-community/dist/lib/events';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { QuickFilter } from '@mac/msd/models';
import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
} from '@mac/msd/services';
import {
  addCustomQuickfilter,
  removeCustomQuickfilter,
  updateCustomQuickfilter,
} from '@mac/msd/store/actions/quickfilter/quickfilter.actions';
import { DataFacade, QuickFilterFacade } from '@mac/msd/store/facades';

import { QuickfilterDialogComponent } from './quickfilter-dialog/quickfilter-dialog.component';

@Component({
  selector: 'mac-quick-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonToggleModule,

    PushModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedTranslocoModule,
  ],
  templateUrl: './quick-filter.component.html',
})
export class QuickFilterComponent implements OnDestroy, OnInit {
  private agGridApi: GridApi;
  private agGridColumnApi: ColumnApi;

  private readonly destroy$ = new Subject<void>();

  // stores currently selected element (bound to ToggleComponent)
  public active: QuickFilter;
  private activeEdit: QuickFilter = undefined;
  // list of predifined filters
  public staticFilters: QuickFilter[];
  // list of custom user filters
  public customFilters$: Observable<QuickFilter[]>;

  constructor(
    private readonly qfFacade: QuickFilterFacade,
    private readonly dataFacade: DataFacade,
    private readonly msdAgGridReadyService: MsdAgGridReadyService,
    private readonly msdAgGridConfigService: MsdAgGridConfigService,
    public dialog: MatDialog
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    // create a copy of the static filters to modify first item
    this.dataFacade.materialClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe((materialClass) => {
        this.staticFilters =
          this.msdAgGridConfigService.getStaticQuickFilters(materialClass);
        this.customFilters$ = this.qfFacade.quickFilter$;
        this.active = this.staticFilters[0];
      });

    this.msdAgGridReadyService.agGridApi
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ gridApi, columnApi }) =>
        this.onAgGridReady(gridApi, columnApi)
      );
  }

  // event propagated when agGrid table has bin initialized
  private onAgGridReady(gridApi: GridApi, columnApi: ColumnApi) {
    this.agGridApi = gridApi;
    this.agGridColumnApi = columnApi;

    // subscribe to updates of visible columns and update active quickfilter
    this.dataFacade.agGridColumns$
      .pipe(
        // verify only modified filter will result in an update - and not the change itself
        filter(
          () =>
            !!this.active &&
            JSON.stringify(this.getCurrentColumns()) !==
              JSON.stringify(this.active.columns)
        )
      )
      .subscribe(() => this.onChange());
    // subscribe to updates of applied filters and update active quickfilter
    this.dataFacade.agGridFilter$
      .pipe(
        // verify only modified columns will result in an update - and not the change itself
        filter(
          (json) =>
            !!this.active &&
            JSON.stringify(json) !== JSON.stringify(this.active.filter)
        )
      )
      .subscribe(() => this.onChange());
  }

  // apply changes to columns and filters to active element
  private onChange(): void {
    if (this.active.custom) {
      // update quickfilter in store
      const oldFilter = this.active;
      const newFilter = this.agGridToFilter(this.active.title);
      this.qfFacade.dispatch(updateCustomQuickfilter({ oldFilter, newFilter }));
      this.active = newFilter;
    } else {
      // reset selection on predefined items after modification
      this.reset();
    }
  }

  // event triggered on selection of button group
  public onQuickfilterSelect(event: MatButtonToggleChange) {
    const selected = event.value as QuickFilter;
    this.applyQuickFilter(selected);
  }

  // apply selected quickfilter
  private applyQuickFilter(selected: QuickFilter): void {
    this.active = selected;
    const visible = selected.columns;
    // setup visibility and order of columns based on selected elements
    const state: ColumnState[] = this.agGridColumnApi
      .getColumns()
      .map((col) => ({
        colId: col.getColId(),
        hide: !visible.includes(col.getColId()),
      }))
      .sort((a, b) => visible.indexOf(a.colId) - visible.indexOf(b.colId));
    // set filter and columns in agGrid api
    this.agGridApi.setFilterModel(selected.filter);
    this.agGridColumnApi.applyColumnState({ state, applyOrder: true });
  }

  // reset active element
  private reset() {
    this.active = this.staticFilters[0];
  }

  // get list of visible columns from current agGrid configuration
  private getCurrentColumns(): string[] {
    return this.agGridColumnApi
      .getColumnState()
      .filter((state) => !state.hide)
      .map((state) => state.colId);
  }

  openDialog(selected?: QuickFilter, deleted: boolean = false): void {
    this.activeEdit = selected;
    const dialogRef = this.dialog.open(QuickfilterDialogComponent, {
      width: '500px',
      autoFocus: false,
      data: { title: selected?.title, edit: !!selected, delete: deleted },
    });

    // this version will still provide type inference with current component, otherwise "this" would be the event object.
    dialogRef.afterClosed().subscribe((result) => this.onDialogClose(result));
  }

  // triggered by close event of dialog
  private onDialogClose(result?: {
    title: string;
    fromCurrent: string;
    edit: boolean;
    delete: boolean;
  }) {
    // result will be undefined on "Cancel"
    if (result) {
      if (result.delete) {
        // delete filter
        if (this.active === this.activeEdit) {
          this.reset();
        }
        const oldFilter = this.activeEdit;
        this.qfFacade.dispatch(removeCustomQuickfilter({ filter: oldFilter }));
      } else if (result.edit) {
        // edit filter name
        const oldFilter = this.activeEdit;
        const newFilter = { ...oldFilter, title: result.title };
        this.qfFacade.dispatch(
          updateCustomQuickfilter({ oldFilter, newFilter })
        );
      } else {
        const title = result.title;
        // add new filter
        const fromCurrent: boolean = result.fromCurrent === 'true';
        const newFilter: QuickFilter = fromCurrent
          ? this.agGridToFilter(title)
          : this.copyDefaultFilter(title);
        this.applyQuickFilter(newFilter);
        this.qfFacade.dispatch(addCustomQuickfilter({ filter: newFilter }));
      }
    }
    this.activeEdit = undefined;
  }

  // get current aggrid configuration to a Quickfilter
  private agGridToFilter(title: string): QuickFilter {
    return {
      columns: this.getCurrentColumns(),
      filter: this.agGridApi.getFilterModel(),
      title,
      custom: true,
    };
  }

  // copy default Quickfilter to a new object
  private copyDefaultFilter(title: string): QuickFilter {
    return {
      ...this.staticFilters[0],
      title,
      custom: true,
    };
  }

  // add a custom quickfilter
  public add() {
    this.openDialog();
  }

  // edit title of an existing quickfilter
  public edit(quickFilter: QuickFilter): void {
    this.openDialog(quickFilter);
  }

  // remove custom quickfilter
  public remove(quickFilter: QuickFilter): void {
    this.openDialog(quickFilter, true);
  }
}
