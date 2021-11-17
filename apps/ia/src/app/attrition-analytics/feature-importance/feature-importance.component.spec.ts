import { marbles } from 'rxjs-marbles/marbles';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeatureImportanceComponent } from './feature-importance.component';

jest.mock('./feature-importance.config', () => ({
  ...(jest.requireActual('./feature-importance.config') as any),
  createFeaturesImportanceConfig: jest.fn(),
}));

describe('FeatureImportanceComponent', () => {
  let component: FeatureImportanceComponent;
  let spectator: Spectator<FeatureImportanceComponent>;

  const createComponent = createComponentFactory({
    component: FeatureImportanceComponent,
    imports: [
      ReactiveComponentModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should create chart option',
      marbles((m) => {
        m.expect(component.options).toBeObservable(m.cold('a', {}));
      })
    );
  });
});
