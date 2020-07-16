import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { REFRENCE_TYPE_MOCK } from '../../testing/mocks';
import {
  getReferenceType,
  getReferenceTypeLoading,
} from '../core/store/selectors/details/detail.selector';
import { BlockUiModule } from '../shared/block-ui/block-ui.module';
import { SharedModule } from '../shared/shared.module';
import { CustomerModule } from './customer/customer.module';
import { DetailComponent } from './detail.component';
import { DimensionAndWeightModule } from './dimension-and-weight/dimension-and-weight.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductionModule } from './production/production.module';
import { QuantitiesModule } from './quantities/quantities.module';
import { SalesAndDescriptionModule } from './sales-and-description/sales-and-description.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let location: Location;

  const locationStub = {
    back: jasmine.createSpy('back'),
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        MatIconModule,
        MatCardModule,
        NoopAnimationsModule,
        SharedModule,
        RouterTestingModule,
        provideTranslocoTestingModule({}),
        SalesAndDescriptionModule,
        PricingModule,
        DimensionAndWeightModule,
        CustomerModule,
        QuantitiesModule,
        ProductionModule,
        BlockUiModule,
      ],
      declarations: [DetailComponent],
      providers: [
        provideMockStore({
          initialState: {
            detail: {},
          },
          selectors: [
            {
              selector: getReferenceType,
              value: REFRENCE_TYPE_MOCK,
            },
            {
              selector: getReferenceTypeLoading,
              value: false,
            },
          ],
        }),
        { provide: Location, useValue: locationStub },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    location = fixture.debugElement.injector.get(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigate back', () => {
    component.backToSearch();
    expect(location.back).toHaveBeenCalled();
  });
});
