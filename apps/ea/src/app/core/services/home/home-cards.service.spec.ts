import { waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Card } from './card.model';
import { HomeCardsService } from './home-cards.service';

const assetsPath = 'assetPath';
jest.mock(
  '@ea/core/services/assets-path-resolver/assets-path-resolver.helper',
  () => ({
    getAssetsPath: jest.fn(() => assetsPath),
  })
);

describe('HomeCardsService', () => {
  let spectator: SpectatorService<HomeCardsService>;
  let service: HomeCardsService;

  const createServiceWithProductionConfig = createServiceFactory({
    service: HomeCardsService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [provideRouter([])],
  });

  beforeEach(() => {
    spectator = createServiceWithProductionConfig();
    service = spectator.inject(HomeCardsService);
    Object.defineProperty(window, 'open', {
      value: jest.fn(),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting home cards', () => {
    let result: Card[];

    beforeAll(async () => {
      result = await firstValueFrom(service.homeCards$);
    });

    it('should get home cards', waitForAsync(() => {
      expect(result).toMatchSnapshot();
    }));

    describe('when performing any link action', () => {
      it('should open url', waitForAsync(() => {
        const expectedUrls = [
          'homePage.cards.greaseApp.externalLink',
          'homePage.cards.mountingManager.externalLink',
          'homePage.cards.catalog.externalLink',
          'homePage.cards.contact.externalLink',
        ];

        result.forEach((card) => card.action());

        expect(window.open).toBeCalledTimes(expectedUrls.length);

        expectedUrls.forEach((url) => {
          expect(window.open).toBeCalledWith(url, '_blank');
        });
      }));
    });
  });

  describe('when getting sustainability card', () => {
    let result: Card;

    beforeAll(async () => {
      result = await firstValueFrom(service.sustainabilityCard$);
    });

    it('should get sustainability card', waitForAsync(() => {
      expect(result).toMatchSnapshot();
    }));

    describe('when performing sustainability action', () => {
      it('should open url', waitForAsync(() => {
        result.action();

        expect(window.open).toBeCalled();

        expect(window.open).toBeCalledWith(
          'homePage.sustainabilityCard.action.url',
          '_blank'
        );
      }));
    });
  });
});
