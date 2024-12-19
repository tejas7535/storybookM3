import { Router } from '@angular/router';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { AlertService } from '../../../../feature/alerts/alert.service';
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
    providers: [
      mockProvider(Router, mockRouter),
      mockProvider(AuthService),
      mockProvider(AlertService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        activeUrl: '',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
