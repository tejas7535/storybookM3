import { iconsFactory } from './icons.module';
import { IconsService } from './icons.service';

describe('IconsModule', () => {
  describe('iconsFactory', () => {
    test('should call iconsService.registerFontClassAlias', () => {
      const iconsService = {
        registerFontClassAlias: jest.fn(),
      };

      const func = iconsFactory((iconsService as unknown) as IconsService);
      func();
      expect(iconsService.registerFontClassAlias).toHaveBeenCalledTimes(1);
    });
  });
});
