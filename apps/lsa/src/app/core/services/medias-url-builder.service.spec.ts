import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { MediasURLBuilderService } from './medias-url-builder.service';

const MEDIAS_SAMPLE_URL =
  'https://medias.schaeffler.com/de/lubricator-selection-assistant';

describe('MediasURLBuilderService', () => {
  let spectator: SpectatorService<MediasURLBuilderService>;

  const createService = createServiceFactory({
    service: MediasURLBuilderService,
  });

  beforeEach(() => {
    spectator = createService();
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      pathname: new URL(MEDIAS_SAMPLE_URL).pathname,
      origin: new URL(MEDIAS_SAMPLE_URL).origin,
    } as any as Location);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should get the correct base url with locale', () => {
    expect(spectator.service.getMediasBase()).toEqual(
      'https://medias.schaeffler.com/de/'
    );
  });

  it('should get the correct PDP url with locale', () => {
    expect(spectator.service.getMediasPDPUrl('12345')).toEqual(
      'https://medias.schaeffler.com/de/p/12345'
    );
  });
});
