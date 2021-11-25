import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { ShaftComponent } from './shaft.component';

describe('ConditionMeasuringEquipmentComponent', () => {
  let component: ShaftComponent;
  let spectator: Spectator<ShaftComponent>;

  const createComponent = createComponentFactory({
    component: ShaftComponent,
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
          shaft: {
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
    declarations: [ShaftComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
