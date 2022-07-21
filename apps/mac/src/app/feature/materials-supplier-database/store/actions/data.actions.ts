import { createAction, props } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  DataResult,
  ManufacturerSupplier,
  Material,
  MaterialStandard,
} from '../../models';

export const setFilter = createAction(
  '[MSD - Data] Set Filter',
  props<{ materialClass: StringOption; productCategory: StringOption[] }>()
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
  props<{ materialClassOptions: StringOption[] }>()
);

export const fetchClassOptionsFailure = createAction(
  '[MSD - Data] Fetch Class Options Failure'
);

export const fetchCategoryOptionsSuccess = createAction(
  '[MSD - Data] Fetch Category Options Success',
  props<{ productCategoryOptions: StringOption[] }>()
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

export const addMaterialDialogOpened = createAction(
  '[MSD - Add Material] Add Material Dialog Opened'
);

export const addMaterialDialogCanceled = createAction(
  '[MSD - Add Material] Add Material Dialog Canceled'
);

export const addMaterialDialogConfirmed = createAction(
  '[MSD - Add Material] Add Material Confirmed',
  props<{ material: Material }>()
);

export const fetchMaterialStandards = createAction(
  '[MSD - Add Material] Fetch Material Standards'
);

export const fetchMaterialStandardsSuccess = createAction(
  '[MSD - Add Material] Fetch Material Standards Success',
  props<{ materialStandards: MaterialStandard[] }>()
);

export const fetchMaterialStandardsFailure = createAction(
  '[MSD - Add Material] Fetch Material Standards Failure'
);

export const fetchManufacturerSuppliers = createAction(
  '[MSD - Add Material] Fetch Manufacturer Suppliers'
);

export const fetchManufacturerSuppliersSuccess = createAction(
  '[MSD - Add Material] Fetch Manufacturer Suppliers Success',
  props<{ manufacturerSuppliers: ManufacturerSupplier[] }>()
);

export const fetchManufacturerSuppliersFailure = createAction(
  '[MSD - Add Material] Fetch Manufacturer Suppliers Failure'
);

export const fetchCastingDiameters = createAction(
  '[MSD - Add Material] Fetch Casting Diameters',
  props<{ supplierId: number }>()
);

export const fetchCastingDiametersSuccess = createAction(
  '[MSD - Add Material] Fetch Casting Diameters Success',
  props<{ castingDiameters: string[] }>()
);

export const fetchCastingDiametersFailure = createAction(
  '[MSD - Add Material] Fetch Casting Diameters Failure'
);

export const fetchRatings = createAction('[MSD - Add Material] Fetch Ratings');

export const fetchRatingsSuccess = createAction(
  '[MSD - Add Material] Fetch Ratings Success',
  props<{ ratings: string[] }>()
);

export const fetchRatingsFailure = createAction(
  '[MSD - Add Material] Fetch Ratings Failure'
);

export const fetchCo2Classifications = createAction(
  '[MSD - Add Material] Fetch CO2 Classifications'
);

export const fetchCo2ClassificationsSuccess = createAction(
  '[MSD - Add Material] Fetch CO2 Classifications Success',
  props<{ co2Classifications: StringOption[] }>()
);

export const fetchCo2ClassificationsFailure = createAction(
  '[MSD - Add Material] Fetch CO2 Classifications Failure'
);

export const fetchSteelMakingProcesses = createAction(
  '[MSD - Add Material] Fetch Steel Making Processes'
);

export const fetchSteelMakingProcessesSuccess = createAction(
  '[MSD - Add Material] Fetch Steel Making Processes Success',
  props<{ steelMakingProcesses: string[] }>()
);

export const fetchSteelMakingProcessesFailure = createAction(
  '[MSD - Add Material] Fetch Steel Making Processes Failure'
);

export const fetchCastingModes = createAction(
  '[MSD - Add Material] Fetch Casting Modes'
);

export const fetchCastingModesSuccess = createAction(
  '[MSD - Add Material] Fetch Casting Modes Success',
  props<{ castingModes: string[] }>()
);

export const fetchCastingModesFailure = createAction(
  '[MSD - Add Material] Fetch Casting Modes Failure'
);

export const createMaterialComplete = createAction(
  '[MSD - Add Material] Create Material Complete',
  props<{ success: boolean }>()
);

export const createMaterialFailure = createAction(
  '[MSD - Add Material] Create Material Failure'
);

export const addCustomCastingDiameter = createAction(
  '[MSD - Add Material] Add Custom Casting DIameter',
  props<{ castingDiameter: string }>()
);
