import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DimensionDetailsComponent } from './dimension-details.component';

describe('DimensionDetailsComponent', () => {
  let component: DimensionDetailsComponent;
  let spectator: Spectator<DimensionDetailsComponent>;

  const createComponent = createComponentFactory({
    component: DimensionDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
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
