import { signal } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Rfq4DetailViewStore } from '../../../store/rfq-4-detail-view.store';
import { PositionInformationComponent } from './position-information.component';

describe('PositionInformationComponent', () => {
  let component: PositionInformationComponent;
  let spectator: Spectator<PositionInformationComponent>;

  const createComponent = createComponentFactory({
    component: PositionInformationComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: Rfq4DetailViewStore,
        useValue: {
          getQuotationDetailData: signal(null),
          getRfq4ProcessData: signal(null),
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
