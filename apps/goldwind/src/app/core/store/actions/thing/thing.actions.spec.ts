import { getThing, getThingFailure, getThingSuccess } from '..';

describe('Thing Actions', () => {
  let thingId: number;

  beforeEach(() => {
    thingId = 123;
  });

  describe('Get Thing Actions', () => {
    test('getItem', () => {
      const action = getThing({ thingId });

      expect(action).toEqual({
        thingId,
        type: '[Thing] Load Thing',
      });
    });

    test('getItemSuccess', () => {
      const thing: any = {};
      const action = getThingSuccess({ thing });

      expect(action).toEqual({
        thing,
        type: '[Thing] Load Thing Success',
      });
    });

    test('getItemFailure', () => {
      const action = getThingFailure();

      expect(action).toEqual({
        type: '[Thing] Load Thing Failure',
      });
    });
  });
});
