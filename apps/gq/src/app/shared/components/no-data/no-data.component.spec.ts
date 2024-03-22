import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { NoDataComponent } from './no-data.component';

describe('NoTabsDataComponent', () => {
  let component: NoDataComponent;
  let spectator: Spectator<NoDataComponent>;

  const createComponent = createComponentFactory({
    component: NoDataComponent,

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
