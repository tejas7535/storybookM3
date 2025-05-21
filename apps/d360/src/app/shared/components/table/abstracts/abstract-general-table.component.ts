import {
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { GridApi } from 'ag-grid-enterprise';

import { AgGridLocalizationService } from '../../../services/ag-grid-localization.service';
import { SelectableOptionsService } from '../../../services/selectable-options.service';
import {
  DynamicTable,
  ExtendedColumnDefs,
  NamedColumnDefs,
} from '../interfaces';

/**
 * Abstract class for general table components.
 *
 * @export
 * @abstract
 * @class AbstractGeneralTableComponent
 * @implements {OnInit}
 */
@Component({ template: '' })
export abstract class AbstractGeneralTableComponent implements OnInit {
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);
  protected readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * The function to reload the table.
   *
   * @type {InputSignal<BehaviorSubject<boolean>>}
   * @memberof AbstractGeneralTableComponent
   */
  public reload$: InputSignal<BehaviorSubject<boolean>> = input(
    new BehaviorSubject<boolean>(false)
  );

  /**
   * The configuration of the table.
   *
   * @protected
   * @type {(WritableSignal<DynamicTable | null>)}
   * @memberof AbstractGeneralTableComponent
   */
  protected config: WritableSignal<DynamicTable | null> = signal(null);

  /**
   * The grid API instance.
   *
   * @protected
   * @type {(GridApi | undefined)}
   * @memberof AbstractGeneralTableComponent
   */
  protected gridApi: GridApi | undefined;

  /**
   * The BehaviorSubject that emits data fetch events.
   *
   * @protected
   * @type {BehaviorSubject<{
   *     rowCount: number;
   *   }>}
   * @memberof AbstractGeneralTableComponent
   */
  protected readonly dataFetchedEvent$: BehaviorSubject<{
    rowCount: number;
  }> = new BehaviorSubject({
    rowCount: 0,
  });

  /**
   * The BehaviorSubject that emits data fetch error events.
   *
   * @protected
   * @type {(BehaviorSubject<any | null>)}
   * @memberof AbstractGeneralTableComponent
   */
  protected readonly fetchErrorEvent$: BehaviorSubject<any | null> =
    new BehaviorSubject(null);

  /**
   * The function to set the table configuration.
   *
   * @type {OutputEmitterRef<GridApi>}
   * @memberof AbstractGeneralTableComponent
   */
  public getApi: OutputEmitterRef<GridApi> = output();

  /**
   * The function to set the table configuration.
   *
   * @protected
   * @abstract
   * @param {(ExtendedColumnDefs[] | NamedColumnDefs[])} columnDefs
   * @memberof AbstractGeneralTableComponent
   */
  protected abstract setConfig(
    columnDefs: ExtendedColumnDefs[] | NamedColumnDefs[]
  ): void;

  /**
   * Set the column definitions for the table.
   *
   * @protected
   * @abstract
   * @memberof AbstractGeneralTableComponent
   */
  protected abstract setColumnDefinitions(): void;

  /** @inheritdoc */
  public ngOnInit(): void {
    this.setColumnDefinitions();
  }

  /**
   * Set the grid API and emit it to the parent component.
   *
   * @protected
   * @param {GridApi} gridApi
   * @memberof AbstractGeneralTableComponent
   */
  protected setGridApi(gridApi: GridApi): void {
    this.getApi.emit(gridApi);
    this.gridApi = gridApi;
  }
}
