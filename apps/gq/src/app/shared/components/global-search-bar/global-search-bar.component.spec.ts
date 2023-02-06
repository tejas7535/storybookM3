import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { GlobalSearchBarComponent } from './global-search-bar.component';

describe('GlobalSearchBarComponent', () => {
  let component: GlobalSearchBarComponent;
  let spectator: Spectator<GlobalSearchBarComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchBarComponent,
    imports: [
      SharedDirectivesModule,
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
    ],
    declarations: [GlobalSearchBarComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
