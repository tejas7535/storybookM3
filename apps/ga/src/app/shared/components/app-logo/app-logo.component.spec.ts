import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import {
  LanguageSelectModule,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppLogoComponent } from './app-logo.component';

describe('AppLogoComponent', () => {
  let component: AppLogoComponent;
  let spectator: Spectator<AppLogoComponent>;

  const createComponent = createComponentFactory({
    component: AppLogoComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockModule(LanguageSelectModule),
      MockModule(LocaleSelectModule),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });
});
