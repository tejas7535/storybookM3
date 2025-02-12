import { Component, Input } from '@angular/core';

import { GridApi, GridReadyEvent } from 'ag-grid-community';

// Controls the loading overlay in the Ag-Grid table,which is dependent
// on the `loading` property to indicate the loading state of data input.
@Component({ template: '' })
export abstract class LoadingDataTableComponent<T> {
  private _loading: boolean;
  gridApi: GridApi<T>;

  @Input() set loading(loading: boolean) {
    this._loading = loading;
    this.toggleLoadingOverlay();
  }

  get loading(): boolean {
    return this._loading;
  }

  onGridReady(params: GridReadyEvent<T>): void {
    this.gridApi = params.api;
    this.toggleLoadingOverlay();
  }

  toggleLoadingOverlay(): void {
    this.gridApi?.updateGridOptions({
      loading: this.loading,
    });
  }
}
