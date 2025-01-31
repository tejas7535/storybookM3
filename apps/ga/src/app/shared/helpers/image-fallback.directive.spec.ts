import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { ImageFallbackDirective } from './image-fallback.directive';

describe('ImageFallbackDirective', () => {
  let spectator: SpectatorDirective<ImageFallbackDirective>;
  const createDirective = createDirectiveFactory(ImageFallbackDirective);

  beforeEach(() => {
    spectator = createDirective(
      `<img id="test" src="example" default="fallback">`
    );
  });

  it('should not change anything on success', () => {
    spectator.dispatchFakeEvent('#test', 'load');
    expect(spectator.element.getAttribute('src')).toEqual('example');
  });

  it('should swap to error source', () => {
    spectator.dispatchFakeEvent('#test', 'error');
    expect(spectator.element.getAttribute('src')).toEqual('fallback');
  });
});
