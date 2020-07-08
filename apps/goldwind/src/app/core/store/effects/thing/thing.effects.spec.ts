import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { DataService } from '../../../http/data.service';
import { getThing, getThingSuccess } from '../../actions/thing/thing.actions';
import { ThingEffects } from './thing.effects';

describe('Search Effects', () => {
  let actions$: any;
  let action: any;
  let effects: ThingEffects;
  let dataService: DataService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ThingEffects,
        provideMockActions(() => actions$),
        {
          provide: DataService,
          useValue: {
            getIotThings: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(ThingEffects);
    dataService = TestBed.inject(DataService);
  });

  describe('loadThing&', () => {
    describe('thing$', () => {
      beforeEach(() => {
        action = getThing({ thingId: 123 });
      });

      test('should return searchSuccess action when REST call is successful', () => {
        const thing = {
          name: 'Test',
          description: 'Test',
        };

        const result = getThingSuccess({
          thing,
        });

        actions$ = hot('-a', { a: action });

        const response = cold('-a|', {
          a: thing,
        });
        const expected = cold('--b', { b: result });

        dataService.getIotThings = jest.fn(() => response);

        expect(effects.thing$).toBeObservable(expected);
        expect(dataService.getIotThings).toHaveBeenCalledTimes(1);
        expect(dataService.getIotThings).toHaveBeenCalledWith(123);
      });
    });

    describe('ngrxOnInitEffects', () => {
      test('should return getThing', () => {
        const result = effects.ngrxOnInitEffects();

        expect(result).toEqual(getThing({ thingId: 123 }));
      });
    });
  });
});
