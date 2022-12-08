import { createAction, props } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  DataResult,
  ManufacturerSupplierTableValue,
  MaterialStandardTableValue,
  MaterialV2,
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

export const fetchMaterialsSuccess = createAction(
  '[MSD - Data] Fetch Materials Success',
  props<{
    materialClass?: MaterialClass;
    result: DataResult[] | MaterialV2[];
  }>()
);

export const fetchMaterialsFailure = createAction(
  '[MSD - Data] Fetch Materials Failure'
);

export const setAgGridFilter = createAction(
  '[MSD - Data] Set AgGrid Filter',
  props<{ filterModel: { [key: string]: any } }>()
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
