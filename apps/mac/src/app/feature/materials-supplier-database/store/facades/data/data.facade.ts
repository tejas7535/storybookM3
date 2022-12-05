import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { hasIdTokenRole } from '@schaeffler/azure-auth';

import {
  getAgGridColumns,
  getAgGridFilter,
  getEditMaterialData,
  getEditMaterialDataLoaded,
  getHasMinimizedDialog,
  getLoading,
  getMaterialClass,
  getMaterialClassOptions,
  getNavigation,
  getOptionsLoading,
  getResult,
  getResultCount,
  getResumeDialogData,
  getShareQueryParams,
} from '@mac/msd/store/selectors';

@Injectable({
  providedIn: 'root',
})
export class DataFacade {
  private readonly EDITOR_ROLE = 'material-supplier-database-editor';

  materialClassOptions$ = this.store.select(getMaterialClassOptions);
  optionsLoading$ = this.store.select(getOptionsLoading);
  resultLoading$ = this.store.select(getLoading);
  result$ = this.store.select(getResult);
  resultCount$ = this.store.select(getResultCount);

  hasEditorRole$ = this.store.pipe(hasIdTokenRole(this.EDITOR_ROLE));

  navigation$ = this.store.select(getNavigation);
  materialClass$ = this.store.select(getMaterialClass);
  agGridFilter$ = this.store.select(getAgGridFilter);
  agGridColumns$ = this.store.select(getAgGridColumns);

  shareQueryParams$ = this.store.select(getShareQueryParams);

  editMaterialInformation = this.store.pipe(getEditMaterialDataLoaded);
  editMaterial = this.store.select(getEditMaterialData);

  hasMinimizedDialog$ = this.store.select(getHasMinimizedDialog);
  resumeDialogData$ = this.store.select(getResumeDialogData);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
