import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MarketValueDriversComponent } from './market-value-drivers.component';

describe('MarketValueDriversComponent', () => {
  let component: MarketValueDriversComponent;
  let spectator: Spectator<MarketValueDriversComponent>;

  const createComponent = createComponentFactory({
    component: MarketValueDriversComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
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
