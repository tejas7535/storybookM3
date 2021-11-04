import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject, of } from 'rxjs';

import {
  DynamicFormsModule,
  DynamicFormTemplateContext,
  LazyListLoaderService,
  NestedPropertyMeta,
  PageMetaStatus,
  RuntimeRequestService,
} from '@caeonline/dynamic-forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LOAD_OPTIONS_RESPONSE_MOCK_COMPLEX } from '../../testing/mocks/rest.service.mock';
import { PagesStepperComponent } from '../core/components/pages-stepper/pages-stepper.component';
import { PagesStepperModule } from '../core/components/pages-stepper/pages-stepper.module';
import { MMLocales, RestService } from '../core/services';
import { LocaleService } from '../core/services/locale/locale.service';
import { FormValue, FormValueProperty } from '../shared/models';
import { SharedModule } from '../shared/shared.module';
import {
  PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
  PAGE_MOUNTING_MANAGER_SEAT,
} from './../shared/constants/dialog-constant';
import { BearingSearchModule } from './bearing-search/bearing-search.module';
import { HomeComponent } from './home.component';
import { PagedMeta } from './home.model';
import { ResultPageModule } from './result-page/result-page.module';

console.warn = jest.fn();
// eslint-disable-next-line no-console
console.log = jest.fn();

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
      HttpClientTestingModule,

      PagesStepperModule,
      BearingSearchModule,
      ResultPageModule,

      RouterTestingModule,

      provideTranslocoTestingModule({ en: {} }),
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
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      {
        provide: RestService,
        useValue: {
          getBearingRelations: jest.fn(() => of(mockBearingRelationsResponse)),
          setCurrentLanguage: jest.fn(() => {}),
          getLoadOptions: jest.fn(() => of(LOAD_OPTIONS_RESPONSE_MOCK_COMPLEX)),
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
      component['resetFormValue'] = jest.fn(() => {});
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
      component['handleActivePageIdChange'] = jest.fn(() => {});
      const mockId = 'mockId';

      component.selectBearing(mockId);

      expect(component['getBearingRelations']).toHaveBeenCalledTimes(1);
      expect(component['getBearingRelations']).toHaveBeenCalledWith(mockId);
      expect(component['handleActivePageIdChange']).toHaveBeenCalledTimes(1);
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

  describe('#dynamicFormLoaded', () => {
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
          valueChanges: of({
            objects: [
              {
                properties: [
                  {
                    name: 'test control',
                    value: undefined,
                    initialValue: undefined,
                  } as FormValueProperty,
                  {
                    name: 'test control 2',
                    value: 'some value',
                    initialValue: undefined,
                  } as FormValueProperty,
                ],
              },
            ],
          } as FormValue),
        },
      } as DynamicFormTemplateContext;
      component.dynamicFormLoaded(mockedDynamicTemplate);

      expect(component['homeStore'].setPageMetas).toHaveBeenCalledWith(
        mockNestedMeta
      );
    });
  });

  describe('#checkTriggerNext', () => {
    it('should do nothing if not on page 2 or 3', () => {
      component.next = jest.fn();
      Object.defineProperty(component['resultPage'], 'send', {
        value: jest.fn(),
      });

      const mockedPageId = 'another page';
      const mockedPagedMetas: PagedMeta[] = [];

      component.checkTriggerNext(mockedPageId, mockedPagedMetas);

      expect(component.next).not.toHaveBeenCalled();
      expect(component['resultPage'].send).not.toHaveBeenCalled();
    });
    it('should do nothing if currentPageMeta is not defined', () => {
      component.next = jest.fn();
      Object.defineProperty(component['resultPage'], 'send', {
        value: jest.fn(),
      });

      const mockedPageId = PAGE_MOUNTING_MANAGER_SEAT;
      const mockedPagedMetas: PagedMeta[] = [];

      component.checkTriggerNext(mockedPageId, mockedPagedMetas);

      expect(component.next).not.toHaveBeenCalled();
      expect(component['resultPage'].send).not.toHaveBeenCalled();
    });

    it('should call next if currentPage 2 or 3 is valid', () => {
      component.next = jest.fn();
      Object.defineProperty(component['resultPage'], 'send', {
        value: jest.fn(),
      });

      const mockedPageId = PAGE_MOUNTING_MANAGER_SEAT;
      const mockedPagedMetas: PagedMeta[] = [
        {
          metas: [],
          controls: [],
          valid$: of(true),
          page: {
            id: PAGE_MOUNTING_MANAGER_SEAT,
          } as PageMetaStatus,
          children: [],
        },
      ];

      component.checkTriggerNext(mockedPageId, mockedPagedMetas);

      expect(component.next).toHaveBeenCalledWith(
        mockedPageId,
        mockedPagedMetas,
        component['stepper']
      );
      expect(component['resultPage'].send).not.toHaveBeenCalled();
    });
    it('should call next and fetch the result if currentPage 2 or 3 is valid and result is next', () => {
      component.next = jest.fn();
      Object.defineProperty(component['stepper'], 'hasResultNext', {
        value: true,
      });
      Object.defineProperty(component['resultPage'], 'send', {
        value: jest.fn(),
      });

      const mockedPageId = PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS;
      const mockedPagedMetas: PagedMeta[] = [
        {
          metas: [],
          controls: [],
          valid$: of(true),
          page: {
            id: PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
          } as PageMetaStatus,
          children: [],
        },
      ];

      component.checkTriggerNext(mockedPageId, mockedPagedMetas);

      expect(component.next).toHaveBeenCalledWith(
        mockedPageId,
        mockedPagedMetas,
        component['stepper']
      );
      expect(component['resultPage'].send).toHaveBeenCalledWith(
        component['form']
      );
    });
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

  describe('#resetFormValue', () => {
    const control1: FormValueProperty = {
      name: 'control1',
      value: 'initial',
      initialValue: 'initial',
      dimension1: undefined,
    };

    const control2: FormValueProperty = {
      name: 'control2',
      value: 'initial',
      initialValue: 'initial',
      dimension1: undefined,
    };

    let mockFormGroupBearing: any;
    let mockFormGroupBearingSeat: any;
    let mockFormGroupMeasuringAndMounting: any;
    let mockFormGroupCalculationOptions: any;

    beforeEach(() => {
      mockFormGroupBearing = {
        name: { value: 'RSY_BEARING_TYPE' },
        initialValue: { value: 'initial' },
        value: {
          value: 'initial',
          patchValue: jest.fn(),
          markAsPristine: jest.fn(),
          markAsUntouched: jest.fn(),
        },
        get: jest.fn(
          (property: string) => mockFormGroupBearing[property] || undefined
        ),
      };

      mockFormGroupBearingSeat = {
        name: { value: 'IDMM_BEARING_SEAT' },
        initialValue: { value: 'initial' },
        value: {
          value: 'initial',
          patchValue: jest.fn(),
          markAsPristine: jest.fn(),
          markAsUntouched: jest.fn(),
        },
        get: jest.fn(
          (property: string) => mockFormGroupBearingSeat[property] || undefined
        ),
      };

      mockFormGroupMeasuringAndMounting = {
        name: { value: 'IDMM_MEASSURING_METHOD' },
        initialValue: { value: 'initial' },
        value: {
          value: 'initial',
          patchValue: jest.fn(),
          markAsPristine: jest.fn(),
          markAsUntouched: jest.fn(),
        },
        get: jest.fn(
          (property: string) =>
            mockFormGroupMeasuringAndMounting[property] || undefined
        ),
      };

      mockFormGroupCalculationOptions = {
        name: { value: 'IDMM_HYDRAULIC_NUT_TYPE' },
        initialValue: { value: 'initial' },
        value: {
          value: 'initial',
          patchValue: jest.fn(),
          markAsPristine: jest.fn(),
          markAsUntouched: jest.fn(),
        },
        get: jest.fn(
          (property: string) =>
            mockFormGroupCalculationOptions[property] || undefined
        ),
      };

      const mockFormArray = {
        controls: [
          mockFormGroupBearing,
          mockFormGroupBearingSeat,
          mockFormGroupCalculationOptions,
          mockFormGroupMeasuringAndMounting,
        ],
      };
      component['form'].get = jest.fn(() => mockFormArray as any);
    });

    it('should do nothing if not property has changed', () => {
      const unchangedValue: FormValue = {
        objects: [
          {
            properties: [control1, control2],
          },
        ],
      };

      component['resetFormValue'](unchangedValue, unchangedValue);

      expect(component['form'].get).not.toHaveBeenCalled();
    });

    it('should reset following controls after change in bearingMembers', () => {
      const prev: FormValue = {
        objects: [
          {
            properties: [
              { ...control1, name: 'RSY_BEARING_TYPE' },
              { ...control2, name: 'IDMM_BEARING_SEAT' },
            ],
          },
        ],
      };
      const next: FormValue = {
        objects: [
          {
            properties: [
              { ...control1, name: 'RSY_BEARING_TYPE', value: 'new value' },
              { ...control2, name: 'IDMM_BEARING_SEAT' },
            ],
          },
        ],
      };

      component['resetFormValue'](prev, next);

      expect(component['form'].get).toHaveBeenCalledWith(
        'objects.0.properties'
      );

      expect(mockFormGroupBearing.value.patchValue).not.toHaveBeenCalled();
      expect(mockFormGroupBearing.value.markAsPristine).not.toHaveBeenCalled();
      expect(mockFormGroupBearing.value.markAsUntouched).not.toHaveBeenCalled();

      expect(mockFormGroupBearingSeat.value.patchValue).toHaveBeenCalled();
      expect(mockFormGroupBearingSeat.value.markAsPristine).toHaveBeenCalled();
      expect(mockFormGroupBearingSeat.value.markAsUntouched).toHaveBeenCalled();

      expect(
        mockFormGroupMeasuringAndMounting.value.patchValue
      ).toHaveBeenCalled();
      expect(
        mockFormGroupMeasuringAndMounting.value.markAsPristine
      ).toHaveBeenCalled();
      expect(
        mockFormGroupMeasuringAndMounting.value.markAsUntouched
      ).toHaveBeenCalled();

      expect(
        mockFormGroupCalculationOptions.value.patchValue
      ).toHaveBeenCalled();
      expect(
        mockFormGroupCalculationOptions.value.markAsPristine
      ).toHaveBeenCalled();
      expect(
        mockFormGroupCalculationOptions.value.markAsUntouched
      ).toHaveBeenCalled();
    });

    it('should reset following controls after change in bearingSeatMembers', () => {
      const prev: FormValue = {
        objects: [
          {
            properties: [
              { ...control1, name: 'IDMM_BEARING_SEAT' },
              { ...control2, name: 'IDMM_MEASSURING_METHOD' },
            ],
          },
        ],
      };
      const next: FormValue = {
        objects: [
          {
            properties: [
              { ...control1, name: 'IDMM_BEARING_SEAT', value: 'new value' },
              { ...control2, name: 'IDMM_MEASSURING_METHOD' },
            ],
          },
        ],
      };

      component['resetFormValue'](prev, next);

      expect(component['form'].get).toHaveBeenCalledWith(
        'objects.0.properties'
      );

      expect(mockFormGroupBearing.value.patchValue).not.toHaveBeenCalled();
      expect(mockFormGroupBearing.value.markAsPristine).not.toHaveBeenCalled();
      expect(mockFormGroupBearing.value.markAsUntouched).not.toHaveBeenCalled();

      expect(mockFormGroupBearingSeat.value.patchValue).not.toHaveBeenCalled();
      expect(
        mockFormGroupBearingSeat.value.markAsPristine
      ).not.toHaveBeenCalled();
      expect(
        mockFormGroupBearingSeat.value.markAsUntouched
      ).not.toHaveBeenCalled();

      expect(
        mockFormGroupMeasuringAndMounting.value.patchValue
      ).toHaveBeenCalled();
      expect(
        mockFormGroupMeasuringAndMounting.value.markAsPristine
      ).toHaveBeenCalled();
      expect(
        mockFormGroupMeasuringAndMounting.value.markAsUntouched
      ).toHaveBeenCalled();

      expect(
        mockFormGroupCalculationOptions.value.patchValue
      ).toHaveBeenCalled();
      expect(
        mockFormGroupCalculationOptions.value.markAsPristine
      ).toHaveBeenCalled();
      expect(
        mockFormGroupCalculationOptions.value.markAsUntouched
      ).toHaveBeenCalled();
    });

    it('should reset following controls after change in measuringAndMountingMembers', () => {
      const prev: FormValue = {
        objects: [
          {
            properties: [
              { ...control1, name: 'IDMM_MEASSURING_METHOD' },
              { ...control2, name: 'IDMM_HYDRAULIC_NUT_TYPE' },
            ],
          },
        ],
      };
      const next: FormValue = {
        objects: [
          {
            properties: [
              {
                ...control1,
                name: 'IDMM_MEASSURING_METHOD',
                value: 'new value',
              },
              { ...control2, name: 'IDMM_HYDRAULIC_NUT_TYPE' },
            ],
          },
        ],
      };

      component['resetFormValue'](prev, next);

      expect(component['form'].get).toHaveBeenCalledWith(
        'objects.0.properties'
      );

      expect(mockFormGroupBearing.value.patchValue).not.toHaveBeenCalled();
      expect(mockFormGroupBearing.value.markAsPristine).not.toHaveBeenCalled();
      expect(mockFormGroupBearing.value.markAsUntouched).not.toHaveBeenCalled();

      expect(mockFormGroupBearingSeat.value.patchValue).not.toHaveBeenCalled();
      expect(
        mockFormGroupBearingSeat.value.markAsPristine
      ).not.toHaveBeenCalled();
      expect(
        mockFormGroupBearingSeat.value.markAsUntouched
      ).not.toHaveBeenCalled();

      expect(
        mockFormGroupMeasuringAndMounting.value.patchValue
      ).not.toHaveBeenCalled();
      expect(
        mockFormGroupMeasuringAndMounting.value.markAsPristine
      ).not.toHaveBeenCalled();
      expect(
        mockFormGroupMeasuringAndMounting.value.markAsUntouched
      ).not.toHaveBeenCalled();

      expect(
        mockFormGroupCalculationOptions.value.patchValue
      ).toHaveBeenCalled();
      expect(
        mockFormGroupCalculationOptions.value.markAsPristine
      ).toHaveBeenCalled();
      expect(
        mockFormGroupCalculationOptions.value.markAsUntouched
      ).toHaveBeenCalled();
    });
  });

  describe('#hasHeadline', () => {
    it('should return false if id in noHeadlineIds', () => {
      const pageId = 'RSY_BEARING_TYPE';
      const memberId = 'IDMM_MOUNTING_METHOD';

      const result1 = component.hasHeadline(pageId);
      const result2 = component.hasHeadline(undefined, memberId);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('should return true if id not in noHeadlineIds', () => {
      const pageId = 'some id with headline';
      const memberId = 'some id with headline';

      const result1 = component.hasHeadline(pageId);
      const result2 = component.hasHeadline(undefined, memberId);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });
  });

  describe('#measuringMethodSet', () => {
    it('should return true if measuring method has a value', () => {
      component['form'] = {
        value: {
          objects: [
            {
              properties: [
                {
                  name: 'IDMM_MEASSURING_METHOD',
                  value: 'value is here',
                  initialValue: undefined,
                  dimension1: undefined,
                },
              ],
            },
          ],
        },
      } as FormGroup;

      const result = component.measuringMethodSet();

      expect(result).toBe(true);
    });

    it('should return false if measuring method has no value', () => {
      component['form'] = {
        value: {
          objects: [
            {
              properties: [
                {
                  name: 'IDMM_MEASSURING_METHOD',
                  value: undefined,
                  initialValue: undefined,
                  dimension1: undefined,
                },
              ],
            },
          ],
        },
      } as FormGroup;

      const result = component.measuringMethodSet();

      expect(result).toBe(false);
    });
  });
});
