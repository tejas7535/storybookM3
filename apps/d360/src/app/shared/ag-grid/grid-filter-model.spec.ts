import {
  formatFilterModelForAgGrid,
  formatFilterModelForBackend,
} from './grid-filter-model';

describe('Grid Filter Model', () => {
  describe('formatFilterModelForBackend', () => {
    it('should handle undefined or null filter model', () => {
      expect(formatFilterModelForBackend(null)).toEqual({});
      expect(formatFilterModelForBackend(undefined as any)).toEqual({});
    });

    it('should convert date filter types correctly', () => {
      const filterModel = {
        createdDate: {
          filterType: 'date',
          dateFrom: '2022-09-16 14:56:00',
          type: 'equals',
        },
      };

      const result = formatFilterModelForBackend(filterModel);

      expect(result.createdDate).toBeDefined();
      expect(result.createdDate.dateFrom).toBe('2022-09-16T14:56:00');
      expect(result.createdDate.filterType).toBe('date');
    });

    it('should handle complex date formats with timezone info', () => {
      const filterModel = {
        createdDate: {
          filterType: 'date',
          dateFrom: '2022-09-16 14:56:00+02:00',
          type: 'equals',
        },
      };

      const result = formatFilterModelForBackend(filterModel);

      expect(result.createdDate.dateFrom).toBe('2022-09-16T14:56:00');
    });

    it('should convert null values in set filter types to empty strings', () => {
      const filterModel = {
        status: {
          filterType: 'set',
          values: ['active', null, 'pending'],
          type: 'equals',
        },
      };

      const result = formatFilterModelForBackend(filterModel);

      expect(result.status.values).toEqual(['active', '', 'pending']);
    });

    it('should correctly process filter with operator', () => {
      const filterModel = {
        age: {
          condition1: { filterType: 'number', type: 'greaterThan', filter: 18 },
          condition2: { filterType: 'number', type: 'lessThan', filter: 65 },
          operator: 'AND',
          filterType: 'number',
        },
      };

      const result = formatFilterModelForBackend(filterModel);

      expect(result.age.filterType).toBe('and');
      expect(result.age.condition1).toEqual({
        filterType: 'number',
        type: 'greaterThan',
        filter: 18,
      });
      expect(result.age.condition2).toEqual({
        filterType: 'number',
        type: 'lessThan',
        filter: 65,
      });
    });
  });

  describe('formatFilterModelForAgGrid', () => {
    it('should handle undefined or null filter model', () => {
      expect(formatFilterModelForAgGrid(null)).toEqual({});
      expect(formatFilterModelForAgGrid(undefined as any)).toEqual({});
    });

    it('should convert ISO dates to ag-grid format', () => {
      const filterModel = {
        createdDate: {
          filterType: 'date',
          dateFrom: '2022-09-16T14:56:00',
          type: 'equals',
        },
      };

      const result = formatFilterModelForAgGrid(filterModel);

      expect(result.createdDate).toBeDefined();
      expect(result.createdDate.dateFrom).toBe('2022-09-16 14:56:00');
    });

    it('should process "and" operator filter correctly', () => {
      const filterModel = {
        age: {
          condition1: { filterType: 'number', type: 'greaterThan', filter: 18 },
          condition2: { filterType: 'number', type: 'lessThan', filter: 65 },
          filterType: 'and',
        },
      };

      const result = formatFilterModelForAgGrid(filterModel);

      expect(result.age.operator).toBe('AND');
      expect(result.age.filterType).toBe('number');
      expect(result.age.condition1).toEqual({
        filterType: 'number',
        type: 'greaterThan',
        filter: 18,
      });
      expect(result.age.condition2).toEqual({
        filterType: 'number',
        type: 'lessThan',
        filter: 65,
      });
    });

    it('should process "or" operator filter correctly', () => {
      const filterModel = {
        status: {
          condition1: { filterType: 'text', type: 'equals', filter: 'active' },
          condition2: { filterType: 'text', type: 'equals', filter: 'pending' },
          filterType: 'or',
        },
      };

      const result = formatFilterModelForAgGrid(filterModel);

      expect(result.status.operator).toBe('OR');
      expect(result.status.filterType).toBe('text');
    });

    it('should preserve regular filter types', () => {
      const filterModel = {
        name: {
          filterType: 'text',
          type: 'contains',
          filter: 'john',
        },
      };

      const result = formatFilterModelForAgGrid(filterModel);

      expect(result.name).toEqual(filterModel.name);
    });
  });
});
