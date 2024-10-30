import { Router } from '@angular/router';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { AuthService } from '../../../utils/auth/auth.service';
import { TabBarNavigationComponent } from './tab-bar-navigation.component';

const mockRouter = {
  get events() {
    return of([]);
  },
};

describe('TabBarNavigationComponent', () => {
  let spectator: Spectator<TabBarNavigationComponent>;

  const createComponent = createComponentFactory({
    component: TabBarNavigationComponent,
    providers: [mockProvider(Router, mockRouter), mockProvider(AuthService)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
