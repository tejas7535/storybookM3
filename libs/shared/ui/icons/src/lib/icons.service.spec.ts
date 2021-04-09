import { MatIconRegistry } from '@angular/material/icon';

import { IconsService } from './icons.service';

describe('IconsService', () => {
  describe('registerFontClassAlias', () => {
    test('should register fontClassAlias', () => {
      const matIconRegistryMock = ({
        registerFontClassAlias: jest.fn(),
      } as unknown) as MatIconRegistry;

      const service = new IconsService(matIconRegistryMock);
      service.registerFontClassAlias();
      expect(matIconRegistryMock.registerFontClassAlias).toHaveBeenCalledTimes(
        1
      );
      expect(matIconRegistryMock.registerFontClassAlias).toHaveBeenCalledWith(
        'schaeffler-icons',
        'icon'
      );
    });
  });
});
