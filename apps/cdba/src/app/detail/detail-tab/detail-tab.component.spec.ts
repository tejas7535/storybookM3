import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { CustomerModule } from './customer/customer.module';
import { DetailTabComponent } from './detail-tab.component';
import { DimensionAndWeightModule } from './dimension-and-weight/dimension-and-weight.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductionModule } from './production/production.module';
import { QuantitiesModule } from './quantities/quantities.module';
import { SalesAndDescriptionModule } from './sales-and-description/sales-and-description.module';

describe('DetailTabComponent', () => {
  let component: DetailTabComponent;
  let fixture: ComponentFixture<DetailTabComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        provideTranslocoTestingModule({}),
        MatCardModule,
        CustomerModule,
        DimensionAndWeightModule,
        PricingModule,
        ProductionModule,
        QuantitiesModule,
        SalesAndDescriptionModule,
      ],
      declarations: [DetailTabComponent],
      providers: [
        provideMockStore({
          initialState: {
            detail: {},
          },
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
