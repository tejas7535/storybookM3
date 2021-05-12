import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { LossOfSkillsComponent } from './loss-of-skills.component';
import { LostJobProfilesModule } from './lost-job-profiles/lost-job-profiles.module';
import { RiskOfLeavingModule } from './risk-of-leaving/risk-of-leaving.module';

describe('LossOfSkillsComponent', () => {
  let component: LossOfSkillsComponent;
  let spectator: Spectator<LossOfSkillsComponent>;

  const createComponent = createComponentFactory({
    component: LossOfSkillsComponent,
    detectChanges: false,
    imports: [
      LostJobProfilesModule,
      RiskOfLeavingModule,
      MatCardModule,
      TranslocoTestingModule,
      ReactiveComponentModule,
    ],
    providers: [provideMockStore({})],
    declarations: [LossOfSkillsComponent],
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
