import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RiskOfLeavingComponent } from './risk-of-leaving.component';

describe('RiskOfLeavingComponent', () => {
  let component: RiskOfLeavingComponent;
  let spectator: Spectator<RiskOfLeavingComponent>;

  const createComponent = createComponentFactory({
    component: RiskOfLeavingComponent,
    detectChanges: false,
    imports: [
      UnderConstructionModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [RiskOfLeavingComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
