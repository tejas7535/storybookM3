import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { combineLatest, map, Observable, of } from 'rxjs';

import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import { userHasGPCRole } from '@gq/core/store/selectors';
import { TableContext } from '@gq/process-case-view/quotation-details-table/config/tablecontext.model';
import { BaseAgGridComponent } from '@gq/shared/ag-grid/base-component/base-ag-grid.component';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import { InfoIconComponent } from '@gq/shared/components/info-icon/info-icon.component';
import { basicTableStyle } from '@gq/shared/constants';
import { Keyboard, Quotation } from '@gq/shared/models';
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

type EndSectorCustomerField =
  | 'endsectorCustomer'
  | 'endsectorCustomerNumber'
  | 'endSectorSubSector';

const HIDDEN_FIELDS: Set<EndSectorCustomerField> = new Set([
  'endsectorCustomer',
  'endsectorCustomerNumber',
  'endSectorSubSector',
]);

@Component({
  selector: 'gq-comparable-transactions',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AgGridModule,
    InfoIconComponent,
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
  rowData = input<ComparableLinkedTransaction[]>([]);
  @Input() set currency(currency: string) {
    this.tableContext.quotation.currency = currency;
  }

  @Output() filterChanged: EventEmitter<FilterChangedEvent> =
    new EventEmitter<FilterChangedEvent>();

  private readonly columnDefService: ColumnDefService =
    inject(ColumnDefService);
  private readonly store: Store = inject(Store);
  private readonly rowData$ = toObservable(this.rowData);

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
      this.rowData$,
    ]).pipe(
      map(
        ([colDefs, hasGPCRole, rowData]: [
          ColDef[],
          boolean,
          ComparableLinkedTransaction[],
        ]) => {
          const filteredColDefs = hasGPCRole
            ? colDefs
            : colDefs.filter((colDef) => colDef.field !== 'profitMargin');

          // https://jira.schaeffler.com/browse/GQUOTE-6260
          // According to story if all displayed transactions have empty values for the columns than hide columns

          return filteredColDefs.filter(
            (colDef) => !this.shouldHideEndSectorCustomer(colDef.field, rowData)
          );
        }
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

  private shouldHideEndSectorCustomer(
    colField: string,
    rowData: ComparableLinkedTransaction[]
  ): boolean {
    const field = colField as EndSectorCustomerField;
    const isHiddenField = HIDDEN_FIELDS.has(field);
    const isUndefinedForAll =
      isHiddenField &&
      rowData.length > 0 &&
      rowData.every((transaction) => {
        const value = transaction[field];

        return value === undefined || value === null || value === Keyboard.HASH;
      });

    // Keep the column if not a hidden field,
    // or if it is a hidden field but not undefined for all transactions
    return isUndefinedForAll;
  }
}
