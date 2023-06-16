import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
  let spectator: Spectator<PageNotFoundComponent>;
  let component: PageNotFoundComponent;

  const createComponent = createComponentFactory({
    component: PageNotFoundComponent,
    imports: [MatButtonModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
