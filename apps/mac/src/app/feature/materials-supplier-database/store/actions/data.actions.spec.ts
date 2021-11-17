import { DataFilter, DataResult } from '../../models';
import {
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
  resetResult,
  setAgGridColumns,
  setAgGridFilter,
  setFilter,
  setFilteredRows,
} from './data.actions';

describe('Data Actions', () => {
  describe('Set Filter', () => {
    it('setFilter', () => {
      const materialClass: DataFilter = {
        id: 1,
        name: 'very classy material',
      };
      const productCategory: DataFilter[] = [
        {
          id: 1,
          name: 'category a',
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
  describe('Set Filtered Rows', () => {
    it('setAgGridFilter', () => {
      const action = setFilteredRows({ filteredResult: [] });

      expect(action).toEqual({
        filteredResult: [],
        type: '[MSD - Data] Set Filtered Rows',
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
