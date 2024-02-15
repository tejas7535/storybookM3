import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { MarketValueDriverComponent } from './market-value-driver.component';

describe('MarketValueDriverComponent', () => {
  let component: MarketValueDriverComponent;
  let spectator: Spectator<MarketValueDriverComponent>;

  const createComponent = createComponentFactory({
    component: MarketValueDriverComponent,

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
