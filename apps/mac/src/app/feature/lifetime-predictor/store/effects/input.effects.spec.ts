import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';

import {
  mockedBurdeningTypes,
  mockedMaterials,
  mockedPredictions,
} from '../../mock/mock.constants';
import { MockService } from '../../mock/mock.service';
import { RestService } from '../../services/rest.service';
import { InputEffects } from '.';

describe('InputEffects', () => {
  let actions: Observable<any>;
  let effects: InputEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InputEffects,
        { provide: RestService, useClass: MockService },
        provideMockActions(() => actions),
      ],
      imports: [HttpClientTestingModule],
    });

    effects = TestBed.inject(InputEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should have a getFormOptions Effect effect that calls multiple actions', () => {
    actions = of({ type: '[Input Component] Get Form Options' });

    effects.getPredictions$.subscribe((action: any) => {
      expect(action).toEqual({
        type: '[Predict Lifetime Container Component] Set Prediction Options',
        predictions: mockedPredictions,
      });
    });

    effects.getBurdeningTypes$.subscribe((action: any) => {
      expect(action).toEqual({
        type: '[Predict Lifetime Container Component] Set BurdeningType Options',
        burdeningTypes: mockedBurdeningTypes,
      });
    });

    effects.getMaterials$.subscribe((action: any) => {
      expect(action).toEqual({
        type: '[Material Component] Set Material Options',
        materials: mockedMaterials,
      });
    });
  });
});
