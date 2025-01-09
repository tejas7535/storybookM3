import { combineLatest, map, Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import {
  MountingSelectOption,
  PreviousMountingOption,
  ShaftMaterialOption,
} from './calculation-selection-step.interface';

const previousMountingBase = 'dialog.previousMountingsListValues';

const previousMountingOptions = [
  { key: 'zeroToOne', value: 'LB_ZERO_TO_ONE' as const },
  { key: 'two', value: 'LB_TWO' as const },
  { key: 'three', value: 'LB_THREE' as const },
  { key: 'four', value: 'LB_FOUR' as const },
  { key: 'five', value: 'LB_FIVE' as const },
  { key: 'sixPlus', value: 'LB_SIX_PLUS' as const },
];

export const getNumberOfPreviousMountingOptions = (
  translocoService: TranslocoService
): Observable<PreviousMountingOption[]> =>
  combineLatest(
    previousMountingOptions.map((option) =>
      translocoService
        .selectTranslate(`${previousMountingBase}.${option.key}`)
        .pipe(map((label) => ({ label, value: option.value })))
    )
  );

const mountingOptionsBase = 'dialog.mountingOptionsListValues';
const mountingOptions = [
  {
    key: 'radialClearanceReduction',
    value: 'LB_RADIAL_CLEARANCE_REDUCTION' as const,
  },
  { key: 'innerRingExpansion', value: 'LB_INNER_RING_EXPANSION' as const },
];

export const getMountingOptions = (
  translocoService: TranslocoService
): Observable<MountingSelectOption[]> =>
  combineLatest(
    mountingOptions.map((option) =>
      translocoService
        .selectTranslate(`${mountingOptionsBase}.${option.key}`)
        .pipe(map((label) => ({ label, value: option.value })))
    )
  );

const shaftMaterialsBase = 'dialog.shaftMaterialListValues';
const shaftMaterialOptions = [
  {
    key: 'steel',
    value: 'STEEL_20_DEGREE' as const,
  },
  { key: '100Cr6', value: 'STEEL_100_CR_6' as const },
  { key: 'C45', value: 'STEEL_C_45' as const },
  { key: '16MnCr5', value: 'CAST_IRON_GG14' as const },
  { key: 'castIronGG26', value: 'CAST_IRON_GG26' as const },
  { key: 'castIronGGG', value: 'CAST_IRON_GGG' as const },
  { key: 'brass', value: 'BRASS' as const },
  { key: 'bronze', value: 'BRONZE' as const },
  { key: 'alloyAluminium', value: 'ALLOY_ALUMINIUM' as const },
  { key: 'userDefinedMaterial', value: 'USER_DEFINED_MATERIAL' as const },
];

export const getShaftMaterialsOptions = (
  translocoService: TranslocoService
): Observable<ShaftMaterialOption[]> =>
  combineLatest(
    shaftMaterialOptions.map((option) =>
      translocoService
        .selectTranslate(`${shaftMaterialsBase}.${option.key}`)
        .pipe(map((label) => ({ label, value: option.value })))
    )
  );
