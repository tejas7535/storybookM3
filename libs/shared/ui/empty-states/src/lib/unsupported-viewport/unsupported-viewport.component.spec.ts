import { FlexLayoutModule } from '@angular/flex-layout';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { UnsupportedViewportComponent } from './unsupported-viewport.component';

describe('UnsupportedViewportComponent', () => {
  let spectator: Spectator<UnsupportedViewportComponent>;
  let component: UnsupportedViewportComponent;

  const createComponent = createComponentFactory({
    component: UnsupportedViewportComponent,
    imports: [provideTranslocoTestingModule({}), FlexLayoutModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('Should create a component', () => {
    expect(component).toBeTruthy();
  });
});
