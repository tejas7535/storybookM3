import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { hasIdTokenRole } from '@schaeffler/azure-auth';

import {
  getAgGridFilter,
  getEditMaterialData,
  getEditMaterialDataLoaded,
  getFilters,
  getLoading,
  getMaterialClassOptions,
  getOptionsLoading,
  getProductCategoryOptions,
  getResult,
  getResultCount,
  getShareQueryParams,
} from '@mac/msd/store';

@Injectable({
  providedIn: 'root',
})
export class DataFacade {
  private readonly EDITOR_ROLE = 'material-supplier-database-test-editor';

  materialClassOptions$ = this.store.select(getMaterialClassOptions);
  productCategoryOptions$ = this.store.select(getProductCategoryOptions);
  optionsLoading$ = this.store.select(getOptionsLoading);
  resultLoading$ = this.store.select(getLoading);
  result$ = this.store.select(getResult);
  resultCount$ = this.store.select(getResultCount);

  hasEditorRole$ = this.store.pipe(hasIdTokenRole(this.EDITOR_ROLE));

  filters$ = this.store.select(getFilters);
  agGridFilter$ = this.store.select(getAgGridFilter);

  shareQueryParams$ = this.store.select(getShareQueryParams);

  editMaterialInformation = this.store.pipe(getEditMaterialDataLoaded);
  editMaterial = this.store.select(getEditMaterialData);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
