import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { RiskOfLeavingComponent } from './risk-of-leaving.component';

describe('RiskOfLeavingComponent', () => {
  let component: RiskOfLeavingComponent;
  let spectator: Spectator<RiskOfLeavingComponent>;

  const createComponent = createComponentFactory({
    component: RiskOfLeavingComponent,
    detectChanges: false,
    imports: [UnderConstructionModule],
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
