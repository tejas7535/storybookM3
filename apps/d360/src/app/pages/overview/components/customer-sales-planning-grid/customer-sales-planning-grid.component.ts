import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { Observable, tap } from 'rxjs';

import { translate, TranslocoDirective } from '@jsverse/transloco';
import { CellClickedEvent } from 'ag-grid-enterprise';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { AppRoutePath } from '../../../../app.routes.enum';
import { OverviewService } from '../../../../feature/overview/overview.service';
import { getDefaultColDef } from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { CustomerSalesPlanningLayout } from '../../overview.component';
import {
  AbstractBackendTableComponent,
  BackendTableComponent,
  BackendTableResponse,
  ExtendedColumnDefs,
  NamedColumnDefs,
  RequestParams,
  RequestType,
  TableCreator,
} from './../../../../shared/components/table';
import { getColumnDefs } from './column-definitions';
import { CustomerSalesPlanningData } from './model';

@Component({
  selector: 'd360-customer-sales-planning-grid',
  imports: [TranslocoDirective, BackendTableComponent],
  templateUrl: './customer-sales-planning-grid.component.html',
  styleUrl: './customer-sales-planning-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerSalesPlanningGridComponent
  extends AbstractBackendTableComponent
  implements OnInit
{
  protected readonly overviewService: OverviewService = inject(OverviewService);
  private readonly router: Router = inject(Router);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );

  public isAssignedToMe = input.required<boolean>();
  public gkamNumbers = input<string[]>(null);
  public customerNumbers = input<string[]>(null);
  public selectionChanged = output<any>();

  private readonly params = computed(() => ({
    isAssignedToMe: this.isAssignedToMe(),
    gkamNumbers: this.gkamNumbers(),
    customerNumbers: this.customerNumbers(),
  }));

  protected context: Record<string, any> = {
    getMenu: (row: { data: CustomerSalesPlanningData }) =>
      row?.data
        ? [
            {
              text: translate('overview.yourCustomer.grid.jumpToFunction'),
              submenu: [
                {
                  text: translate('tabbarMenu.sales-planning.label'),
                  onClick: () => {
                    sessionStorage.setItem(
                      AppRoutePath.SalesValidationPage,
                      JSON.stringify({
                        customerNumber: row?.data?.customerNumber,
                      })
                    );
                    this.router.navigate([AppRoutePath.SalesValidationPage]);
                  },
                },
                {
                  text: translate('tabbarMenu.validation-of-demand.label'),
                  onClick: () =>
                    this.globalSelectionStateService.navigateWithGlobalSelection(
                      AppRoutePath.DemandValidationPage,
                      {
                        customerNumber: [
                          {
                            id: row?.data?.customerNumber,
                            text: row?.data?.customerName,
                          },
                        ],
                      }
                    ),
                },
              ],
            },
          ]
        : [],
  };

  public constructor() {
    super();

    effect(() => this.params() && this.reload$().next(true));
  }

  public resetSelection(): void {
    this.gridApi?.deselectAll();
    this.selectionChanged.emit(null);
  }

  protected readonly getData$: (
    params: RequestParams,
    requestType: RequestType
  ) => Observable<BackendTableResponse> = (params: RequestParams) =>
    this.overviewService
      .getRelevantPlanningKPIs(
        {
          keyAccountNumber: this.gkamNumbers(),
          customerNumber: this.customerNumbers(),
        },
        this.isAssignedToMe(),
        params
      )
      .pipe(
        tap(
          (response) =>
            // Deselect row if currently selected customer is not contained in new data
            !response?.rows
              ?.map((row) => row.customerNumber)
              .includes(this.gridApi?.getSelectedRows()?.[0]?.customerNumber) &&
            this.resetSelection()
        ),
        takeUntilDestroyed(this.destroyRef)
      );

  protected setConfig(columnDefs: NamedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'customer-sales-planning-grid',
          columnDefs,
          context: this.context,
          noRowsMessage: translate('hint.noData'),
          getRowId: (params) => params.data.customerNumber,
          autoSizeStrategy: false,
          customErrorMessageFn: (error: any) =>
            error?.details?.values?.['x-sap-messagenumber'] === '133'
              ? translate('hint.selectData')
              : '',
        }),
        isLoading$: this.selectableOptionsService.loading$,
        hasTabView: true,
        maxAllowedTabs: 5,
        callbacks: { onCellClicked: this.toggleSelection.bind(this) },
      })
    );
  }

  protected setColumnDefinitions(): void {
    const getColDefs = (
      layout: CustomerSalesPlanningLayout
    ): ExtendedColumnDefs[] => [
      ...getColumnDefs(this.agGridLocalizationService, layout).map(
        (column) => ({
          ...getDefaultColDef(
            this.translocoLocaleService.getLocale(),
            column.filter,
            column.filterParams
          ),
          ...column,
          headerName: translate(`overview.yourCustomer.grid.${column.colId}`),
          headerTooltip: translate(
            `overview.yourCustomer.grid.${column.colId}`
          ),
        })
      ),
      {
        cellClass: ['fixed-action-column'],
        field: 'menu',
        headerName: '',
        cellRenderer: ActionsMenuCellRendererComponent,
        lockVisible: true,
        lockPinned: true,
        pinned: 'right' as const,
        minWidth: 50,
        maxWidth: 50,
        suppressHeaderMenuButton: true,
        suppressSizeToFit: true,
        suppressColumnsToolPanel: true,
        sortable: false,
      },
    ];

    this.setConfig([
      {
        layoutId: 0,
        title: translate('overview.yourCustomer.layout.previousToCurrent'),
        columnDefs: [
          ...getColDefs(CustomerSalesPlanningLayout.PreviousToCurrent),
        ],
      },
      {
        layoutId: 1,
        title: translate('overview.yourCustomer.layout.currentToNext'),
        columnDefs: [...getColDefs(CustomerSalesPlanningLayout.CurrentToNext)],
      },
    ]);
  }

  protected toggleSelection(event: CellClickedEvent): void {
    const isSelected = event.node.isSelected();
    event.node.setSelected(!isSelected);
    this.selectionChanged.emit(isSelected ? null : event.node.data);
  }
}
