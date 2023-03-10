import { MaterialClass } from '../constants';
import { navigationLevelFactory } from './navigation-level-factory-helper';

describe('navigationLevelFactory', () => {
  it('should provide a default object', () => {
    const result = navigationLevelFactory();

    const expected: { [key: string]: any } = {};

    for (const materialClass of Object.values(MaterialClass)) {
      expected[materialClass] = {
        materials: undefined,
        suppliers: undefined,
        materialStandards: undefined,
      };
    }

    expect(result).toEqual(expected);
  });

  it('should provide a default object with default values', () => {
    const result = navigationLevelFactory<string>('test');

    const expected: { [key: string]: any } = {};

    for (const materialClass of Object.values(MaterialClass)) {
      expected[materialClass] = {
        materials: 'test',
        suppliers: 'test',
        materialStandards: 'test',
      };
    }

    expect(result).toEqual(expected);
  });
});
