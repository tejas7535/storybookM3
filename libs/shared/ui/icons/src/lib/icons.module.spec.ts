import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { iconsFactory, IconsModule } from './icons.module';

describe('IconsModule', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconsModule],
    });
  });

  test('should create', () => {
    expect(IconsModule).toBeDefined();
  });

  describe('iconsFactory', () => {
    test('should call iconsService.registerFontClassAlias', () => {
      const iconsService = {
        registerFontClassAlias: jest.fn(),
      };

      const func = iconsFactory(iconsService);
      func();
      expect(iconsService.registerFontClassAlias).toHaveBeenCalledTimes(1);
    });
  });
});
