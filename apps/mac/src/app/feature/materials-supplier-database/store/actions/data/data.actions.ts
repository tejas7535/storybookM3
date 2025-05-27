import { createAction, props } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import { EstimationMatrix } from '@mac/feature/materials-supplier-database/models/data/estimation-matrix/estimation-matrix.model';
import { VitescoMaterial } from '@mac/feature/materials-supplier-database/models/data/vitesco-material/vitesco-material.model';
import { ServerSideMaterialsRequest } from '@mac/feature/materials-supplier-database/models/data/vitesco-material/vitesco-materials-request.model';
import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  DataResult,
  ManufacturerSupplierTableValue,
  Material,
  MaterialStandardTableValue,
  ProductCategoryRuleTableValue,
  SAPMaterial,
  SAPMaterialsRequest,
} from '@mac/msd/models';

export const setFilter = createAction(
  '[MSD - Data] Set Filter',
  props<{ materialClass: StringOption; productCategory: StringOption[] }>()
);

export const setNavigation = createAction(
  '[MSD - Data] Set Navigation',
  props<{ materialClass: MaterialClass; navigationLevel: NavigationLevel }>()
);

export const fetchClassOptions = createAction(
  '[MSD - Data] Fetch Material Classes'
);

export const fetchClassOptionsSuccess = createAction(
  '[MSD - Data] Fetch Class Options Success',
  props<{ materialClasses: MaterialClass[] }>()
);

export const fetchClassOptionsFailure = createAction(
  '[MSD - Data] Fetch Class Options Failure'
);

export const fetchResult = createAction('[MSD - Data] Fetch Result');

export const fetchMaterials = createAction('[MSD - Data] Fetch Materials');

export const fetchSAPMaterials = createAction(
  '[MSD - Data] Fetch SAP Materials',
  props<{ request: SAPMaterialsRequest }>()
);

export const fetchVitescoMaterials = createAction(
  '[MSD - Data] Fetch Vitesco Materials',
  props<{ request: ServerSideMaterialsRequest }>()
);

export const fetchEstimationMatrix = createAction(
  '[MSD - Data] Fetch Estimation Matrix',
  props<{ request: ServerSideMaterialsRequest }>()
);

export const fetchMaterialsSuccess = createAction(
  '[MSD - Data] Fetch Materials Success',
  props<{
    materialClass?: MaterialClass;
    result: DataResult[] | Material[];
  }>()
);

export const fetchSAPMaterialsSuccess = createAction(
  '[MSD - Data] Fetch SAP Materials Success',
  props<{
    data: SAPMaterial[];
    lastRow: number;
    totalRows: number;
    subTotalRows: number;
    startRow: number;
  }>()
);

export const fetchVitescoMaterialsSuccess = createAction(
  '[MSD - Data] Fetch Vitesco Materials Success',
  props<{
    data: VitescoMaterial[];
    lastRow: number;
    totalRows: number;
    subTotalRows: number;
    startRow: number;
  }>()
);

export const fetchEstimationMatrixSuccess = createAction(
  '[MSD - Data] Fetch Estimation Matrix Success',
  props<{
    data: EstimationMatrix[];
    lastRow: number;
    totalRows: number;
    subTotalRows: number;
    startRow: number;
  }>()
);

export const fetchMaterialsFailure = createAction(
  '[MSD - Data] Fetch Materials Failure'
);

export const fetchSAPMaterialsFailure = createAction(
  '[MSD - Data] Fetch SAP Materials Failure',
  props<{
    startRow: number;
    errorCode: number;
    retryCount: number;
  }>()
);

export const fetchVitescoMaterialsFailure = createAction(
  '[MSD - Data] Fetch Vitesco Materials Failure',
  props<{
    startRow: number;
    errorCode: number;
    retryCount: number;
  }>()
);

export const fetchEstimationMatrixFailure = createAction(
  '[MSD - Data] Fetch Estimation Matrix Failure',
  props<{
    startRow: number;
    errorCode: number;
    retryCount: number;
  }>()
);

export const setAgGridFilter = createAction(
  '[MSD - Data] Set AgGrid Filter',
  props<{ filterModel: { [key: string]: any } }>()
);

export const setAgGridFilterForNavigation = createAction(
  '[MSD - Data] Set AgGrid Filter For Navigation',
  props<{
    filterModel: {
      [key: string]: any;
    };
    materialClass: MaterialClass;
    navigationLevel: NavigationLevel;
  }>()
);

export const resetResult = createAction('[MSD - Data] Reset Result');

export const setAgGridColumns = createAction(
  '[MSD - Data] Set Ag Grid Columns',
  props<{ agGridColumns: string }>()
);

export const fetchManufacturerSuppliers = createAction(
  '[MSD - Data] Fetch Manufacturer Suppliers'
);

export const fetchManufacturerSuppliersSuccess = createAction(
  '[MSD - Data] Fetch Manufacturer Suppliers Success',
  props<{
    materialClass: MaterialClass;
    manufacturerSuppliers: ManufacturerSupplierTableValue[];
  }>()
);

export const fetchManufacturerSuppliersFailure = createAction(
  '[MSD - Data] Fetch Manufacturer Suppliers Failure'
);

export const fetchMaterialStandards = createAction(
  '[MSD - Data] Fetch Material Standards'
);

export const fetchMaterialStandardsSuccess = createAction(
  '[MSD - Data] Fetch Material Standards Success',
  props<{
    materialClass: MaterialClass;
    materialStandards: MaterialStandardTableValue[];
  }>()
);

export const fetchMaterialStandardsFailure = createAction(
  '[MSD - Data] Fetch Material Standards Failure'
);

export const fetchProductCategoryRules = createAction(
  '[MSD - Data] Fetch Product Category Rules'
);

export const fetchProductCategoryRulesSuccess = createAction(
  '[MSD - Data] Fetch Product Category Rules Success',
  props<{
    materialClass: MaterialClass;
    productCategoryRules: ProductCategoryRuleTableValue[];
  }>()
);

export const fetchProductCategoryRulesFailure = createAction(
  '[MSD - Data] Fetch Product Category Rules Failure'
);

export const deleteEntity = createAction(
  '[MSD - Data] Delete MSD Entity',
  props<{ id: number }>()
);

export const deleteMaterial = createAction(
  '[MSD - Data] Delete Material',
  props<{ id: number; materialClass: MaterialClass }>()
);

export const deleteManufacturerSupplier = createAction(
  '[MSD - Data] Delete ManufacturerSupplier',
  props<{ id: number; materialClass: MaterialClass }>()
);

export const deleteMaterialStandard = createAction(
  '[MSD - Data] Delete MaterialStandard',
  props<{ id: number; materialClass: MaterialClass }>()
);

export const deleteEntitySuccess = createAction(
  '[MSD - Data] Delete MSD Entity Success'
);

export const deleteEntityFailure = createAction(
  '[MSD - Data] Delete MSD Entity Failure'
);

export const infoSnackBar = createAction(
  '[MSD - Data] info snackbar',
  props<{ message: string }>()
);

export const errorSnackBar = createAction(
  '[MSD - Data] error snackbar',
  props<{
    message: string;
    detailMessage?: string;
    items?: { key: string; value: any }[];
  }>()
);
