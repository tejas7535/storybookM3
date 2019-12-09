import { CustomBannerModule } from './custom-banner.module';

describe('CustomBannerModule', () => {
  let module: CustomBannerModule;

  beforeEach(() => {
    module = new CustomBannerModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
