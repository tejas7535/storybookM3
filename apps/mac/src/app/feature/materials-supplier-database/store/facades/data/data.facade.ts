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
  getSAPMaterialsRows,
  getSAPResult,
  getSelectedMaterialData,
  getShareQueryParams,
  isBulkEditAllowed,
} from '@mac/msd/store/selectors';

@Injectable({
  providedIn: 'root',
})
export class DataFacade {
  readonly EDITOR_ROLE = 'material-supplier-database-editor';
  readonly MATNR_UPLOADER_ROLE = 'material-supplier-database-matnr-uploader';

  materialClassOptions$ = this.store.select(getMaterialClassOptions);
  optionsLoading$ = this.store.select(getOptionsLoading);
  resultLoading$ = this.store.select(getLoading);
  result$ = this.store.select(getResult);
  sapResult$ = this.store.select(getSAPResult);
  resultCount$ = this.store.select(getResultCount);
  sapMaterialsRows$ = this.store.select(getSAPMaterialsRows);

  hasEditorRole$ = this.store.pipe(hasIdTokenRole(this.EDITOR_ROLE));
  hasMatnrUploaderRole$ = this.store.pipe(
    hasIdTokenRole(this.MATNR_UPLOADER_ROLE)
  );

  navigation$ = this.store.select(getNavigation);
  materialClass$ = this.store.select(getMaterialClass);
  agGridFilter$ = this.store.select(getAgGridFilter);
  agGridColumns$ = this.store.select(getAgGridColumns);

  shareQueryParams$ = this.store.select(getShareQueryParams);

  editMaterialInformation = this.store.pipe(getEditMaterialDataLoaded);
  editMaterial = this.store.select(getEditMaterialData);
  selectedMaterialData$ = this.store.select(getSelectedMaterialData);

  hasMinimizedDialog$ = this.store.select(getHasMinimizedDialog);
  resumeDialogData$ = this.store.select(getResumeDialogData);
  isBulkEditAllowed$ = this.store.select(isBulkEditAllowed);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
