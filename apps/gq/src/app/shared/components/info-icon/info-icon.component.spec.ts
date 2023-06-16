import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { InfoIconComponent } from './info-icon.component';

describe('InfoIconComponent', () => {
  let component: InfoIconComponent;
  let spectator: Spectator<InfoIconComponent>;

  const createComponent = createComponentFactory({
    component: InfoIconComponent,
    imports: [MatIconModule, MatTooltipModule],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
