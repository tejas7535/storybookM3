import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { StaticSafteyFactorMonitorComponent } from './static-saftey-factor-monitor.component';

describe('StaticSafteyFactorMonitorComponent', () => {
  let component: StaticSafteyFactorMonitorComponent;
  let spectator: Spectator<StaticSafteyFactorMonitorComponent>;

  const createComponent = createComponentFactory({
    component: StaticSafteyFactorMonitorComponent,
    detectChanges: false,
    imports: [
      RouterTestingModule,
      MatCardModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          staticSafety: {
            loading: false,
            result: undefined,
          },
        },
      }),
    ],
    declarations: [StaticSafteyFactorMonitorComponent],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
