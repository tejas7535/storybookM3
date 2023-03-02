import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { OverviewTabComponent } from './overview-tab.component';

describe('OverviewTabComponent', () => {
  let component: OverviewTabComponent;
  let spectator: Spectator<OverviewTabComponent>;
  const createComponent = createComponentFactory({
    component: OverviewTabComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
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
