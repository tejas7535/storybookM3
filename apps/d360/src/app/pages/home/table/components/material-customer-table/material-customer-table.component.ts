import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { filter, Observable, of, take, tap } from 'rxjs';

import { translate, TranslocoDirective } from '@jsverse/transloco';
import { RowClassParams, RowStyle } from 'ag-grid-enterprise';

import { GlobalSelectionUtils } from '../../../../../feature/global-selection/global-selection.utils';
import { MaterialCustomerService } from '../../../../../feature/material-customer/material-customer.service';
import { CriteriaFields } from '../../../../../feature/material-customer/model';
import {
  getColFilter,
  getDefaultColDef,
} from '../../../../../shared/ag-grid/grid-defaults';
import { ColumnFilters } from '../../../../../shared/ag-grid/grid-filter-model';
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  AbstractBackendTableComponent,
  BackendTableComponent,
  BackendTableResponse,
  ExtendedColumnDefs,
  RequestParams,
  TableCreator,
} from '../../../../../shared/components/table';
import { columnDefinitions } from '../../column-definition';
import { MaterialCustomerTableService } from '../../services/material-customer-table.service';
import { ExportTableDialogComponent } from '../export-table-dialog/export-table-dialog.component';
import { TextTooltipComponent } from '../text-tooltip/text-tooltip.component';

@Component({
  selector: 'd360-material-customer-table',
  imports: [MatButton, MatIcon, TranslocoDirective, BackendTableComponent],
  providers: [MaterialCustomerTableService],
  templateUrl: './material-customer-table.component.html',
  styleUrl: './material-customer-table.component.scss',
})
export class MaterialCustomerTableComponent
  extends AbstractBackendTableComponent
  implements OnInit
{
  private readonly materialCustomerService = inject(MaterialCustomerService);
  private readonly dialog = inject(MatDialog);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  private readonly materialCustomerTableService = inject(
    MaterialCustomerTableService
  );

  public selectionFilter = input.required<GlobalSelectionState>();

  public criteriaData: CriteriaFields;

  public onColumnFilterChange = output<ColumnFilters>();

  public constructor() {
    super();

    effect(() => this.selectionFilter() && this.reload$().next(true));
  }

  public override ngOnInit() {
    // Hint: we are not calling super.ngOnInit() here because we want to avoid
    // the default behavior of the parent class.

    this.materialCustomerService
      .getCriteriaData()
      .pipe(
        take(1),
        tap((data) => {
          this.criteriaData = data;
          this.setColumnDefinitions();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected readonly getData$: (
    params: RequestParams
  ) => Observable<BackendTableResponse> = (params: RequestParams) => {
    if (this.globalSelectionStateService.isEmpty()) {
      return of({ rows: [], rowCount: 0 });
    }

    return this.materialCustomerTableService.getMaterialCustomerData(
      GlobalSelectionUtils.globalSelectionCriteriaToFilter(
        this.selectionFilter()
      ),
      params
    );
  };

  protected getRowStyle(params: RowClassParams): RowStyle | undefined {
    if (params.data !== undefined && params.data.portfolioStatus === 'IA') {
      return { backgroundColor: '#F6F7F9', color: '#646464' };
    }

    return undefined;
  }

  protected isExportDisabled(): boolean {
    return this.globalSelectionStateService.isEmpty();
  }

  protected openExport(): void {
    this.dialog.open(ExportTableDialogComponent, {
      data: {
        gridApi: this.gridApi,
        filter: GlobalSelectionUtils.globalSelectionCriteriaToFilter(
          this.selectionFilter()
        ),
        backdrop: false,
      },
    });
  }

  protected setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'customer-material',
          context: { getMenu: [] },
          columnDefs,
          getRowStyle: this.getRowStyle.bind(this),
          noRowsMessage: translate('hint.selectData'),
        }),
        isLoading$: this.selectableOptionsService.loading$,
        hasTabView: true,
        maxAllowedTabs: 5,
      })
    );
  }

  protected setColumnDefinitions(): void {
    this.selectableOptionsService.loading$
      .pipe(
        filter((loading) => !loading),
        take(1),
        tap(() =>
          this.setConfig(
            [
              ...columnDefinitions(
                this.agGridLocalizationService,
                this.selectableOptionsService
              ),
            ].map(
              ({
                // eslint-disable-next-line @typescript-eslint/no-shadow
                filter,
                colId,
                visible,
                alwaysVisible,
                valueGetter,
                valueFormatter,
                cellRenderer,
                filterParams,
                floatingFilterComponent,
              }: any) => ({
                ...getDefaultColDef(
                  this.translocoLocaleService.getLocale(),
                  filter,
                  filterParams
                ),
                key: colId,
                colId,
                field: colId,
                lockVisible: alwaysVisible,
                hide: !visible,
                headerName: translate(`material_customer.column.${colId}`),
                sortable: this.criteriaData?.sortableFields.includes(colId),
                tooltipField: colId,
                tooltipComponent: TextTooltipComponent,
                floatingFilterComponent,
                filter: getColFilter(colId, filter, this.criteriaData),
                cellRenderer,
                valueGetter,
                valueFormatter,
                lockPinned: true,
                visible,
              })
            )
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
