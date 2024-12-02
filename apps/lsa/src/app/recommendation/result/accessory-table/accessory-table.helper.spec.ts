import { Accessory } from '@lsa/shared/models';

import { toCamelCase, transformAccessories } from './accessory-table.helper';

const MOCK_ACCESSORIES: Partial<Accessory>[] = [
  {
    class: 'Test',
    class_id: '1',
    designation: 'Sample Product #1',
  },
  {
    class: 'Test 3',
    class_id: '2',
    designation: 'Sample Product #2',
  },
  {
    class: 'Test 3',
    class_id: '2',
    designation: 'Sample Product #3',
  },
];

describe('AccessoryTableHelper', () => {
  describe('transformAccessories', () => {
    it('should group items based on their class', () => {
      const priorities = new Map<string, number>();
      const groups = transformAccessories(
        MOCK_ACCESSORIES as Accessory[],
        priorities
      );
      expect(Object.keys(groups)).toEqual(['Test', 'Test 3']);
    });

    it('should add the priorities when provided with the map', () => {
      const priorities = new Map<string, number>();
      priorities.set('2', 99);
      priorities.set('1', 5);
      const groups = transformAccessories(
        MOCK_ACCESSORIES as Accessory[],
        priorities
      );
      expect(Object.keys(groups)).toEqual(['Test', 'Test 3']);
      expect(groups['Test 3'].groupClassPriority).toEqual(99);
      expect(groups['Test'].groupClassPriority).toEqual(5);
    });

    it('set the priority to 0 when the map is empty', () => {
      const priorities = new Map<string, number>();
      const groups = transformAccessories(
        MOCK_ACCESSORIES as Accessory[],
        priorities
      );
      expect(Object.keys(groups)).toEqual(['Test', 'Test 3']);
      expect(groups['Test 3'].groupClassPriority).toEqual(0);
      expect(groups['Test'].groupClassPriority).toEqual(0);
    });
  });

  describe('toCamelCase', () => {
    it('should convert a single word to lowercase', () => {
      expect(toCamelCase('Hello')).toBe('hello');
    });

    it('should convert multiple words to camel case', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });

    it('should handle hyphens and underscores', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });

    it('should handle mixed cases', () => {
      expect(toCamelCase('Hello World')).toBe('helloWorld');
      expect(toCamelCase('Hello-World')).toBe('helloWorld');
      expect(toCamelCase('Hello_World')).toBe('helloWorld');
    });

    it('should handle complex strings', () => {
      expect(toCamelCase('Sub-distributors')).toBe('subDistributors');
      expect(toCamelCase('multi_word-string example')).toBe(
        'multiWordStringExample'
      );
    });
  });
});
