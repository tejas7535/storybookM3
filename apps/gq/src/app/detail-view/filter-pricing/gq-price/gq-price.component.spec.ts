import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks';
import { GqPriceComponent } from './gq-price.component';

describe('GqPriceComponent', () => {
  let component: GqPriceComponent;
  let spectator: Spectator<GqPriceComponent>;

  const createComponent = createComponentFactory({
    component: GqPriceComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      ReactiveFormsModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            quotation: {},
            customer: {
              item: {},
            },
          },
        },
      }),
    ],
    declarations: [GqPriceComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.quotationDetail = QUOTATION_DETAIL_MOCK;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should define observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.customerCurrency$).toBeDefined();
    });
  });

  describe('selectPrice', () => {
    test('should emit Output EventEmitter', () => {
      component.selectManualPrice.emit = jest.fn();
      component.selectPrice();

      expect(component.selectManualPrice.emit).toHaveBeenCalledWith(
        QUOTATION_DETAIL_MOCK.recommendedPrice
      );
    });
  });
});
