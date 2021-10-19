import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { TooltipModule } from './../../../../shared/components/tooltip/tooltip.module';
import { KpiComponent } from './kpi.component';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let spectator: Spectator<KpiComponent>;

  const createComponent = createComponentFactory({
    component: KpiComponent,
    declarations: [KpiComponent],
    imports: [TooltipModule, provideTranslocoTestingModule({ en })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
