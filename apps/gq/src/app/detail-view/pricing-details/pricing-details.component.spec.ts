import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { MaterialDetailsModule } from './material-details/material-details.module';
import { PricingDetailsComponent } from './pricing-details.component';

describe('PricingDetailsComponent', () => {
  let component: PricingDetailsComponent;
  let spectator: Spectator<PricingDetailsComponent>;

  const createComponent = createComponentFactory({
    component: PricingDetailsComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      MatCardModule,
      MaterialDetailsModule,
      MatExpansionModule,
      provideTranslocoTestingModule({}),
      ReactiveComponentModule,
    ],
    providers: [provideMockStore({})],
    declarations: [PricingDetailsComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set observable', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();
      expect(component.materialDetails$).toBeDefined();
    });
  });
});
