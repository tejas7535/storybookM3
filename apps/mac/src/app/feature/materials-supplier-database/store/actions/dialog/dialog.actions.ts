import { createAction, props } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  ManufacturerSupplier,
  Material,
  MaterialStandard,
} from '@mac/msd/models';

export const addMaterialDialogOpened = createAction(
  '[MSD - Dialog] Add Material Dialog Opened'
);

export const addMaterialDialogCanceled = createAction(
  '[MSD - Dialog] Add Material Dialog Canceled'
);

export const addMaterialDialogConfirmed = createAction(
  '[MSD - Dialog] Add Material Confirmed',
  props<{ material: Material }>()
);

export const fetchMaterialStandards = createAction(
  '[MSD - Dialog] Fetch Material Standards'
);

export const fetchMaterialStandardsSuccess = createAction(
  '[MSD - Dialog] Fetch Material Standards Success',
  props<{ materialStandards: MaterialStandard[] }>()
);

export const fetchMaterialStandardsFailure = createAction(
  '[MSD - Dialog] Fetch Material Standards Failure'
);

export const fetchManufacturerSuppliers = createAction(
  '[MSD - Dialog] Fetch Manufacturer Suppliers'
);

export const fetchManufacturerSuppliersSuccess = createAction(
  '[MSD - Dialog] Fetch Manufacturer Suppliers Success',
  props<{ manufacturerSuppliers: ManufacturerSupplier[] }>()
);

export const fetchManufacturerSuppliersFailure = createAction(
  '[MSD - Dialog] Fetch Manufacturer Suppliers Failure'
);

export const fetchRatings = createAction('[MSD - Dialog] Fetch Ratings');

export const fetchRatingsSuccess = createAction(
  '[MSD - Dialog] Fetch Ratings Success',
  props<{ ratings: string[] }>()
);

export const fetchRatingsFailure = createAction(
  '[MSD - Dialog] Fetch Ratings Failure'
);

export const fetchCo2Classifications = createAction(
  '[MSD - Dialog] Fetch CO2 Classifications'
);

export const fetchCo2ClassificationsSuccess = createAction(
  '[MSD - Dialog] Fetch CO2 Classifications Success',
  props<{ co2Classifications: StringOption[] }>()
);

export const fetchCo2ClassificationsFailure = createAction(
  '[MSD - Dialog] Fetch CO2 Classifications Failure'
);

export const fetchSteelMakingProcesses = createAction(
  '[MSD - Dialog] Fetch Steel Making Processes'
);

export const fetchSteelMakingProcessesSuccess = createAction(
  '[MSD - Dialog] Fetch Steel Making Processes Success',
  props<{ steelMakingProcesses: string[] }>()
);

export const fetchSteelMakingProcessesFailure = createAction(
  '[MSD - Dialog] Fetch Steel Making Processes Failure'
);

export const fetchCastingModes = createAction(
  '[MSD - Dialog] Fetch Casting Modes'
);

export const fetchCastingModesSuccess = createAction(
  '[MSD - Dialog] Fetch Casting Modes Success',
  props<{ castingModes: string[] }>()
);

export const fetchCastingModesFailure = createAction(
  '[MSD - Dialog] Fetch Casting Modes Failure'
);

export const createMaterialComplete = createAction(
  '[MSD - Dialog] Create Material Complete',
  props<{ success: boolean }>()
);

export const createMaterialFailure = createAction(
  '[MSD - Dialog] Create Material Failure'
);

export const fetchCastingDiameters = createAction(
  '[MSD - Dialog] Fetch Casting Diameters',
  props<{ supplierId: number; castingMode: string }>()
);

export const fetchCastingDiametersSuccess = createAction(
  '[MSD - Dialog] Fetch Casting Diameters Success',
  props<{ castingDiameters: string[] }>()
);

export const fetchCastingDiametersFailure = createAction(
  '[MSD - Dialog] Fetch Casting Diameters Failure'
);

export const addCustomCastingDiameter = createAction(
  '[MSD - Dialog] Add Custom Casting DIameter',
  props<{ castingDiameter: string }>()
);
