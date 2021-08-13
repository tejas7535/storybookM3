import { AppShellModule } from './app-shell.module';

describe('AppShellModule', () => {
  let module: AppShellModule;

  beforeEach(() => {
    module = new AppShellModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
