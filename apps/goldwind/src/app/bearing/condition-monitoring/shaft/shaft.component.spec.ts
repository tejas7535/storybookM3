import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxEchartsModule } from 'ngx-echarts';

import { ShaftComponent } from './shaft.component';

describe('ConditionMeasuringEquipmentComponent', () => {
  let component: ShaftComponent;
  let spectator: Spectator<ShaftComponent>;

  const createComponent = createComponentFactory({
    component: ShaftComponent,
    imports: [
      MatCardModule,
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
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
