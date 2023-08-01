import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

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

  describe('when info text provided', () => {
    beforeEach(() => {
      component.infoText = 'some info text';
      spectator.detectChanges();
    });

    it('should display info text', () => {
      const infoDiv: HTMLDivElement = spectator.query('.text-subtitle-2');

      expect(infoDiv.textContent.trim()).toBe('some info text');
    });
  });
});
