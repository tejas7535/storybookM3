import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { ShaftComponent } from './shaft.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ConditionMeasuringEquipmentComponent', () => {
  let component: ShaftComponent;
  let spectator: Spectator<ShaftComponent>;
  let router: Router;

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
    router = spectator.inject(Router);
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Details Button', () => {
    test('should navigate', () => {
      spyOn(router, 'navigate');
      component.navigateToGreaseStatus();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
