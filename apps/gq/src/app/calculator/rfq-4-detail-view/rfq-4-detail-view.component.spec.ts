import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Rfq4DetailViewHeaderComponent } from './header/rfq-4-detail-view-header.component';
import { InformationComponent } from './information/information.component';
import { RecalculationComponent } from './recalculation/recalculation.component';
import { Rfq4DetailViewComponent } from './rfq-4-detail-view.component';

describe('Rfq4DetailViewComponent', () => {
  let component: Rfq4DetailViewComponent;
  let spectator: Spectator<Rfq4DetailViewComponent>;

  const createComponent = createComponentFactory({
    component: Rfq4DetailViewComponent,
    imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      provideTranslocoTestingModule({}),
      InformationComponent,
      RecalculationComponent,
      Rfq4DetailViewHeaderComponent,
    ],
    providers: [
      provideMockStore({}),
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
