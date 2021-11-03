import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { HorizontalDividerModule } from '../../../../shared/components/horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '../../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { MaterialDetailsComponent } from './material-details.component';
import { MaterialSalesOrgDetailsComponent } from './material-sales-org-details/material-sales-org-details.component';

describe('MaterialDetailsComponent', () => {
  let component: MaterialDetailsComponent;
  let spectator: Spectator<MaterialDetailsComponent>;

  const createComponent = createComponentFactory({
    component: MaterialDetailsComponent,
    detectChanges: false,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatCardModule,
      SharedPipesModule,
      LabelTextModule,
      HorizontalDividerModule,
      ReactiveComponentModule,
    ],
    declarations: [MaterialSalesOrgDetailsComponent],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
