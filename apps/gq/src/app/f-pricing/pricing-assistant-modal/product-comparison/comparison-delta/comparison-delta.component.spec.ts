import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { ComparisonDeltaComponent } from './comparison-delta.component';

describe('ComparisonDeltaComponent', () => {
  let component: ComparisonDeltaComponent;
  let spectator: Spectator<ComparisonDeltaComponent>;

  const createComponent = createComponentFactory({
    component: ComparisonDeltaComponent,
    providers: [provideMockStore()],
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
