import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialSalesOrgDetailsComponent } from './material-sales-org-details.component';

describe('MaterialSalesOrgDetailsComponent', () => {
  let component: MaterialSalesOrgDetailsComponent;
  let spectator: Spectator<MaterialSalesOrgDetailsComponent>;

  const createComponent = createComponentFactory({
    component: MaterialSalesOrgDetailsComponent,
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
