import { CommonModule } from '@angular/common';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { BackButtonModule } from '@cdba/shared/directives/back-button';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let spectator: Spectator<PageHeaderComponent>;

  const createComponent = createComponentFactory({
    component: PageHeaderComponent,
    imports: [CommonModule, MatIconModule, MockModule(BackButtonModule)],
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
