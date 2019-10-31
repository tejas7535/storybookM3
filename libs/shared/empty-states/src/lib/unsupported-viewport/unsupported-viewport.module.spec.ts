import { UnsupportedViewportModule } from './unsupported-viewport.module';

describe('UnsupportedViewportModule', () => {
  let unsupportedViewportModule: UnsupportedViewportModule;

  beforeEach(() => {
    unsupportedViewportModule = new UnsupportedViewportModule();
  });

  it('should be created', () => {
    expect(unsupportedViewportModule).toBeTruthy();
  });
});
