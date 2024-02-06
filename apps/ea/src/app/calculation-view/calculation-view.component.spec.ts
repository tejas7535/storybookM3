import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { CalculationContainerComponent } from '@ea/calculation/calculation-container/calculation-container.component';
import { CalculationContainerStubComponent } from '@ea/calculation/calculation-container/calculation-container.component.stub';
import { ProductSelectionFacade, SettingsFacade } from '@ea/core/store/facades';
import { LegacyAppComponent } from '@ea/legacy-app/legacy-app.component';

import {
  BreadcrumbsComponent,
  BreadcrumbsModule,
} from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationViewComponent } from './calculation-view.component';

describe('CalculationViewComponent', () => {
  const component = CalculationViewComponent;
  let fixture: ComponentFixture<CalculationViewComponent>;

  const standaloneChanges$ = new BehaviorSubject<boolean>(true);
  const standalone$ = standaloneChanges$.asObservable();
  const isBearingSupportedChanges = new BehaviorSubject<boolean>(true);
  const isBearingSupported$ = isBearingSupportedChanges.asObservable();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CalculationViewComponent,
        provideTranslocoTestingModule({ en: {} }),
        MatIconTestingModule,
        MatDividerModule,
        BreadcrumbsModule,
        CalculationContainerStubComponent,
      ],
      providers: [
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
        {
          provide: ProductSelectionFacade,
          useValue: {
            isBearingSupported$,
            bearingDesignation$: of('123'),
          },
        },
      ],
    });

    TestBed.overrideComponent(CalculationViewComponent, {
      add: {
        imports: [CalculationContainerStubComponent],
      },
      remove: {
        imports: [CalculationContainerComponent],
      },
    });

    fixture = TestBed.createComponent(CalculationViewComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have breadcrumbs in the template', () => {
    const breadcrumbs = fixture.debugElement.query(
      By.directive(BreadcrumbsComponent)
    ).componentInstance;
    expect(breadcrumbs).toBeTruthy();
    expect(breadcrumbs.breadcrumbs).toMatchSnapshot();
  });

  describe('when not a standalone version', () => {
    beforeEach(() => {
      standaloneChanges$.next(false);
      fixture.detectChanges();
    });

    it('should not have breadcrumbs in the template', () => {
      const breadcrumbs = fixture.debugElement.query(
        By.directive(BreadcrumbsComponent)
      );

      expect(breadcrumbs).toBeFalsy();
    });
  });

  describe('when bearing is not supported', () => {
    beforeEach(() => {
      isBearingSupportedChanges.next(false);
      fixture.detectChanges();
    });

    it('should display legacy app', () => {
      const legacyApp = fixture.debugElement.query(
        By.directive(LegacyAppComponent)
      ).componentInstance;

      expect(legacyApp).toBeTruthy();
      expect(legacyApp.bearingDesignation).toBe('123');
    });
  });
});
