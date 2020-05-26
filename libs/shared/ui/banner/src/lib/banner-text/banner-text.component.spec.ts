import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { configureTestSuite } from 'ng-bullet';

import { Icon } from '@schaeffler/icons';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { TruncatePipe } from '../truncate-pipe/truncate.pipe';
import { BannerTextComponent } from './banner-text.component';

describe('BannerTextComponent', () => {
  let component: BannerTextComponent;
  let fixture: ComponentFixture<BannerTextComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BannerTextComponent, TruncatePipe],
      imports: [
        provideTranslocoTestingModule({}),
        FlexLayoutModule,
        MatIconModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setBannerIcon', () => {
    it('should be set to the correct one depending on input var', () => {
      component.bannerIcon = 'info';

      component.setBannerIcon();

      expect(component.icon).toStrictEqual(
        new Icon('icon-toast-information', false)
      );

      component.bannerIcon = 'warning';

      component.setBannerIcon();

      expect(component.icon).toStrictEqual(
        new Icon('icon-toast-warning', false)
      );

      component.bannerIcon = 'error';

      component.setBannerIcon();

      expect(component.icon).toStrictEqual(new Icon('icon-toast-error', false));

      component.bannerIcon = 'success';

      component.setBannerIcon();

      expect(component.icon).toStrictEqual(
        new Icon('icon-toast-success', false)
      );
    });
  });

  describe('clickButton', () => {
    it('should emit closeBanner event', () => {
      spyOn(component.closeBanner, 'emit');

      component.clickButton();

      expect(component.closeBanner.emit).toHaveBeenCalled();
    });
  });

  describe('toggleText', () => {
    it('should emit toggleFullText event', () => {
      spyOn(component.toggleFullText, 'emit');

      component.toggleText();

      expect(component.toggleFullText.emit).toHaveBeenCalled();
    });
  });
});
