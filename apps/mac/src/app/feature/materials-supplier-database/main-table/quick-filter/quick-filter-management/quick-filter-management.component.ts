import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { map, Observable, of, take } from 'rxjs';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  ActiveNavigationLevel,
  QuickFilter,
} from '@mac/feature/materials-supplier-database/models';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { QuickFilterFacade } from '@mac/feature/materials-supplier-database/store/facades/quickfilter';

import { QuickfilterDialogComponent } from '../quickfilter-dialog/quickfilter-dialog.component';
import { QuickFiltersListConfig } from './quick-filters-list/quick-filters-list-config.model';

@Component({
  selector: 'mac-quick-filter-management',
  templateUrl: './quick-filter-management.component.html',
})
export class QuickFilterManagementComponent implements OnDestroy {
  @Input() activeNavigationLevel: ActiveNavigationLevel;

  readonly materialClass = MaterialClass;

  readonly quickFiltersListConfigs: QuickFiltersListConfig[] = [
    {
      icon: 'person',
      titleTranslationKeySuffix: 'ownQuickFilters',
      searchable: false,
      actions: [
        {
          icon: 'filter_list',
          tooltipTranslationKeySuffix: 'edit',
          shouldDisable: (quickFilter: QuickFilter) =>
            this.shouldDisableWriteOperation(quickFilter),
          shouldHide: () => of(false),
          onClick: (quickFilter: QuickFilter) => this.edit(quickFilter),
        },
        {
          icon: 'notifications',
          tooltipTranslationKeySuffix: 'enableNotification',
          shouldDisable: () => of(false),
          shouldHide: (quickFilter: QuickFilter) =>
            this.shouldHideEnableNotification(quickFilter),
          onClick: (quickFilter: QuickFilter) =>
            this.enableNotification(quickFilter, false),
        },
        {
          icon: 'notifications_off',
          tooltipTranslationKeySuffix: 'disableNotification',
          shouldDisable: () => of(false),
          shouldHide: (quickFilter: QuickFilter) =>
            this.shouldHideDisableNotification(quickFilter),
          onClick: (quickFilter: QuickFilter) =>
            this.disableNotification(quickFilter, false),
        },
        {
          icon: 'delete_forever',
          tooltipTranslationKeySuffix: 'delete',
          shouldDisable: (quickFilter: QuickFilter) =>
            this.shouldDisableWriteOperation(quickFilter),
          shouldHide: () => of(false),
          onClick: (quickFilter: QuickFilter) => this.delete(quickFilter),
        },
      ],
      quickFilters$: this.quickFilterFacade.ownQuickFilters$,
    },
    {
      icon: 'public',
      titleTranslationKeySuffix: 'subscribedQuickFilters',
      searchable: false,
      actions: [
        {
          icon: 'notifications',
          tooltipTranslationKeySuffix: 'enableNotification',
          shouldDisable: () => of(false),
          shouldHide: (quickFilter: QuickFilter) =>
            this.shouldHideEnableNotification(quickFilter),
          onClick: (quickFilter: QuickFilter) =>
            this.enableNotification(quickFilter, true),
        },
        {
          icon: 'notifications_off',
          tooltipTranslationKeySuffix: 'disableNotification',
          shouldDisable: () => of(false),
          shouldHide: (quickFilter: QuickFilter) =>
            this.shouldHideDisableNotification(quickFilter),
          onClick: (quickFilter: QuickFilter) =>
            this.disableNotification(quickFilter, true),
        },
        {
          icon: 'star',
          tooltipTranslationKeySuffix: 'unsubscribe',
          shouldDisable: () => of(false),
          shouldHide: () => of(false),
          onClick: (quickFilter: QuickFilter) => this.unsubscribe(quickFilter),
        },
      ],
      quickFilters$: this.quickFilterFacade.subscribedQuickFilters$,
    },
    {
      icon: 'add',
      titleTranslationKeySuffix: 'browseQuickFilters',
      searchable: true,
      search: (searchExpression: string) => this.search(searchExpression),
      actions: [
        {
          icon: 'star_outlined',
          tooltipTranslationKeySuffix: 'subscribe',
          shouldDisable: () => of(false),
          shouldHide: () => of(false),
          onClick: (quickFilter: QuickFilter) => this.subscribe(quickFilter),
        },
      ],
      quickFilters$: this.quickFilterFacade.queriedQuickFilters$,
    },
  ];

  private readonly SEARCH_EXPRESSION_MIN_LENGTH = 2;

  constructor(
    readonly quickFilterFacade: QuickFilterFacade,
    private readonly dataFacade: DataFacade,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  openLearnMorePage(): void {
    const fullUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/learn-more/materials-supplier-database'])
    );
    window.open(fullUrl, '_blank');
  }

  ngOnDestroy(): void {
    this.quickFilterFacade.resetQueriedQuickFilters();
  }

  private edit(quickFilter: QuickFilter): void {
    this.quickFilterFacade.activateQuickFilter(quickFilter);
  }

  private delete(quickFilter: QuickFilter): void {
    this.dialog
      .open(QuickfilterDialogComponent, {
        width: '500px',
        autoFocus: false,
        data: { quickFilter, edit: false, delete: true },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result?.delete) {
          this.quickFilterFacade.deleteQuickFilter(quickFilter);
        }
      });
  }

  private subscribe(quickFilter: QuickFilter): void {
    this.quickFilterFacade.subscribeQuickFilter(quickFilter);
  }

  private unsubscribe(quickFilter: QuickFilter): void {
    this.quickFilterFacade.unsubscribeQuickFilter(quickFilter.id);
  }

  private enableNotification(
    quickFilter: QuickFilter,
    isSubscribedQuickFilter: boolean
  ): void {
    this.quickFilterFacade.enableQuickFilterNotification(
      quickFilter.id,
      isSubscribedQuickFilter
    );
  }

  private disableNotification(
    quickFilter: QuickFilter,
    isSubscribedQuickFilter: boolean
  ): void {
    this.quickFilterFacade.disableQuickFilterNotification(
      quickFilter.id,
      isSubscribedQuickFilter
    );
  }

  private search(searchExpression: string): void {
    if (searchExpression.length >= this.SEARCH_EXPRESSION_MIN_LENGTH) {
      this.quickFilterFacade.queryQuickFilters(
        this.activeNavigationLevel.materialClass,
        this.activeNavigationLevel.navigationLevel,
        searchExpression
      );
    } else {
      this.quickFilterFacade.resetQueriedQuickFilters();
    }
  }

  private shouldDisableWriteOperation(
    quickFilter: QuickFilter
  ): Observable<boolean> {
    if (quickFilter.id === undefined) {
      return of(false);
    }

    return this.dataFacade.hasEditorRole$.pipe(
      map((hasEditorRole: boolean) => !hasEditorRole)
    );
  }

  private shouldHideEnableNotification(
    quickFilter: QuickFilter
  ): Observable<boolean> {
    return of(quickFilter.id === undefined || quickFilter.notificationEnabled);
  }

  private shouldHideDisableNotification(
    quickFilter: QuickFilter
  ): Observable<boolean> {
    return of(quickFilter.id === undefined || !quickFilter.notificationEnabled);
  }
}
