import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { TranslatedPageTitleStrategyService } from './translated-page-title-strategy.service';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key} mocked`),
}));

describe('TranslatedPageTitleStrategyService', () => {
  let spectator: SpectatorService<TranslatedPageTitleStrategyService>;

  const createService = createServiceFactory({
    service: TranslatedPageTitleStrategyService,
    providers: [{ provide: Title, useValue: { setTitle: jest.fn() } }],
  });

  beforeEach(() => {
    spectator = createService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateTitle', () => {
    it('should set title to translated titles if they exist', () => {
      // Arrange
      const snapshotMock = {
        root: { firstChild: { data: { titles: ['title1', 'title2'] } } },
        url: '/test-url',
        toString: () => '/test-url',
      } as unknown as RouterStateSnapshot;

      jest.spyOn(spectator.service, 'buildTitle').mockReturnValue('');

      // Act
      spectator.service.updateTitle(snapshotMock);

      // Assert
      expect(spectator.service['title'].setTitle).toHaveBeenCalledWith(
        'title1 mocked | title2 mocked'
      );
    });

    it('should set title to custom title if translated titles do not exist', () => {
      // Arrange
      const snapshotMock = {
        root: { firstChild: {} },
        url: '/test-url',
        toString: () => '/test-url',
      } as RouterStateSnapshot;
      jest
        .spyOn(spectator.service, 'buildTitle')
        .mockReturnValue('Custom title');

      // Act
      spectator.service.updateTitle(snapshotMock);

      // Assert
      expect(spectator.service['title'].setTitle).toHaveBeenCalledWith(
        'Custom title'
      );
    });

    it('should set title to translation of header.title if no other title exists', () => {
      // Arrange
      const snapshotMock = {
        root: { firstChild: {} },
        url: '/test-url',
        toString: () => '/test-url',
      } as RouterStateSnapshot;

      jest.spyOn(spectator.service, 'buildTitle').mockReturnValue('');

      // Act
      spectator.service.updateTitle(snapshotMock);

      // Assert
      expect(spectator.service['title'].setTitle).toHaveBeenCalledWith(
        'header.title mocked'
      );
    });
  });
});
