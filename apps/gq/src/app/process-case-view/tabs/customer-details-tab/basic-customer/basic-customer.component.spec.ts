import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BasicCustomerComponent } from './basic-customer.component';

describe('BasicCustomerComponent', () => {
  let component: BasicCustomerComponent;
  let spectator: Spectator<BasicCustomerComponent>;

  const createComponent = createComponentFactory({
    component: BasicCustomerComponent,
    imports: [
      HorizontalDividerModule,
      LabelTextModule,
      SharedPipesModule,
      provideTranslocoTestingModule({ en: {} }),
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
