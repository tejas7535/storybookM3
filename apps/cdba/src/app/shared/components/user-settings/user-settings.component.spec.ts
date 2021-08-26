import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { SharedModule } from '../../shared.module';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let spectator: Spectator<UserSettingsComponent>;

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    providers: [mockProvider(TranslocoService)],
    imports: [
      SharedModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setLanguage', () => {
    it('should propagate selected language to transloco service', () => {
      component['transloco'].setActiveLang = jest.fn();

      component.setLanguage('de');

      expect(component['transloco'].setActiveLang).toHaveBeenCalledWith('de');
    });
  });
});
