import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { getUsername, hasIdTokenRole } from '@schaeffler/azure-auth';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import {
  DataResult,
  SAPMaterialsRequest,
} from '@mac/feature/materials-supplier-database/models';
import { ServerSideMaterialsRequest } from '@mac/feature/materials-supplier-database/models/data/vitesco-material/vitesco-materials-request.model';
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
  getVitescoResult,
  isBulkEditAllowed,
} from '@mac/msd/store/selectors';

import * as DataActions from '../../actions/data';
import { openMultiEditDialog } from '../../actions/dialog';

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
  vitescoResult$ = this.store.select(getVitescoResult);

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

  username$ = this.store.select(getUsername);

  constructor(private readonly store: Store) {}

  fetchClassOptions() {
    this.store.dispatch(DataActions.fetchClassOptions());
  }

  fetchResult() {
    this.store.dispatch(DataActions.fetchResult());
  }

  setAgGridFilter(filterModel: { [key: string]: any }) {
    this.store.dispatch(DataActions.setAgGridFilter({ filterModel }));
  }

  setAgGridColumns(agGridColumns: string) {
    this.store.dispatch(DataActions.setAgGridColumns({ agGridColumns }));
  }

  deleteEntity(id: number) {
    this.store.dispatch(DataActions.deleteEntity({ id }));
  }

  fetchSAPMaterials(request: SAPMaterialsRequest) {
    this.store.dispatch(DataActions.fetchSAPMaterials({ request }));
  }

  fetchVitescoMaterials(request: ServerSideMaterialsRequest) {
    this.store.dispatch(DataActions.fetchVitescoMaterials({ request }));
  }

  openMultiEditDialog(rows: DataResult[], combinedRows: DataResult) {
    this.store.dispatch(openMultiEditDialog({ rows, combinedRows }));
  }

  setNavigation(
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel
  ) {
    this.store.dispatch(
      DataActions.setNavigation({ materialClass, navigationLevel })
    );
  }

  errorSnackBar(message: string) {
    this.store.dispatch(DataActions.errorSnackBar({ message }));
  }
}
