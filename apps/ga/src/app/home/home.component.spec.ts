import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockModule } from 'ng-mocks';

import { AppLogoModule } from '@ga/shared/components/app-logo';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';

import { HomepageCardModule } from './components';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let spectator: Spectator<HomeComponent>;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    declarations: [HomeComponent],
    imports: [
      MockModule(HomepageCardModule),
      MockModule(AppLogoModule),
      MockComponent(QuickBearingSelectionComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should provide homepage cards', () => {
    expect(component.homepageCards).toHaveLength(8);
  });
});
