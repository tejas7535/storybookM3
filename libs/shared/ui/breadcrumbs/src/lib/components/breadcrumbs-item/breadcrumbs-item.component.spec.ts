import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { BreadcrumbsItemComponent } from './breadcrumbs-item.component';

describe('BreadcrumbsItemComponent', () => {
  let component: BreadcrumbsItemComponent;
  let spectator: Spectator<BreadcrumbsItemComponent>;

  const createComponent = createComponentFactory({
    component: BreadcrumbsItemComponent,
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
