import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory(AppComponent);

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
  });

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have as title `Lubricator selection assistant`', () => {
    expect(spectator.component.title).toEqual('Lubricator selection assistant');
  });

  it('should render title', () => {
    spectator.detectChanges();
    const compiled = spectator.fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Lubricator selection assistant'
    );
  });
});
