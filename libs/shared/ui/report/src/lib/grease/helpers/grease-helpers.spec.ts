import { checkSuitability } from './grease-helpers';

describe('checkSuitability', () => {
  it('should return a level description', () => {
    const mockLevel = '++';

    const result = checkSuitability(mockLevel);

    expect(result).toBeTruthy();
    expect(result).toBe('ExtremelySuitable');
  });
});
