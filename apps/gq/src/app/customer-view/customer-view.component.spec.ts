import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { OfferDrawerModule } from '../shared/offer-drawer/offer-drawer.module';
import { CustomerInformationModule } from './customer-information/customer-information.module';
import { CustomerViewComponent } from './customer-view.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CustomerViewComponent', () => {
  let component: CustomerViewComponent;
  let spectator: Spectator<CustomerViewComponent>;

  const createComponent = createComponentFactory({
    component: CustomerViewComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      CaseHeaderModule,
      CustomerInformationModule,
      OfferDrawerModule,
      MatCardModule,
      MatSidenavModule,
      LoadingSpinnerModule,
      ReactiveComponentModule,
    ],
    providers: [provideMockStore({})],
    declarations: [CustomerViewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should define observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.customer$).toBeDefined();
    });
  });
  describe('getOffer', () => {
    test('set offer', () => {
      component.getOffer();
      expect(component.offer$).toBeDefined();
    });
  });
});
