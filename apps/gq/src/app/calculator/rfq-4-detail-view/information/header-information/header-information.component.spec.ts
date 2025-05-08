import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HeaderInformationComponent } from './header-information.component';

describe('HeaderInformationComponent', () => {
  let component: HeaderInformationComponent;
  let spectator: Spectator<HeaderInformationComponent>;

  const createComponent = createComponentFactory({
    component: HeaderInformationComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      LabelTextModule,
      KpiStatusCardComponent,
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
