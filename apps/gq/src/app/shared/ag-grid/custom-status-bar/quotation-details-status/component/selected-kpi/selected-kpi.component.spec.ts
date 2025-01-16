import { CommonModule } from '@angular/common';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SelectedKpiComponent } from './selected-kpi.component';

describe('SelectedKpiComponent', () => {
  let component: SelectedKpiComponent;
  let spectator: Spectator<SelectedKpiComponent>;

  const createComponent = createComponentFactory({
    component: SelectedKpiComponent,
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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
