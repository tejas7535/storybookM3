import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

import { filter, Observable, Subject, takeUntil } from 'rxjs';

import { PushPipe } from '@ngrx/component';
import { ColumnApi, ColumnState, GridApi } from 'ag-grid-community';
import {} from 'ag-grid-community/dist/lib/events';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  ACTION,
  HISTORY,
  RECENT_STATUS,
  RELEASED_STATUS,
} from '@mac/msd/constants';
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
import { DataFacade } from '@mac/msd/store/facades/data';
import { QuickFilterFacade } from '@mac/msd/store/facades/quickfilter';

import { QuickfilterDialogComponent } from './quickfilter-dialog/quickfilter-dialog.component';

@Component({
  selector: 'mac-quick-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonToggleModule,

    PushPipe,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedTranslocoModule,
  ],
  templateUrl: './quick-filter.component.html',
})
export class QuickFilterComponent implements OnDestroy, OnInit {
  // stores currently selected element (bound to ToggleComponent)
  public active: QuickFilter;
  // list of predifined filters
  public staticFilters: QuickFilter[];
  // list of custom user filters
  public customFilters$: Observable<QuickFilter[]>;

  private agGridApi: GridApi;
  private agGridColumnApi: ColumnApi;

  private readonly destroy$ = new Subject<void>();

  private readonly IGNORE_COLUMNS = new Set([
    HISTORY,
    ACTION,
    RECENT_STATUS,
    RELEASED_STATUS,
  ]);

  private activeEdit: QuickFilter = undefined;

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
    this.dataFacade.navigation$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ({ materialClass, navigationLevel }) =>
            !!materialClass && !!navigationLevel
        )
      )
      .subscribe(({ materialClass, navigationLevel }) => {
        this.staticFilters = this.msdAgGridConfigService.getStaticQuickFilters(
          materialClass,
          navigationLevel
        );
        this.customFilters$ = this.qfFacade.quickFilter$;
        this.active = this.staticFilters[0];
      });

    this.msdAgGridReadyService.agGridApi
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ gridApi, columnApi }) =>
        this.onAgGridReady(gridApi, columnApi)
      );
  }

  // event triggered on selection of button group
  public onQuickfilterSelect(event: MatButtonToggleChange) {
    const selected = event.value as QuickFilter;
    this.applyQuickFilter(selected);
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
            JSON.stringify(
              this.getCurrentColumns().filter(
                (column) => !this.IGNORE_COLUMNS.has(column)
              )
            ) !==
              JSON.stringify(
                this.active.columns.filter(
                  (column) => !this.IGNORE_COLUMNS.has(column)
                )
              )
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

  // apply selected quickfilter
  private applyQuickFilter(selected: QuickFilter): void {
    this.active = selected;
    const visible = selected.columns;
    // setup visibility and order of columns based on selected elements
    const state: ColumnState[] = this.agGridColumnApi
      .getColumns()
      .map((col) => ({
        colId: col.getColId(),
        // columns are either visible if they are part of the quickfilter columns or if they are "locked"
        hide: !(
          visible.includes(col.getColId()) || col.getColDef().lockVisible
        ),
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
}
