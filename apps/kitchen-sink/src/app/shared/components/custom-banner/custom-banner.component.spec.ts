import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslocoModule } from '@ngneat/transloco';
import { BannerModule } from '@schaeffler/shared/ui-components';

import { CustomBannerComponent } from './custom-banner.component';

describe('CustomBannerComponent', () => {
  let component: CustomBannerComponent;
  let fixture: ComponentFixture<CustomBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomBannerComponent],
      imports: [BannerModule, TranslocoModule, FlexLayoutModule, CommonModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('set BannerTextFn()', () => {
  //   it('should set bannerText', () => {
  //     expect(component.bannerText).toBe('');

  //     component.bannerTextFn = 'Test';

  //     expect(component.bannerText).toBe('Test');
  //   });
  // });

  // describe('set ButtonTextFn()', () => {
  //   it('should set buttonText', () => {
  //     expect(component.buttonText).toBe('OK');

  //     component.buttonTextFn = 'Test';

  //     expect(component.buttonText).toBe('Test');
  //   });
  // });

  // describe('set TruncateSizeFn()', () => {
  //   it('should set truncateSize', () => {
  //     expect(component.truncateSize).toBe(120);

  //     component.truncateSizeFn = 10;

  //     expect(component.truncateSize).toBe(10);
  //   });

  //   it('should set isFullTextShown if truncateSize is set to 0', () => {
  //     expect(component.truncateSize).toBe(120);
  //     expect(component.isFullTextShown).toBe(false);

  //     component.truncateSizeFn = 0;

  //     expect(component.truncateSize).toBe(0);
  //     expect(component.isFullTextShown).toBe(true);
  //   });
  // });

  // describe('closeBanner()', () => {
  //   test('should emit value', () => {
  //     component.isBannerShown.subscribe(val => {
  //       expect(val).toBe(false);
  //     });

  //     component.closeBanner();
  //   });
  // });
});
