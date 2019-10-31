import { HeadlineWrapperModule } from './headline-wrapper.module';

describe('HeadlineWrapperModule', () => {
  let headlineWrapperModule: HeadlineWrapperModule;

  beforeEach(() => {
    headlineWrapperModule = new HeadlineWrapperModule();
  });

  it('should be created', () => {
    expect(headlineWrapperModule).toBeTruthy();
  });
});
