import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SanityChecksTableComponent } from './sanity-checks-table.component';

describe('SanityChecksTableComponent', () => {
  let component: SanityChecksTableComponent;
  let spectator: Spectator<SanityChecksTableComponent>;

  const createComponent = createComponentFactory({
    component: SanityChecksTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
