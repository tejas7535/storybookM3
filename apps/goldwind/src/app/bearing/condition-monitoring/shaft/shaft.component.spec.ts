import { MatCardModule } from '@angular/material/card';
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
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
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
