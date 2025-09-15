import { signal } from '@angular/core';
import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { firstValueFrom, Observable, of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { environment } from '@mm/environments/environment';
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { EaDeliveryService } from '@schaeffler/engineering-apps-behaviors/utils';

import { ProductImagesResponse } from './api.model';
import { ProductImageResolverService } from './product-image-resolver.service';

describe('ProductImageResolverService', () => {
  let spectator: SpectatorHttp<ProductImageResolverService>;
  let service: ProductImageResolverService;

  const createService = createHttpFactory({
    service: ProductImageResolverService,
    providers: [
      ProductImageResolverService,
      MockProvider(TranslocoService),
      MockProvider(EaDeliveryService, {
        assetsPath: signal('/base/assets/'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ProductImageResolverService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call out to the api to obtain the images', waitForAsync(async () => {
    const imagePromise = firstValueFrom(
      service['resolveImageDesignation']('6226')
    );

    const cacheSpy = jest
      .spyOn(service['urlCache'], 'has')
      .mockReturnValueOnce(false);

    const req = spectator.expectOne(
      environment.productImageUrl,
      HttpMethod.POST
    );
    expect(req.request.body['bearingDesignations']).toEqual(['6226']);
    await imagePromise;
    expect(cacheSpy).toHaveBeenCalledWith('6226');
  }));

  describe('resolveImageDesignation', () => {
    let makeImageMockMock: jest.Mock<Observable<ProductImagesResponse>>;

    beforeEach(() => {
      makeImageMockMock = jest.fn(() =>
        of({ product_images: { '6226': 'fakeurl' } })
      );
      service['makeImageResolutionRequest'] = makeImageMockMock;
    });

    it('should immediately resolve if the value is in the cache', fakeAsync(() => {
      const hasSpy = jest
        .spyOn(service['urlCache'], 'has')
        .mockReturnValue(true);
      const getSpy = jest
        .spyOn(service['urlCache'], 'get')
        .mockReturnValue('cachedvalue');

      let returnUrl;
      service.resolveImageDesignation('6226').subscribe((url) => {
        returnUrl = url;
      });

      tick(2500);

      expect(hasSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(returnUrl).toEqual('cachedvalue');
    }));

    it('should add to the queue and trigger a subject emissions for non cached values', fakeAsync(() => {
      const hasSpy = jest
        .spyOn(service['urlCache'], 'has')
        .mockReturnValue(false);
      let returnUrl;
      service.resolveImageDesignation('6226').subscribe((url) => {
        returnUrl = url;
      });
      tick(5500);
      expect(hasSpy).toHaveBeenCalled();

      expect(returnUrl).toEqual('fakeurl');
    }));
  });
});
