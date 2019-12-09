import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { BannerService } from './banner.service';

import { BannerContent } from '.';

describe('BannerService', () => {
  let bannerService: BannerService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [BannerService]
    });
  });

  beforeEach(() => {
    bannerService = TestBed.get(BannerService);
  });

  test('should create the service', () => {
    expect(bannerService).toBeTruthy();
  });

  describe('bannerComponent() && openBanner()', () => {
    test('should set and emit BehaviorSubject', () => {
      let bannerComponent;
      bannerService.bannerComponent.subscribe(
        value => (bannerComponent = value)
      );
      expect(bannerComponent).toEqual({
        component: undefined
      });

      // tslint:disable-next-line: no-null-keyword
      const bannerContent: BannerContent = null;

      bannerService.openBanner(bannerContent);
      expect(bannerComponent).toEqual({
        // tslint:disable-next-line: no-null-keyword
        component: null
      });
    });
  });
});
