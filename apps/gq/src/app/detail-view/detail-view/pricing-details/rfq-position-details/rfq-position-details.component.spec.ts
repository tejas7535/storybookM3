import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RfqPositionDetailsComponent } from './rfq-position-details.component';

describe('RfqPositionDetailsComponent', () => {
  let component: RfqPositionDetailsComponent;
  let spectator: Spectator<RfqPositionDetailsComponent>;

  const createComponent = createComponentFactory({
    component: RfqPositionDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
