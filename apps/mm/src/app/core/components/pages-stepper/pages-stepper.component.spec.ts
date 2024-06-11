import { CdkStep, StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';

import { PageMetaStatus } from '@caeonline/dynamic-forms';
import { QualtricsInfoBannerComponent } from '@mm/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { STEPNAME } from '../../../shared/constants/tracking-names';
import { PageBeforePipe } from './page-before.pipe';
import { PagesStepperComponent } from './pages-stepper.component';

describe('PagesStepperComponent', () => {
  let component: PagesStepperComponent;
  let spectator: Spectator<PagesStepperComponent>;

  const createComponent = createComponentFactory({
    component: PagesStepperComponent,
    imports: [
      MatButtonModule,
      MatStepperModule,
      MockComponent(QualtricsInfoBannerComponent),
    ],

    declarations: [PagesStepperComponent, PageBeforePipe],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#hasNext', () => {
    it('should return true if there is another page', () => {
      component.activePageId = 'mockPageId1';
      component.pages = [
        {
          id: 'mockPageId1',
          visible: true,
        },
        {
          id: 'mockPageId2',
          visible: true,
        },
      ] as PageMetaStatus[];

      expect(component.hasNext).toBeTruthy();
    });
  });

  describe('#hasResultNext', () => {
    it('should return true if the next page is the result page', () => {
      component.activePageId = 'mockPageId2';
      component.pages = [
        {
          id: 'mockPageId1',
          visible: true,
        },
        {
          id: 'mockPageId2',
          visible: true,
        },
        {
          id: 'PAGE_RESULT',
          visible: true,
        },
      ] as PageMetaStatus[];

      expect(component.hasResultNext).toBeTruthy();
    });
  });

  describe('#hasPrev', () => {
    it('hasPrev should return true if there are one or more page before', () => {
      component.activePageId = 'mockPageId2';
      component.pages = [
        {
          id: 'mockPageId1',
          visible: true,
        },
        {
          id: 'mockPageId2',
          visible: true,
        },
      ] as PageMetaStatus[];

      expect(component.hasPrev).toBeTruthy();
    });
  });

  describe('#ngOnChanges', () => {
    it('should filter down the pages to the parent ones', () => {
      component.pages = [
        {
          id: 'mockPageIdParent',
          visible: true,
          isParent: true,
        },
        {
          id: 'mockPageIdChildren',
          visible: true,
        },
      ] as PageMetaStatus[];

      component.ngOnChanges();
      expect(component.pages).toEqual([
        {
          id: 'mockPageIdParent',
          visible: true,
          isParent: true,
        },
      ]);
    });
  });

  describe('#activate', () => {
    it('should emit a activePageChange for enabled pages', (done) => {
      const spy = jest.spyOn(component.activePageIdChange, 'emit');
      const selectSpy = jest.fn(() => {});
      const mockPage = {
        selectedStep: { label: 'MOCK_PAGE_ID', ariaLabelledby: 'very enabled' },
        previouslySelectedStep: {
          label: 'ANOTHER_PAGE_ID',
          select: selectSpy,
        } as unknown as CdkStep,
      } as StepperSelectionEvent;

      component.activate(mockPage);

      setTimeout(() => {
        expect(spy).toBeCalledTimes(1);
        expect(selectSpy).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should select the previous page for diabled pages', (done) => {
      const spy = jest.spyOn(component.activePageIdChange, 'emit');
      const selectSpy = jest.fn(() => {});
      const mockPage = {
        selectedStep: { label: 'MOCK_PAGE_ID', ariaLabelledby: 'disabled' },
        previouslySelectedStep: {
          label: 'ANOTHER_PAGE_ID',
          select: selectSpy,
        } as unknown as CdkStep,
      } as StepperSelectionEvent;

      component.activate(mockPage);

      setTimeout(() => {
        expect(spy).not.toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalledTimes(1);
        done();
      }, 100);
    });
  });

  describe('#prev', () => {
    it('should call navigatePage with -1', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const spy = jest.spyOn(component, 'navigatePage');

      component.prev();
      expect(spy).toHaveBeenCalledWith(-1);
    });
  });

  describe('#next', () => {
    it('should call navigatePage with 1', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const spy = jest.spyOn(component, 'navigatePage');

      component.next();
      expect(spy).toBeCalledWith(1);
    });
  });

  describe('#navigatePage', () => {
    it('should emit activePageIdChange', () => {
      component.activePageId = 'mockPageId1';
      component.pages = [
        {
          id: 'mockPageId1',
          visible: true,
        },
        {
          id: 'mockPageId2',
          visible: true,
        },
      ] as PageMetaStatus[];
      const spy = jest.spyOn(component.activePageIdChange, 'emit');

      component['navigatePage'](1);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('#getVisiblePages', () => {
    it('should return an array of visble pages', () => {
      component.pages = [
        {
          id: 'mockPageId1',
          visible: true,
        },
        {
          id: 'mockPageId2',
          visible: false,
        },
      ] as PageMetaStatus[];

      expect(component['getVisiblePages']()).toEqual([
        {
          id: 'mockPageId1',
          visible: true,
        },
      ]);
    });
  });

  describe('#trackLanguage', () => {
    it('should call the logEvent method', () => {
      const mockStep = `[Step 1]: Very important Step of many`;

      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      component.trackSteps(mockStep);

      expect(trackingSpy).toHaveBeenCalledWith(mockStep, {
        name: STEPNAME,
      });
    });
  });
});
