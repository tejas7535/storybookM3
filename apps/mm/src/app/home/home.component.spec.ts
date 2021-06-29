import { DecimalPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject, of } from 'rxjs';

import {
  DynamicFormsModule,
  DynamicFormTemplateContext,
  LazyListLoaderService,
  NestedPropertyMeta,
  RuntimeRequestService,
} from '@caeonline/dynamic-forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { PagesStepperComponent } from '../core/components/pages-stepper/pages-stepper.component';
import { PagesStepperModule } from '../core/components/pages-stepper/pages-stepper.module';
import { MMLocales, RestService } from '../core/services';
import { LocaleService } from '../core/services/locale/locale.service';
import { SharedModule } from '../shared/shared.module';
import { BearingSearchModule } from './bearing-search/bearing-search.module';
import { HomeComponent } from './home.component';
import { PagedMeta } from './home.model';
import { ResultPageModule } from './result-page/result-page.module';

// import { HttpTestingController } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let spectator: Spectator<HomeComponent>;
  let localeService: LocaleService;
  const params = new BehaviorSubject<Params>({
    id: 123,
    separator: 'point',
    language: 'de',
  });

  const language$ = new BehaviorSubject<MMLocales>(MMLocales.de);

  const mockBearingRelationsResponse: any = {
    data: {
      type: {
        data: {
          id: '123',
        },
      },
      series: {
        data: {
          id: 'the series id',
        },
      },
      bearing: {
        data: {
          id: 'the bearing id',
        },
      },
    },
  };

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [
      SharedModule,
      DynamicFormsModule.forRoot(),

      ReactiveComponentModule,

      PagesStepperModule,
      BearingSearchModule,
      ResultPageModule,

      RouterTestingModule,

      TranslocoTestingModule,
    ],
    providers: [
      RuntimeRequestService,
      LazyListLoaderService,
      DecimalPipe,
      {
        provide: ActivatedRoute,
        useValue: {
          params,
        },
      },
      {
        provide: LocaleService,
        useValue: {
          setSeparator: jest.fn(),
          setLocale: jest.fn(),
          language$,
        },
      },
      {
        provide: RestService,
        useValue: {
          getBearingRelations: jest.fn(() => of(mockBearingRelationsResponse)),
          setCurrentLanguage: jest.fn(() => {}),
        },
      },
    ],
    declarations: [HomeComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    localeService = spectator.inject(LocaleService);
  });

  it('should create', () => {
    console.warn = jest.fn();
    // eslint-disable-next-line no-console
    console.log = jest.fn();
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should be subscribed to language switches', () => {
      component.resetForm = jest.fn();
      component['form'] = undefined;
      language$.next(MMLocales.en);

      expect(component['restService'].setCurrentLanguage).toHaveBeenCalledWith(
        'en'
      );
      expect(component.resetForm).not.toHaveBeenCalled();
    });

    it('should reset form on languageSwitch', () => {
      component.resetForm = jest.fn();
      component['form'] = new FormGroup({});

      language$.next(MMLocales.en);
      expect(component['restService'].setCurrentLanguage).toHaveBeenCalledWith(
        'en'
      );
      expect(component.resetForm).toHaveBeenCalled();
    });
  });

  describe('#routeParams', () => {
    it('should call the localService at change of a startparam', () => {
      const newParams = { id: 456, separator: 'comma', language: 'en' };
      params.next(newParams);

      expect(localeService.setSeparator).toHaveBeenCalledWith(',');
      expect(localeService.setLocale).toHaveBeenCalledWith('en');
    });

    it('should trigger multiple methods at handleRouteParams', () => {
      const selectBearingSpy = jest.spyOn(component, 'selectBearing');
      component['handleRouteParams']();

      expect(selectBearingSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#selectBearing', () => {
    it('should call getBearingRelations at selectBearing', () => {
      component['getBearingRelations'] = jest.fn(() => {});
      const mockId = 'mockId';

      component.selectBearing(mockId);

      expect(component['getBearingRelations']).toHaveBeenCalledTimes(1);
      expect(component['getBearingRelations']).toHaveBeenCalledWith(mockId);
    });
  });

  describe('#getBearingRelations', () => {
    it('should call restService at getBearingRelations', () => {
      const mockId = 'mockBearingId';

      component['getBearingRelations'](mockId);

      expect(component['restService'].getBearingRelations).toHaveBeenCalledWith(
        mockId
      );
    });
  });

  it('dynamicFormLoaded should call store', () => {
    Object.defineProperty(component['homeStore'], 'setPageMetas', {
      value: jest.fn(),
    });
    const mockNestedMeta = [
      {
        metas: [],
        children: [],
      },
    ] as NestedPropertyMeta[];
    const mockedDynamicTemplate = {
      nestedMetas: mockNestedMeta,
      form: {
        value: 'yes',
      },
    } as DynamicFormTemplateContext;
    component.dynamicFormLoaded(mockedDynamicTemplate);

    expect(component['homeStore'].setPageMetas).toHaveBeenCalledWith(
      mockNestedMeta
    );
  });

  describe('next', () => {
    it('should call stepper next method', () => {
      const mockStepper = { next: () => {} } as PagesStepperComponent;
      const mockPagedMeta = [
        {
          page: {
            id: 'mockId1',
          },
        },
        {
          page: {
            id: 'mockId2',
          },
        },
      ] as PagedMeta[];
      const spy = jest.spyOn(mockStepper, 'next');

      component.next('mockId1', mockPagedMeta, mockStepper);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleActivePageIdChange', () => {
    it('should set activePageId', () => {
      Object.defineProperty(component['homeStore'], 'getBearing', {
        value: jest.fn(),
      });

      component.handleActivePageIdChange('mockId1');

      expect(component['homeStore'].getBearing).toHaveBeenCalledTimes(1);
    });
  });
  describe('#resetForm', () => {
    it('should reset the form', () => {
      component['form'].reset = jest.fn();
      component.dynamicFormLoaded = jest.fn();

      component.resetForm();

      expect(component['form'].reset).toHaveBeenCalled();
      expect(component.dynamicFormLoaded).toHaveBeenCalled();
    });
  });
});
