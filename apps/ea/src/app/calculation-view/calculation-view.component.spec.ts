import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { SettingsFacade } from '@ea/core/store';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import {
  BreadcrumbsComponent,
  BreadcrumbsModule,
} from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationViewComponent } from './calculation-view.component';

describe('CalculationViewComponent', () => {
  let component = CalculationViewComponent;
  let spectator: Spectator<CalculationViewComponent>;

  const standaloneChanges$ = new BehaviorSubject<boolean>(true);
  const standalone$ = standaloneChanges$.asObservable();

  const createComponent = createComponentFactory({
    component: CalculationViewComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatIconTestingModule,
      MockModule(MatDividerModule),
      MockModule(BreadcrumbsModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          ...APP_STATE_MOCK,
        },
      }),
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(new Map()),
        },
      },
      {
        provide: SettingsFacade,
        useValue: {
          isStandalone$: standalone$,
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have breadcrumbs in the template', () => {
    spectator.detectChanges();
    const breadcrumbs = spectator.query(BreadcrumbsComponent);
    expect(breadcrumbs).toBeTruthy();
    expect(breadcrumbs.breadcrumbs).toMatchSnapshot();
  });

  describe('when not a standalone version', () => {
    beforeEach(() => {
      standaloneChanges$.next(false);
      spectator.detectChanges();
    });

    it('should not have breadcrumbs in the template', () => {
      const breadcrumbs = spectator.query(BreadcrumbsComponent);
      expect(breadcrumbs).toBeFalsy();
    });
  });
});
