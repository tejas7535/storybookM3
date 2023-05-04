import { meaningfulRound } from './number-helper';

describe('meaningfulRound', () => {
  it('should round numbers >= 1000 to the nearest 10', () => {
    expect(meaningfulRound(1542.12)).toBe(1540);
    expect(meaningfulRound(2999.99)).toBe(3000);
  });

  it('should round numbers >= 100 to the nearest integer', () => {
    expect(meaningfulRound(112.92)).toBe(113);
    expect(meaningfulRound(199.49)).toBe(199);
  });

  it('should round numbers >= 10 to one decimal place', () => {
    expect(meaningfulRound(23.456)).toBe(23.5);
    expect(meaningfulRound(99.94)).toBe(99.9);
  });

  it('should round numbers < 10 to two decimal places', () => {
    expect(meaningfulRound(1.34)).toBe(1.34);
    expect(meaningfulRound(9.999)).toBe(10);
  });
});
