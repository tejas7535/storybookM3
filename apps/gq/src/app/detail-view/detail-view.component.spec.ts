import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { CaseHeaderModule } from '../shared/case-header/case-header.module';
import { OfferDrawerModule } from '../shared/offer-drawer/offer-drawer.module';
import { DetailViewComponent } from './detail-view.component';
import { FilterPricingModule } from './filter-pricing/filter-pricing.module';
import { PricingDetailsModule } from './pricing-details/pricing-details.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let spectator: Spectator<DetailViewComponent>;

  const createComponent = createComponentFactory({
    component: DetailViewComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      CaseHeaderModule,
      FilterPricingModule,
      OfferDrawerModule,
      MatButtonModule,
      MatSidenavModule,
      PricingDetailsModule,
    ],
    providers: [provideMockStore({})],
    declarations: [DetailViewComponent],
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

      expect(component.quotation$).toBeDefined();
    });
  });
  describe('getOffer', () => {
    test('set offer', () => {
      component.getOffer();
      expect(component.offer$).toBeDefined();
    });
  });
});
