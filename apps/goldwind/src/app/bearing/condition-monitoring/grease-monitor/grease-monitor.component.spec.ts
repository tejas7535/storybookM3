import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxEchartsModule } from 'ngx-echarts';

import { GreaseMonitorComponent } from './grease-monitor.component';

describe('GreaseStatusComponent', () => {
  let component: GreaseMonitorComponent;
  let spectator: Spectator<GreaseMonitorComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: GreaseMonitorComponent,
    detectChanges: false,
    imports: [
      RouterTestingModule,
      MatCardModule,
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
    ],
    declarations: [GreaseMonitorComponent],
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
