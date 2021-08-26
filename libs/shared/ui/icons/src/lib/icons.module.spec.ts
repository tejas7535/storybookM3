import { iconsFactory } from './icons.module';
import { IconsService } from './icons.service';

describe('IconsModule', () => {
  describe('iconsFactory', () => {
    test('should call iconsService.registerFontClassAlias', () => {
      const iconsService = {
        registerSchaefflerIconSet: jest.fn(),
      };

      const func = iconsFactory(iconsService as unknown as IconsService);
      func();
      expect(iconsService.registerSchaefflerIconSet).toHaveBeenCalledTimes(1);
    });
  });
});
