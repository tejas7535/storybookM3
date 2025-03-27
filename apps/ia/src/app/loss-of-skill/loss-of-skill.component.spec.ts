import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  getAreOpenApplicationsAvailable,
  getBeautifiedFilterValues,
  getSelectedTimeRange,
} from '../core/store/selectors';
import { LossOfSkillComponent } from './loss-of-skill.component';
import { LostJobProfilesModule } from './lost-job-profiles/lost-job-profiles.module';
import {
  getHasUserEnoughRightsToPmgmData,
  getJobProfilesData,
  getJobProfilesLoading,
  getLossOfSkillLeaversData,
  getLossOfSkillLeaversLoading,
  getLossOfSkillWorkforceData,
  getLossOfSkillWorkforceLoading,
  getPmgmData,
} from './store/selectors/loss-of-skill.selector';

describe('LossOfSkillComponent', () => {
  let component: LossOfSkillComponent;
  let spectator: Spectator<LossOfSkillComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: LossOfSkillComponent,
    detectChanges: false,
    imports: [
      LostJobProfilesModule,
      MatCardModule,
      provideTranslocoTestingModule({ en: {} }),
      PushPipe,
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it(
      'should set beautifiedFilters',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getBeautifiedFilterValues, a);

        component.ngOnInit();

        m.expect(component.beautifiedFilters$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set timeRange',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getSelectedTimeRange, a);

        component.ngOnInit();

        m.expect(component.timeRange$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set areOpenPositionsAvailable',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getAreOpenApplicationsAvailable, a);

        component.ngOnInit();

        m.expect(component.areOpenPositionsAvailable$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set lostJobProfilesLoading',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getJobProfilesLoading, a);

        component.ngOnInit();

        m.expect(component.lostJobProfilesLoading$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set lostJobProfilesData',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getJobProfilesData, a);

        component.ngOnInit();

        m.expect(component.lostJobProfilesData$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set lossOfSkillWorkforceData',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getLossOfSkillWorkforceData, a);

        component.ngOnInit();

        m.expect(component.lossOfSkillWorkforceData$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set lossOfSkillWorkforceLoading',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getLossOfSkillWorkforceLoading, a);

        component.ngOnInit();

        m.expect(component.lossOfSkillWorkforceLoading$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set lossOfSkillLeaversData',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getLossOfSkillLeaversData, a);

        component.ngOnInit();

        m.expect(component.lossOfSkillLeaversData$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set lossOfSkillLeaversLoading',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getLossOfSkillLeaversLoading, a);

        component.ngOnInit();

        m.expect(component.lossOfSkillLeaversLoading$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set pmgmData',
      marbles((m) => {
        const a = {} as any;
        store.overrideSelector(getPmgmData, a);

        component.ngOnInit();

        m.expect(component.pmgmData$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );

    it(
      'should set enoughRightsToAllPmgmData',
      marbles((m) => {
        const a = false;

        store.overrideSelector(getHasUserEnoughRightsToPmgmData, a);

        component.ngOnInit();

        m.expect(component.enoughRightsToAllPmgmData$).toBeObservable(
          m.cold('a', {
            a,
          })
        );
      })
    );
  });
});
