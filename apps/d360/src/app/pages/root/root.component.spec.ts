import { Router } from '@angular/router';

import { of } from 'rxjs';

import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';

import { AppRoutePath } from '../../app.routes.enum';
import { UserService } from '../../shared/services/user.service';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  const mockProviders = [mockProvider(Router, { navigate: jest.fn() })];
  const createComponent = createComponentFactory({
    component: RootComponent,
    providers: mockProviders,
  });

  it('should route european users to OverviewPage', () => {
    const testRoute = AppRoutePath.TodoPage;
    const spectator = createComponent({
      providers: [
        ...mockProviders,
        mockProvider(UserService, {
          getStartPage() {
            return of(testRoute);
          },
        }),
      ],
    });
    const router = spectator.inject(Router);

    expect(router.navigate).toHaveBeenCalledWith([testRoute]);
  });
});
