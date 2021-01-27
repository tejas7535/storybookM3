import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getRoles } from '@schaeffler/auth';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { UserRoles } from '../../shared/roles/user-roles.enum';
import { FilterPricingComponent } from './filter-pricing.component';

describe('FilterPricingComponent', () => {
  let component: FilterPricingComponent;
  let spectator: Spectator<FilterPricingComponent>;
  let store: MockStore;
  const createComponent = createComponentFactory({
    component: FilterPricingComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      MatCardModule,
      MatIconModule,
      MatInputModule,
      ReactiveComponentModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [provideMockStore({})],
    declarations: [FilterPricingComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    store = spectator.inject(MockStore);
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set manualPricePermission to true', () => {
      store.overrideSelector(getRoles, [UserRoles.MANUAL_PRICE]);

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.manualPricePermission$).toBeTruthy();
    });
  });
});
