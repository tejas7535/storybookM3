import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let spectator: Spectator<UserSettingsComponent>;

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    providers: [mockProvider(TranslocoLocaleService)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
