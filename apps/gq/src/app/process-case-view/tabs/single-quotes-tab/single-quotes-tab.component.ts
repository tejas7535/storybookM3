import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { combineLatest, map, take } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { ColumnDefService } from '@gq/shared/ag-grid/services';
import { FILTER_PARAM_INDICATOR } from '@gq/shared/constants';
import { Quotation } from '@gq/shared/models';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { translate } from '@jsverse/transloco';

import { ViewToggle } from '@schaeffler/view-toggle';

import { AddCustomViewModalComponent } from './add-custom-view-modal/add-custom-view-modal.component';
import { DeleteCustomViewModalComponent } from './delete-custom-view-modal/delete-custom-view-modal.component';

@Component({
  selector: 'gq-single-quotes-tab',
  templateUrl: './single-quotes-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleQuotesTabComponent implements OnInit {
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
  private readonly colDefService: ColumnDefService = inject(ColumnDefService);
  private readonly gridStateService: AgGridStateService =
    inject(AgGridStateService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  private readonly ADD_VIEW_ID = 9999;
  private readonly EDIT_ICON = 'edit';
  private readonly ADD_ICON = 'add';
  private readonly DELETE_ICON = 'delete';
  private readonly routeSnapShot: ActivatedRouteSnapshot =
    this.activatedRoute.snapshot;

  dataLoading$ = combineLatest([
    this.activeCaseFacade.quotationDetailUpdating$,
    this.activeCaseFacade.quotationLoading$,
  ]).pipe(
    map(
      ([updateLoading, quotationLoading]) => updateLoading || quotationLoading
    )
  );
  quotation$ = this.activeCaseFacade.quotation$;
  customViews$ = this.gridStateService.views.asObservable().pipe(
    map((views: ViewToggle[]) => {
      const viewsWithIcons = views.map((view: ViewToggle) => {
        if (view.id === this.gridStateService.DEFAULT_VIEW_ID) {
          return {
            ...view,
            title: translate('shared.quotationDetailsTable.defaultView'),
          };
        }

        return {
          ...view,
          icons: [{ name: this.EDIT_ICON }, { name: this.DELETE_ICON }],
        };
      });

      return [
        ...viewsWithIcons,
        {
          id: this.ADD_VIEW_ID,
          disabled: true,
          active: false,
          icons: [{ name: this.ADD_ICON }],
        },
      ];
    })
  );

  ngOnInit(): void {
    this.gridStateService.init(
      'process_case',
      null,
      this.colDefService.COLUMN_DEFS.map((item) => item.field)
    );

    this.gridStateService.setActiveView(this.gridStateService.DEFAULT_VIEW_ID);
    this.gridStateService.clearDefaultViewColumnAndFilterState();

    this.applyFilterFromQueryParams();
  }

  onViewToggle(view: ViewToggle) {
    if (view.id === this.ADD_VIEW_ID) {
      this.openCustomViewModal(view.id, true);
    } else {
      this.gridStateService.setActiveView(view.id);
    }
  }

  onViewToggleIconClicked(icon: { viewId: number; iconName: string }) {
    if (icon.iconName === this.ADD_ICON && icon.viewId === this.ADD_VIEW_ID) {
      const currentView = this.gridStateService.getCurrentViewId();
      this.openCustomViewModal(
        icon.viewId,
        true,
        currentView !== this.gridStateService.DEFAULT_VIEW_ID
      );
    }

    if (icon.iconName === this.DELETE_ICON) {
      this.dialog
        .open(DeleteCustomViewModalComponent, {
          width: '550px',
        })
        .afterClosed()
        .subscribe((result) => {
          if (result?.delete) {
            this.gridStateService.deleteView(icon.viewId);
          }
        });
    }

    if (icon.iconName === this.EDIT_ICON) {
      const name = this.gridStateService.getViewNameById(icon.viewId);
      this.openCustomViewModal(icon.viewId, false, false, name);
    }
  }

  onViewToggleDoubleClicked(viewId: number) {
    const name = this.gridStateService.getViewNameById(viewId);
    this.openCustomViewModal(viewId, false, false, name);
  }

  openCustomViewModal(
    viewId: number,
    createNewView: boolean,
    showRadioButtons?: boolean,
    name?: string
  ) {
    this.dialog
      .open(AddCustomViewModalComponent, {
        width: '550px',
        data: { createNewView, name, showRadioButtons },
      })
      .afterClosed()
      .subscribe((result) => {
        if (
          result?.createNewView &&
          result?.name &&
          result?.createFromDefault
        ) {
          this.gridStateService.createViewFromScratch(result.name);
        } else if (
          result?.createNewView &&
          result?.name &&
          !result?.createFromDefault
        ) {
          this.quotation$.pipe(take(1)).subscribe((quotation: Quotation) => {
            this.gridStateService.createViewFromCurrentView(
              result.name,
              quotation.gqId.toString()
            );
          });
        } else if (!result?.createView && result?.name) {
          this.gridStateService.updateViewName(viewId, result.name);
        }
      });
  }

  /**
   * checks in query Params if there are filterParams (start with 'filter_')
   * if filter exists applies all filter for MatNumber and MatDescription
   */
  applyFilterFromQueryParams() {
    const gqId = this.routeSnapShot.queryParamMap.get('quotation_number');
    const filterParams = this.routeSnapShot.queryParamMap.keys.filter(
      (key: string) => key.startsWith(FILTER_PARAM_INDICATOR)
    );

    if (filterParams.length === 0) {
      this.gridStateService.resetFilterModelsOfDefaultView(gqId);

      return;
    }

    this.gridStateService.setActiveView(this.gridStateService.DEFAULT_VIEW_ID);
    filterParams.forEach((key: string) => {
      const filterKey = key.replace(FILTER_PARAM_INDICATOR, '');
      const filterValue = this.routeSnapShot.queryParamMap.get(key);

      this.gridStateService.setColumnFilterForCurrentView(gqId, {
        [filterKey]: {
          values: [filterValue],
          filterType: 'set',
        },
      });
    });
  }
}
