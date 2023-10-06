import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MATERIAL_DETAILS_MOCK } from '../../../../testing/mocks/models/material-details.mock';
import { PricingAssistantHeaderComponent } from './pricing-assistant-header.component';

describe('PricingAssistantHeaderComponent', () => {
  let component: PricingAssistantHeaderComponent;
  let spectator: Spectator<PricingAssistantHeaderComponent>;

  const createComponent = createComponentFactory({
    component: PricingAssistantHeaderComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    component.material = MATERIAL_DETAILS_MOCK;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
