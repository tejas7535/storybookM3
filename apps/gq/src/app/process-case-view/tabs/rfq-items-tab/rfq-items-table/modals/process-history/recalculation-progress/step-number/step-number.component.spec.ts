import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { StepNumberComponent } from './step-number.component';

describe('StepNumberComponent', () => {
  let component: StepNumberComponent;
  let spectator: Spectator<StepNumberComponent>;

  const createComponent = createComponentFactory({
    component: StepNumberComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
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
