import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { ReasonsAndCounterMeasuresComponent } from './reasons-and-counter-measures.component';
import { ReasonsForLeavingComponent } from './reasons-for-leaving/reasons-for-leaving.component';

describe('ReasonsAndCounterMeasuresComponent', () => {
  let component: ReasonsAndCounterMeasuresComponent;
  let spectator: Spectator<ReasonsAndCounterMeasuresComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsAndCounterMeasuresComponent,
    detectChanges: false,
    declarations: [MockComponent(ReasonsForLeavingComponent)],
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
