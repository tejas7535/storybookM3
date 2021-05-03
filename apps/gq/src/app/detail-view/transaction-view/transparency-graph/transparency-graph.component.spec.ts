import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxEchartsModule } from 'ngx-echarts';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { TransparencyGraphComponent } from './transparency-graph.component';

describe('TransparencyGraphComponent', () => {
  let component: TransparencyGraphComponent;
  let spectator: Spectator<TransparencyGraphComponent>;

  const createComponent = createComponentFactory({
    component: TransparencyGraphComponent,
    imports: [
      UnderConstructionModule,
      provideTranslocoTestingModule({ en: {} }),
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
