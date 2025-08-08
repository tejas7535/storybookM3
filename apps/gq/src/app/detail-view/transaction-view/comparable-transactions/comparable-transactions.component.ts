import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { combineLatest, map, Observable, of } from 'rxjs';

import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import { userHasGPCRole } from '@gq/core/store/selectors';
import { TableContext } from '@gq/process-case-view/quotation-details-table/config/tablecontext.model';
import { BaseAgGridComponent } from '@gq/shared/ag-grid/base-component/base-ag-grid.component';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { basicTableStyle } from '@gq/shared/constants';
import { Quotation } from '@gq/shared/models';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FilterChangedEvent,
  FirstDataRenderedEvent,
} from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DEFAULT_COLUMN_DEFS } from './config';
import { ColumnDefService } from './config/column-def.service';
import { COMPONENTS } from './config/components';
import { ROW_SELECTION } from './config/row-selection.config';

@Component({
  selector: 'gq-comparable-transactions',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AgGridModule,
    InfoIconModule,
    PushPipe,
  ],
  templateUrl: './comparable-transactions.component.html',
  styles: [basicTableStyle],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'transaction-view',
    },
  ],
  standalone: true,
})
export class ComparableTransactionsComponent
  extends BaseAgGridComponent
  implements OnInit
{
  @Input() rowData: ComparableLinkedTransaction[];
  @Input() set currency(currency: string) {
    this.tableContext.quotation.currency = currency;
  }

  @Output() filterChanged: EventEmitter<FilterChangedEvent> =
    new EventEmitter<FilterChangedEvent>();

  private readonly columnDefService: ColumnDefService =
    inject(ColumnDefService);
  private readonly store: Store = inject(Store);

  defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  localeText$: Observable<AgGridLocale>;
  columnDefs$: Observable<ColDef[]>;
  tableContext: TableContext = {
    quotation: { customer: {} } as unknown as Quotation,
  };
  components = COMPONENTS;
  rowSelection = ROW_SELECTION;

  protected TABLE_KEY = 'transactions';

  ngOnInit(): void {
    super.ngOnInit();
    this.columnDefs$ = combineLatest([
      of(this.columnDefService.COLUMN_DEFS),
      this.store.pipe(userHasGPCRole),
    ]).pipe(
      map(([colDefs, hasGPCRole]: [ColDef[], boolean]) =>
        hasGPCRole
          ? colDefs
          : colDefs.filter((colDef) => colDef.field !== 'profitMargin')
      )
    );
  }

  public onFirstDataRendered(event: FirstDataRenderedEvent): void {
    const colIds = event.api.getColumns().map((el) => el.getColId());

    colIds.forEach((colId: string) => {
      event.api.autoSizeColumns([colId], colId === 'customerId');
    });
  }

  onFilterChanged(event: FilterChangedEvent) {
    this.filterChanged.emit(event);
  }
}
