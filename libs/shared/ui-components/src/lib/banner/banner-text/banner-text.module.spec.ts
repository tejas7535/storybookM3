import { BannerTextModule } from './banner-text.module';

describe('BannerTextModule', () => {
  let module: BannerTextModule;

  beforeEach(() => {
    module = new BannerTextModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
