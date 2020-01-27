import { Observable, of } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { provideMockActions } from '@ngrx/effects/testing';

import { configureTestSuite } from 'ng-bullet';

import { MockService } from '../../../mocks/mock.service';
import { RestService } from '../../services/rest.service';

import {
  mockedBurdeningTypes,
  mockedMaterials,
  mockedPredictions
} from '../../../mocks/mock.constants';

import { InputEffects } from '.';

describe('InputEffects', () => {
  // tslint:disable-next-line
  let actions: Observable<any>;
  let effects: InputEffects;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        InputEffects,
        { provide: RestService, useClass: MockService },
        provideMockActions(() => actions)
      ],
      imports: [HttpClientTestingModule]
    });

    effects = TestBed.get(InputEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('#getPredictions$', () => {
    it('should dispatch setPredictionOptions in Success Case', () => {});

    it('should return EMPTY in Failure Case', () => {});
  });

  it('should have a getFormOptions Effect effect that calls multiple actions', () => {
    actions = of({ type: '[Input Component] Get Form Options' });

    effects.getPredictions$.subscribe(action => {
      expect(action).toEqual({
        type: '[Predict Lifetime Container Component] Set Prediction Options',
        predictions: mockedPredictions
      });
    });

    effects.getBurdeningTypes$.subscribe(action => {
      expect(action).toEqual({
        type:
          '[Predict Lifetime Container Component] Set BurdeningType Options',
        burdeningTypes: mockedBurdeningTypes
      });
    });

    effects.getMaterials$.subscribe(action => {
      expect(action).toEqual({
        type: '[Material Component] Set Material Options',
        materials: mockedMaterials
      });
    });
  });
});
