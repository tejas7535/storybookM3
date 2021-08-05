import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ReasonsAndCounterMeasuresComponent } from './reasons-and-counter-measures.component';
import { ReasonsForLeavingModule } from './reasons-for-leaving/reasons-for-leaving.module';

describe('ReasonsAndCounterMeasuresComponent', () => {
  let component: ReasonsAndCounterMeasuresComponent;
  let spectator: Spectator<ReasonsAndCounterMeasuresComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsAndCounterMeasuresComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      ReasonsForLeavingModule,
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  describe('ReasonsAndCounterMeasuresComponent', () => {
    test('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
