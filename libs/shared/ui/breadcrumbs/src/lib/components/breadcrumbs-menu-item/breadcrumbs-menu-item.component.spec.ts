import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockModule } from 'ng-mocks';

import { BreadcrumbsMenuItemComponent } from './breadcrumbs-menu-item.component';

describe('BreadcrumbsMenuItemComponent', () => {
  let component: BreadcrumbsMenuItemComponent;
  let spectator: Spectator<BreadcrumbsMenuItemComponent>;

  const createComponent = createComponentFactory({
    component: BreadcrumbsMenuItemComponent,
    imports: [
      MockModule(MatIconModule),
      MockModule(MatTooltipModule),
      RouterTestingModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
