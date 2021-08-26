import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { IconsService } from './icons.service';

describe('IconsService', () => {
  describe('registerFontClassAlias', () => {
    it('should register fontClassAlias', () => {
      const matIconRegistryMock = {
        addSvgIconSet: jest.fn(),
      } as unknown as MatIconRegistry;
      const sanitizerMock = {
        bypassSecurityTrustResourceUrl: jest.fn(() => 'mockUrl'),
      } as unknown as DomSanitizer;

      const service = new IconsService(matIconRegistryMock, sanitizerMock);
      service.registerSchaefflerIconSet();
      expect(
        sanitizerMock.bypassSecurityTrustResourceUrl
      ).toHaveBeenCalledTimes(1);
      expect(sanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
        '../assets/schaeffler-icon-set.svg'
      );
      expect(matIconRegistryMock.addSvgIconSet).toHaveBeenCalledTimes(1);
      expect(matIconRegistryMock.addSvgIconSet).toHaveBeenCalledWith('mockUrl');
    });
  });
});
