import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../shared/info-icon/info-icon.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { HeaderContentComponent } from './header-content.component';

describe('HeaderContentComponent', () => {
  let component: HeaderContentComponent;
  let spectator: Spectator<HeaderContentComponent>;

  const createComponent = createComponentFactory({
    component: HeaderContentComponent,
    imports: [
      InfoIconModule,
      SharedPipesModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
