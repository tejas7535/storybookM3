import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { configureTestSuite } from 'ng-bullet';

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
