import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { StaticSafteyFactorMonitorComponent } from './static-saftey-factor-monitor.component';
import { MatIconModule } from '@angular/material/icon';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

describe('StaticSafteyFactorMonitorComponent', () => {
  let component: StaticSafteyFactorMonitorComponent;
  let spectator: Spectator<StaticSafteyFactorMonitorComponent>;

  const createComponent = createComponentFactory({
    component: StaticSafteyFactorMonitorComponent,
    detectChanges: false,
    imports: [
      RouterTestingModule,
      MatCardModule,
      MatIconModule,
      MatIconTestingModule,
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
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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
