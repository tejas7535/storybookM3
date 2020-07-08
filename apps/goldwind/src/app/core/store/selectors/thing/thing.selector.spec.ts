import { initialState } from '../../reducers/thing/thing.reducer';
import { getThingLoading, getThingThing } from './thing.selector';

describe('Thing Selector', () => {
  const fakeState = {
    thing: {
      ...initialState,
      thing: {
        thing: {
          name: 'Thingname',
        },
        loading: false,
      },
    },
  };

  describe('getThingLoading', () => {
    test('should return loading status', () => {
      expect(getThingLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getThingThing', () => {
    test('should return a thing', () => {
      expect(getThingThing(fakeState)).toEqual(fakeState.thing.thing.thing);
    });
  });
});
