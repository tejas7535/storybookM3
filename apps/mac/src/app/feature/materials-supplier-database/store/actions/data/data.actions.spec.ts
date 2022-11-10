import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/msd/constants';
import { DataResult } from '@mac/msd/models';

import {
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  resetResult,
  setAgGridColumns,
  setAgGridFilter,
  setFilter,
} from './data.actions';

describe('Data Actions', () => {
  describe('Set Filter', () => {
    it('setFilter', () => {
      const materialClass: StringOption = {
        id: 'id',
        title: 'very classy material',
      };
      const productCategory: StringOption[] = [
        {
          id: 'id',
          title: 'category a',
        },
      ];
      const action = setFilter({ materialClass, productCategory });

      expect(action).toEqual({
        materialClass,
        productCategory,
        type: '[MSD - Data] Set Filter',
      });
    });
  });
  describe('Fetch Materials', () => {
    it('fetchMaterials', () => {
      const action = fetchMaterials();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Materials',
      });
    });
  });
  describe('Fetch Materials Success', () => {
    it('fetchMaterialsSuccess', () => {
      const result: DataResult[] = [{} as DataResult];
      const action = fetchMaterialsSuccess({ result });

      expect(action).toEqual({
        materialClass: undefined,
        result,
        type: '[MSD - Data] Fetch Materials Success',
      });
    });

    it('fetchMaterialsSuccess with materialClass', () => {
      const result: DataResult[] = [{} as DataResult];
      const action = fetchMaterialsSuccess({
        materialClass: MaterialClass.ALUMINUM,
        result,
      });

      expect(action).toEqual({
        materialClass: MaterialClass.ALUMINUM,
        result,
        type: '[MSD - Data] Fetch Materials Success',
      });
    });
  });
  describe('Fetch Materials Failure', () => {
    it('fetchMaterialsSuccess', () => {
      const action = fetchMaterialsFailure();

      expect(action).toEqual({
        type: '[MSD - Data] Fetch Materials Failure',
      });
    });
  });
  describe('Set AgGrid Filter', () => {
    it('setAgGridFilter', () => {
      const action = setAgGridFilter({ filterModel: {} });

      expect(action).toEqual({
        filterModel: {},
        type: '[MSD - Data] Set AgGrid Filter',
      });
    });
  });
  describe('Reset Result', () => {
    it('resetResult', () => {
      const action = resetResult();

      expect(action).toEqual({
        type: '[MSD - Data] Reset Result',
      });
    });
  });

  describe('Set Ag Grid Columns', () => {
    it('setAgGridColumns', () => {
      const action = setAgGridColumns({ agGridColumns: 'columns' });

      expect(action).toEqual({
        agGridColumns: 'columns',
        type: '[MSD - Data] Set Ag Grid Columns',
      });
    });
  });
});
