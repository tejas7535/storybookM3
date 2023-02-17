import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { InfoBannerComponent } from './info-banner.component';

describe('InfoBannerComponent', () => {
  let component: InfoBannerComponent;
  let spectator: Spectator<InfoBannerComponent>;

  const createComponent = createComponentFactory({
    component: InfoBannerComponent,
    imports: [MatIconModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
