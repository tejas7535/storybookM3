import { PageNotFoundModule } from './page-not-found.module';

describe('PageNotFoundModule', () => {
  let module: PageNotFoundModule;

  beforeEach(() => {
    module = new PageNotFoundModule();
  });

  it('should exist', () => {
    expect(module).toBeDefined();
  });
});
