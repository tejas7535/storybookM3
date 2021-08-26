import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../i18n/en.json';
import { TruncatePipe } from '../truncate-pipe/truncate.pipe';
import { BannerTextComponent } from './banner-text.component';

describe('BannerTextComponent', () => {
  let spectator: Spectator<BannerTextComponent>;
  let component: BannerTextComponent;

  const createComponent = createComponentFactory({
    component: BannerTextComponent,
    imports: [
      provideTranslocoTestingModule({ en }),
      FlexLayoutModule,
      MatIconModule,
    ],
    declarations: [TruncatePipe],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setBannerIcon', () => {
    it('should be set to the correct one depending on input var', () => {
      component.bannerIcon = 'info';

      component.setBannerIcon();

      expect(component.icon).toStrictEqual('info');

      component.bannerIcon = 'warning';

      component.setBannerIcon();

      expect(component.icon).toStrictEqual('warning');

      component.bannerIcon = 'error';

      component.setBannerIcon();

      expect(component.icon).toStrictEqual('cancel');

      component.bannerIcon = 'success';

      component.setBannerIcon();

      expect(component.icon).toStrictEqual('check_circle');
    });
  });

  describe('clickButton', () => {
    it('should emit closeBanner event', () => {
      jest.spyOn(component.closeBanner, 'emit');

      component.clickButton();

      expect(component.closeBanner.emit).toHaveBeenCalled();
    });
  });

  describe('toggleText', () => {
    it('should emit toggleFullText event', () => {
      jest.spyOn(component.toggleFullText, 'emit');

      component.toggleText();

      expect(component.toggleFullText.emit).toHaveBeenCalled();
    });
  });
});
