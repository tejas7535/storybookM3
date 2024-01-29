import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialAdditionalComponent } from './material-additional.component';

describe('MaterialAdditionalComponent', () => {
  let component: MaterialAdditionalComponent;
  let spectator: Spectator<MaterialAdditionalComponent>;

  const createComponent = createComponentFactory({
    component: MaterialAdditionalComponent,
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
