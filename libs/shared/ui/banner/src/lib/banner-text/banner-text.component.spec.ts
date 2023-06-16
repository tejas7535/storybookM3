import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../i18n/en.json';
import { TruncatePipe } from '../truncate-pipe/truncate.pipe';
import { BannerTextComponent } from './banner-text.component';

describe('BannerTextComponent', () => {
  let spectator: Spectator<BannerTextComponent>;
  let component: BannerTextComponent;

  const createComponent = createComponentFactory({
    component: BannerTextComponent,
    imports: [provideTranslocoTestingModule({ en }), MatIconModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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
      expect(component.setBannerIcon('info')).toStrictEqual('info');

      expect(component.setBannerIcon('warning')).toStrictEqual('warning');

      expect(component.setBannerIcon('error')).toStrictEqual('cancel');

      expect(component.setBannerIcon('success')).toStrictEqual('check_circle');
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
