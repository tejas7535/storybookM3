import { Component, effect, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { filter, Observable, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { GetRowIdParams, ICellRendererParams } from 'ag-grid-enterprise';

import { IMRService } from '../../../../feature/internal-material-replacement/imr.service';
import { IMRSubstitution } from '../../../../feature/internal-material-replacement/model';
import { getDefaultColDef } from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import {
  AbstractBackendTableComponent,
  BackendTableComponent,
  BackendTableResponse,
  ExtendedColumnDefs,
  RequestParams,
  TableCreator,
} from '../../../../shared/components/table';
import { InternalMaterialReplacementSingleDeleteModalComponent } from '../../components/modals/internal-material-replacement-single-delete-modal/internal-material-replacement-single-delete-modal.component';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from '../../components/modals/internal-material-replacement-single-substitution-modal/internal-material-replacement-single-substitution-modal.component';
import { getIMRColumnDefinitions } from './column-definitions';

@Component({
  selector: 'd360-internal-material-replacement-table',
  imports: [BackendTableComponent],
  templateUrl: './internal-material-replacement-table.component.html',
  styleUrl: './internal-material-replacement-table.component.scss',
})
export class InternalMaterialReplacementTableComponent
  extends AbstractBackendTableComponent
  implements OnInit
{
  protected readonly imrService: IMRService = inject(IMRService);
  protected readonly dialog: MatDialog = inject(MatDialog);

  public readonly selectedRegion = input.required<string>();

  public constructor() {
    super();

    effect(() => this.selectedRegion() && this.reload$().next(true));
  }

  protected readonly getData$: (
    params: RequestParams
  ) => Observable<BackendTableResponse> = (params: RequestParams) =>
    this.imrService.getIMRData({ region: [this.selectedRegion()] }, params);

  protected setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'internal-material-replacement',
          context: {
            getMenu: (params: ICellRendererParams<any, IMRSubstitution>) => [
              {
                text: translate('button.edit'),
                onClick: () => this.edit(params),
              },
              {
                text: translate('button.delete'),
                onClick: () => this.delete(params),
              },
            ],
          },
          columnDefs,
          getRowId: ({ data }: GetRowIdParams): string =>
            // those five values are defined as the entity key in SAP and uniquely identify a row as they can't be changed
            [
              data?.customerNumber,
              data?.predecessorMaterial,
              data?.region,
              data?.salesArea,
              data?.salesOrg,
            ]
              .filter(Boolean)
              .join('-'),
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
          this.setConfig([
            ...(getIMRColumnDefinitions(
              this.agGridLocalizationService,
              this.selectableOptionsService
            ).map((col) => ({
              ...getDefaultColDef(
                this.translocoLocaleService.getLocale(),
                col.filter,
                col.filterParams
              ),
              colId: col.property,
              field: col.property,
              headerName: translate(col.colId),
              sortable: true,
              filter: col.filter,
              valueFormatter: col.valueFormatter,
              cellRenderer: col.cellRenderer,
              tooltipComponent: col.tooltipComponent,
              tooltipField: col.tooltipField,
              visible: true,
            })) || []),
            {
              cellClass: ['fixed-action-column'],
              field: 'menu',
              headerName: '',
              cellRenderer: ActionsMenuCellRendererComponent,
              lockVisible: true,
              pinned: 'right',
              lockPinned: true,
              suppressHeaderMenuButton: true,
              maxWidth: 64,
              suppressSizeToFit: true,
            },
          ])
        ),

        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private edit(params: ICellRendererParams<any, IMRSubstitution>): void {
    this.dialog
      .open(InternalMaterialReplacementSingleSubstitutionModalComponent, {
        data: {
          substitution: params.data,
          isNewSubstitution: false,
          gridApi: params.api,
        },
        panelClass: ['form-dialog', 'internal-material-replacement'],
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        tap(({ reloadData, redefinedSubstitution }) => {
          if (reloadData) {
            this.gridApi.applyServerSideTransaction({
              update: [redefinedSubstitution],
            });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private delete(params: ICellRendererParams<any, IMRSubstitution>): void {
    this.dialog
      .open(InternalMaterialReplacementSingleDeleteModalComponent, {
        data: params.data,
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        tap((reloadData) => {
          if (reloadData) {
            params.api.applyServerSideTransaction({
              remove: [params.data],
            });

            this.dataFetchedEvent$
              .pipe(
                take(1),
                tap((data) => {
                  this.dataFetchedEvent$.next({
                    ...data,
                    rowCount: data.rowCount - 1,
                  });
                }),
                takeUntilDestroyed(this.destroyRef)
              )
              .subscribe();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
