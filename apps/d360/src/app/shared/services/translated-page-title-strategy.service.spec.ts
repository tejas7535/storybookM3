import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';

import { MockProvider } from 'ng-mocks';

import { Stub } from '../test/stub.class';
import { TranslatedPageTitleStrategyService } from './translated-page-title-strategy.service';

describe('TranslatedPageTitleStrategyService', () => {
  let service: TranslatedPageTitleStrategyService;

  beforeEach(() => {
    service = Stub.get<TranslatedPageTitleStrategyService>({
      component: TranslatedPageTitleStrategyService,
      providers: [MockProvider(Title, { setTitle: jest.fn() }, 'useValue')],
    });
  });

  describe('updateTitle', () => {
    it('should set title to translated titles if they exist', () => {
      // Arrange
      const snapshotMock = {
        root: { firstChild: { data: { titles: ['title1', 'title2'] } } },
        url: '/test-url',
        toString: () => '/test-url',
      } as unknown as RouterStateSnapshot;

      jest.spyOn(service, 'buildTitle').mockReturnValue('');

      // Act
      service.updateTitle(snapshotMock);

      // Assert
      expect(service['title'].setTitle).toHaveBeenCalledWith('title1 | title2');
    });

    it('should set title to custom title if translated titles do not exist', () => {
      // Arrange
      const snapshotMock = {
        root: { firstChild: {} },
        url: '/test-url',
        toString: () => '/test-url',
      } as RouterStateSnapshot;
      jest.spyOn(service, 'buildTitle').mockReturnValue('Custom title');

      // Act
      service.updateTitle(snapshotMock);

      // Assert
      expect(service['title'].setTitle).toHaveBeenCalledWith('Custom title');
    });

    it('should set title to translation of header.title if no other title exists', () => {
      // Arrange
      const snapshotMock = {
        root: { firstChild: {} },
        url: '/test-url',
        toString: () => '/test-url',
      } as RouterStateSnapshot;

      jest.spyOn(service, 'buildTitle').mockReturnValue('');

      // Act
      service.updateTitle(snapshotMock);

      // Assert
      expect(service['title'].setTitle).toHaveBeenCalledWith('header.title');
    });
  });
});
