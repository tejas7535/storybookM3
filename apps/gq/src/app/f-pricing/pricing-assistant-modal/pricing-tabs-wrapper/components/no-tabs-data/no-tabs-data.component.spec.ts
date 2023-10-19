import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { NoTabsDataComponent } from './no-tabs-data.component';

describe('NoTabsDataComponent', () => {
  let component: NoTabsDataComponent;
  let spectator: Spectator<NoTabsDataComponent>;

  const createComponent = createComponentFactory({
    component: NoTabsDataComponent,

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
