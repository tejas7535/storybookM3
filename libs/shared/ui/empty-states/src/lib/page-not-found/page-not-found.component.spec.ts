import { MatButtonModule } from '@angular/material/button';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
  let spectator: Spectator<PageNotFoundComponent>;
  let component: PageNotFoundComponent;

  const createComponent = createComponentFactory({
    component: PageNotFoundComponent,
    imports: [MatButtonModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
