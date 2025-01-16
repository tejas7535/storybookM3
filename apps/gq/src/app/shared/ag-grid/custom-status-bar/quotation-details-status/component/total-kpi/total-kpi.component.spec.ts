import { CommonModule } from '@angular/common';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TotalKpiComponent } from './total-kpi.component';

describe('TotalKpiComponent', () => {
  let component: TotalKpiComponent;
  let spectator: Spectator<TotalKpiComponent>;

  const createComponent = createComponentFactory({
    component: TotalKpiComponent,
    imports: [
      CommonModule,
      provideTranslocoTestingModule({}),
      SharedPipesModule,
      PushPipe,
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
