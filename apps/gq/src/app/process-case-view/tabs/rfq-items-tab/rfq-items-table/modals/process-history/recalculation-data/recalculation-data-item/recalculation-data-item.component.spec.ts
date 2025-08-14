import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RecalculationDataItemComponent } from './recalculation-data-item.component';

describe('RecalculationDataItemComponent', () => {
  let component: RecalculationDataItemComponent;
  let spectator: Spectator<RecalculationDataItemComponent>;

  const createComponent = createComponentFactory({
    component: RecalculationDataItemComponent,
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
