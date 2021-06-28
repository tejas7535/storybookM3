import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { BackButtonModule } from '@cdba/shared/directives';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let spectator: Spectator<PageHeaderComponent>;

  const createComponent = createComponentFactory({
    component: PageHeaderComponent,
    imports: [CommonModule, MatIconModule, MockModule(BackButtonModule)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
