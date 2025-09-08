import { signal } from '@angular/core';

import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RfqInformationComponent } from './rfq-information.component';

describe('RfqInformationComponent', () => {
  let component: RfqInformationComponent;
  let spectator: Spectator<RfqInformationComponent>;

  const createComponent = createComponentFactory({
    component: RfqInformationComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      LabelTextModule,
      KpiStatusCardComponent,
    ],
    providers: [
      {
        provide: Rfq4DetailViewStore,
        useValue: {
          getRfq4ProcessData: signal(null),
          processConfirmedByAdUser: signal(null),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
