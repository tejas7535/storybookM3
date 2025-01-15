/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { filter, map, Observable, of, Subject, take, takeUntil } from 'rxjs';

import { PushPipe } from '@ngrx/component';
import { ColumnState, GridApi } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  ACTION,
  HISTORY,
  MaterialClass,
  NavigationLevel,
  RECENT_STATUS,
  RELEASED_STATUS,
} from '@mac/msd/constants';
import { QuickFilter, QuickFilterType } from '@mac/msd/models';
import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
} from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';
import { QuickFilterFacade } from '@mac/msd/store/facades/quickfilter';

import { QuickfilterDialogComponent } from './quickfilter-dialog/quickfilter-dialog.component';

@Component({
  selector: 'mac-quick-filter',
  templateUrl: './quick-filter.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
  ],
})
export class QuickFilterComponent implements OnDestroy, OnInit {
  @Output() managementTabSelected = new EventEmitter<boolean>();

  isManagementTabSelected = false;

  // stores currently selected element (bound to ToggleComponent)
  active: QuickFilter;

  // list of default filters, defined statically in frontend
  staticFilters: QuickFilter[];

  // list of own user filters (local and published)
  ownFilters$: Observable<QuickFilter[]>;

  subscribedFilters$: Observable<QuickFilter[]>;

  activePublishedFilterChanged$ = of(false);

  readonly hasEditorRole$ = this.dataFacade.hasEditorRole$;

  private agGridApi: GridApi;

  private readonly destroy$ = new Subject<void>();

  private readonly IGNORE_COLUMNS = new Set([
    HISTORY,
    ACTION,
    RECENT_STATUS,
    RELEASED_STATUS,
  ]);

  private activeEdit: QuickFilter = undefined;
  private materialClass: MaterialClass;
  private navigationLevel: NavigationLevel;

  constructor(
    readonly qfFacade: QuickFilterFacade,
    private readonly dataFacade: DataFacade,
    private readonly msdAgGridReadyService: MsdAgGridReadyService,
    private readonly msdAgGridConfigService: MsdAgGridConfigService,
    private readonly dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.ownFilters$ = this.qfFacade.ownQuickFilters$;
    this.subscribedFilters$ = this.qfFacade.subscribedQuickFilters$;

    this.handleNavigationChanges();
    this.handleQuickFilterPublished();
    this.handlePublicQuickFilterUpdated();
    this.handleQuickFilterActivated();

    this.msdAgGridReadyService.agGridApi$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe(({ gridApi }) => this.onAgGridReady(gridApi));
  }

  // event triggered on selection of button group
  onQuickfilterSelect(event: MatButtonToggleChange) {
    const selected = event.value as QuickFilter;
    this.setManagementTabSelected(!selected);
    this.activePublishedFilterChanged$ = of(false);
    this.applyQuickFilter(selected);
  }

  // add a custom quickfilter
  add() {
    this.openDialog();
  }

  // edit title of an existing quickfilter and also description if the filter is public
  edit(quickFilter: QuickFilter): void {
    this.openDialog(quickFilter);
  }

  // remove custom quickfilter
  remove(quickFilter: QuickFilter): void {
    this.openDialog(quickFilter, true);
  }

  openDialog(selected?: QuickFilter, deleted: boolean = false): void {
    this.activeEdit = selected;
    const dialogRef = this.dialog.open(QuickfilterDialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        quickFilter: selected,
        edit: !!selected,
        delete: deleted,
      },
    });

    // this version will still provide type inference with current component, otherwise "this" would be the event object.
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => this.onDialogClose(result));
  }

  private handleNavigationChanges(): void {
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
        this.materialClass = materialClass;
        this.navigationLevel = navigationLevel;

        if (navigationLevel !== NavigationLevel.PRODUCT_CATEGORY_RULES) {
          this.qfFacade.fetchPublishedQuickFilters(
            materialClass,
            navigationLevel
          );
          this.qfFacade.fetchSubscribedQuickFilters(
            materialClass,
            navigationLevel
          );

          this.staticFilters =
            this.msdAgGridConfigService.getStaticQuickFilters(
              materialClass,
              navigationLevel
            );
          this.active = this.staticFilters[0];
          this.activePublishedFilterChanged$ = of(false);
          this.setManagementTabSelected(false);
        }
      });
  }

  // event propagated when agGrid table has been initialized
  private onAgGridReady(gridApi: GridApi) {
    this.agGridApi = gridApi;

    // subscribe to updates of visible columns and update active quickfilter
    this.dataFacade.agGridColumns$
      .pipe(
        takeUntil(this.destroy$),
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
        takeUntil(this.destroy$),
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
    this.isOwnFilter(this.active)
      .pipe(take(1))
      .subscribe((isOwn: boolean) => {
        if (isOwn) {
          // update quickfilter
          const oldFilter = this.active;
          const newFilter = {
            ...oldFilter,
            ...this.agGridToFilter(this.active.title, this.active.description),
          };
          this.active = newFilter;

          if (newFilter.id) {
            this.activePublishedFilterChanged$ =
              this.hasActivePublishedFilterChanged();
          } else {
            this.qfFacade.updateLocalQuickFilter(oldFilter, newFilter);
          }
        } else {
          // reset selection on predefined items after modification
          this.reset();
        }
      });
  }

  // apply selected quickfilter
  private applyQuickFilter(selected: QuickFilter): void {
    this.active = selected;

    // If quick filter management tab is selected, the value of 'selected' is undefined and the active quick filter is set the the default one.
    const activeFilter = selected ?? this.staticFilters[0];
    const visible = activeFilter.columns;
    // setup visibility and order of columns based on selected elements
    const state: ColumnState[] = this.agGridApi
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
    this.agGridApi.setFilterModel(activeFilter.filter);
    this.agGridApi.applyColumnState({ state, applyOrder: true });
  }

  // reset active element
  private reset() {
    this.active = this.staticFilters[0];
  }

  // get list of visible columns from current agGrid configuration
  private getCurrentColumns(): string[] {
    return this.agGridApi
      .getColumnState()
      .filter((state) => !state.hide)
      .map((state) => state.colId);
  }

  // triggered by close event of dialog
  private onDialogClose(result?: {
    title: string;
    description: string;
    quickFilterType: QuickFilterType;
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
        this.qfFacade.deleteQuickFilter(oldFilter);
      } else if (result.edit) {
        // edit filter name
        const oldFilter = this.activeEdit;
        const newFilter = {
          ...oldFilter,
          title: result.title,
          description: result.description,
        };

        this.qfFacade.updateQuickFilter(
          oldFilter,
          newFilter,
          this.hasEditorRole$
        );
      } else {
        const title = result.title;
        const description = result.description;
        // add new filter
        const fromCurrent: boolean =
          result.quickFilterType === QuickFilterType.LOCAL_FROM_CURRENT_VIEW ||
          result.quickFilterType === QuickFilterType.PUBLIC;
        const newFilter: QuickFilter = fromCurrent
          ? this.agGridToFilter(title, description)
          : this.copyDefaultFilter(title);

        this.applyQuickFilter(newFilter);
        this.qfFacade.createQuickFilter(newFilter);
        this.setManagementTabSelected(false);
      }
    }
    this.activeEdit = undefined;
  }

  // get current aggrid configuration to a Quickfilter
  private agGridToFilter(title: string, description: string): QuickFilter {
    return {
      materialClass: this.materialClass,
      navigationLevel: this.navigationLevel,
      title,
      description,
      filter: this.agGridApi.getFilterModel(),
      columns: this.getCurrentColumns(),
    };
  }

  // copy default Quickfilter to a new object
  private copyDefaultFilter(title: string): QuickFilter {
    return {
      ...this.staticFilters[0],
      title,
    };
  }

  private setManagementTabSelected(isManagementTabSelected: boolean): void {
    this.isManagementTabSelected = isManagementTabSelected;
    this.managementTabSelected.emit(isManagementTabSelected);
  }

  private isOwnFilter(quickFilter: QuickFilter): Observable<boolean> {
    return this.ownFilters$.pipe(
      map((ownQuickFilters: QuickFilter[]) =>
        quickFilter.id === undefined
          ? ownQuickFilters.includes(quickFilter)
          : ownQuickFilters.some(
              (ownQuickFilter: QuickFilter) =>
                ownQuickFilter.id === quickFilter.id
            )
      )
    );
  }

  private handleQuickFilterPublished(): void {
    this.qfFacade.publishQuickFilterSucceeded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ({ publishedQuickFilter }) => (this.active = publishedQuickFilter)
      );
  }

  private handlePublicQuickFilterUpdated(): void {
    this.qfFacade.updatePublicQuickFilterSucceeded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ({ updatedQuickFilter }) => (this.active = updatedQuickFilter)
      );
  }

  private handleQuickFilterActivated(): void {
    this.qfFacade.quickFilterActivated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ quickFilter }) => {
        this.applyQuickFilter(quickFilter);
        this.setManagementTabSelected(false);
      });
  }

  /**
   * Check if the active filter is public and has any local changes, which have not been published yet.
   *
   * @returns Observable<true> if the active filter is public with not published local changes, otherwise Observable<false>
   */
  private hasActivePublishedFilterChanged(): Observable<boolean> {
    return this.qfFacade.publishedQuickFilters$.pipe(
      map((publishedQuickFilters: QuickFilter[]) => {
        const publishedQuickFilter = publishedQuickFilters.find(
          (quickFilter: QuickFilter) => quickFilter.id === this.active.id
        );

        if (
          publishedQuickFilter &&
          (JSON.stringify(this.active.columns) !==
            JSON.stringify(publishedQuickFilter.columns) ||
            JSON.stringify(this.active.filter) !==
              JSON.stringify(publishedQuickFilter.filter))
        ) {
          return true;
        }

        return false;
      })
    );
  }
}
