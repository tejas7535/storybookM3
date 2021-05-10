import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { CustomerInformationComponent } from './customer-information.component';

describe('CustomerDetailsComponent', () => {
  let component: CustomerInformationComponent;
  let spectator: Spectator<CustomerInformationComponent>;

  const createComponent = createComponentFactory({
    component: CustomerInformationComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      SharedPipesModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [CustomerInformationComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.customer = CUSTOMER_MOCK;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set current and last year', () => {
      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnInit();

      expect(component.currentYear).toBeDefined();
      expect(component.lastYear).toBeDefined();
    });
  });
});
