import { signal, WritableSignal } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../../../feature/sales-planning/model';
import { AbstractBaseCellRendererComponent } from '../../../../../../shared/components/ag-grid/cell-renderer/abstract-cell-renderer.component';

// This component is mainly used to improve typing
export abstract class AbstractSalesPlanningCellRendererComponent<
  TValue,
> extends AbstractBaseCellRendererComponent<TValue> {
  public value: TValue;
  protected valueFormatted: WritableSignal<string | null> = signal<
    string | null
  >(null);
  protected editStatus: WritableSignal<string> = signal<string | null>(null);
  protected parameters: ICellRendererParams<DetailedCustomerSalesPlan, TValue>;
  public agInit(
    parameters: ICellRendererParams<DetailedCustomerSalesPlan, TValue>
  ): void {
    this.editStatus.set(parameters.data?.editStatus);
    this.valueFormatted.set(parameters.valueFormatted);
    super.agInit(parameters);
  }
}
