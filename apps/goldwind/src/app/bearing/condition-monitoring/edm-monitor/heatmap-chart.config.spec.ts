import { getClassificationString } from './heatmap-chart.config';
describe('getClassificationString', () => {
  it('should return a string matching the class description', () => {
    expect(getClassificationString(0)).toBe('0 - 10');
    expect(getClassificationString(1)).toBe('10 - 100');
    expect(getClassificationString(2)).toBe('100 - 1000');
    expect(getClassificationString(3)).toBe('1000 - 10000');
    expect(getClassificationString(4)).toBe('> 10000');
    expect(getClassificationString(-1)).toBe('n.A.');
  });
});
