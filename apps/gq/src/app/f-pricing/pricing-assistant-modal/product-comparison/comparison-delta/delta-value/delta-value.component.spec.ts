import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { DeltaValueComponent } from './delta-value.component';

describe('ComparisonDeltaComponent', () => {
  let component: DeltaValueComponent;
  let spectator: Spectator<DeltaValueComponent>;

  const createComponent = createComponentFactory({
    component: DeltaValueComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
