import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RecalculationProgressComponent } from './recalculation-progress.component';

describe('RecalculationProgressComponent', () => {
  let component: RecalculationProgressComponent;

  let spectator: Spectator<RecalculationProgressComponent>;

  const createComponent = createComponentFactory({
    component: RecalculationProgressComponent,
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
