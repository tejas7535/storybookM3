import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LossOfSkillComponent } from './loss-of-skill.component';
import { LostJobProfilesModule } from './lost-job-profiles/lost-job-profiles.module';
import { RiskOfLeavingModule } from './risk-of-leaving/risk-of-leaving.module';

describe('LossOfSkillComponent', () => {
  let component: LossOfSkillComponent;
  let spectator: Spectator<LossOfSkillComponent>;

  const createComponent = createComponentFactory({
    component: LossOfSkillComponent,
    detectChanges: false,
    imports: [
      LostJobProfilesModule,
      RiskOfLeavingModule,
      MatCardModule,
      provideTranslocoTestingModule({ en: {} }),
      PushPipe,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
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
    it('should define Observables', () => {
      expect(component.lostJobProfilesData$).toBeUndefined();
      expect(component.lostJobProfilesLoading$).toBeUndefined();

      component.ngOnInit();

      expect(component.lostJobProfilesData$).toBeDefined();
      expect(component.lostJobProfilesLoading$).toBeDefined();
    });
  });
});
