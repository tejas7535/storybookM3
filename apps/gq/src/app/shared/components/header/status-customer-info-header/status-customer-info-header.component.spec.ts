import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { StatusCustomerInfoHeaderComponent } from './status-customer-info-header.component';

describe('StatusCustomerInfoHeaderComponent', () => {
  let component: StatusCustomerInfoHeaderComponent;
  let spectator: Spectator<StatusCustomerInfoHeaderComponent>;

  const createComponent = createComponentFactory({
    component: StatusCustomerInfoHeaderComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
    providers: [MockProvider(ApprovalFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
