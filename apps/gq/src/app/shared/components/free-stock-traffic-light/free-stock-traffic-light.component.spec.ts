import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { FreeStockTrafficLightComponent } from './free-stock-traffic-light.component';

describe('FreeStockTrafficLightComponent', () => {
  let component: FreeStockTrafficLightComponent;
  let spectator: Spectator<FreeStockTrafficLightComponent>;

  const createComponent = createComponentFactory({
    component: FreeStockTrafficLightComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
