import { createAction, props } from '@ngrx/store';

import { DataFilter, DataResult } from '../../models';

export const setFilter = createAction(
  '[MSD - Data] Set Filter',
  props<{ materialClass: DataFilter; productCategory: DataFilter[] }>()
);

export const fetchClassAndCategoryOptions = createAction(
  '[MSD - Data] Fetch Material Class And Product Category Options'
);

export const fetchClassOptions = createAction(
  '[MSD - Data] Fetch Material Classes'
);

export const fetchCategoryOptions = createAction(
  '[MSD - Data] Fetch Product Category Options'
);

export const fetchClassOptionsSuccess = createAction(
  '[MSD - Data] Fetch Class Options Success',
  props<{ materialClassOptions: DataFilter[] }>()
);

export const fetchClassOptionsFailure = createAction(
  '[MSD - Data] Fetch Class Options Failure'
);

export const fetchCategoryOptionsSuccess = createAction(
  '[MSD - Data] Fetch Category Options Success',
  props<{ productCategoryOptions: DataFilter[] }>()
);

export const fetchCategoryOptionsFailure = createAction(
  '[MSD - Data] Fetch Category Options Failure'
);

export const fetchMaterials = createAction('[MSD - Data] Fetch Materials');

export const fetchMaterialsSuccess = createAction(
  '[MSD - Data] Fetch Materials Success',
  props<{ result: DataResult[] }>()
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
