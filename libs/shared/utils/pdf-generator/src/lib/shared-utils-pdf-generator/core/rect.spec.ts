import { Rect } from './rect';

describe('Rect', () => {
  it('should calculate bottom right anchor', () => {
    const rect = new Rect(0, 0, 50, 50);
    const bottomRight = rect.BottomRight;
    expect(bottomRight.x).toEqual(50);
    expect(bottomRight.y).toEqual(50);
  });

  describe('isWithin', () => {
    const boundingRect = new Rect(0, 0, 50, 50);

    it('false for a point outside', () => {
      expect(boundingRect.isWithin(100, 50)).toEqual(false);
      expect(boundingRect.isWithin(50, 70)).toEqual(false);
      expect(boundingRect.isWithin(51, 51)).toEqual(false);
    });

    it('true for a point outside', () => {
      expect(boundingRect.isWithin(0, 0)).toEqual(true);
      expect(boundingRect.isWithin(20, 20)).toEqual(false);
    });
  });
});
