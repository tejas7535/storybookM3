import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject } from 'rxjs';

import {
  DynamicFormsModule,
  LazyListLoaderService,
  NestedPropertyMeta,
  RuntimeRequestService,
} from '@caeonline/dynamic-forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { BearingSearchModule } from '../bearing-search/bearing-search.module';
import { LocaleService } from '../core/services/locale/locale.service';
import { PagesStepperComponent } from '../pages-stepper/pages-stepper.component';
import { PagesStepperModule } from '../pages-stepper/pages-stepper.module';
import { ResultPageModule } from '../result-page/result-page.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { PagedMeta } from './home.model';

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

  // let httpMock: HttpTestingController;

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
        },
      },
    ],
    declarations: [HomeComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    localeService = spectator.inject(LocaleService);
    // httpMock = spectator.inject(HttpTestingController);
  });

  test('should create', () => {
    console.warn = jest.fn();
    console.log = jest.fn();
    expect(component).toBeTruthy();
  });

  test('a change of a startparam should call the localService', () => {
    const newParams = { id: 456, separator: 'comma', language: 'en' };
    params.next(newParams);

    expect(localeService.setSeparator).toHaveBeenCalledWith(',');
    expect(localeService.setLocale).toHaveBeenCalledWith('en');
  });

  test('handleRouteParams should trigger multiple methods', () => {
    const selectBearingSpy = jest.spyOn(component, 'selectBearing');
    component.handleRouteParams();

    expect(selectBearingSpy).toHaveBeenCalledTimes(1);
  });

  test('selectBearing should call getBearingRelations', () => {
    const spy = jest.spyOn(component, 'getBearingRelations');
    const mockId = 'mockId';

    component.selectBearing(mockId);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(mockId);
  });

  // TODO actually write this test
  // test('getBearingRelations should trigger a http GET method', () => {
  //   // const mock = {};
  //   const mockId = 'mockBearingId';

  //   component.getBearingRelations(mockId);

  //   const req = httpMock.expectOne(
  //     `${environment.apiMMBaseUrl}${environment.bearingRelationsPath}${mockId}`
  //   );
  //   expect(req.request.method).toBe('GET');
  //   // req.flush(mock);
  // });

  // TODO actually write this test
  // test('dynamicFormLoaded should construct pagedMetas and call store', () => {});

  test('next should call stepper next method', () => {
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

  test('extractMembers should return parent and child Metas', () => {
    // TODO add meaningfull mockdata
    const mockNestedMeta = {
      metas: [],
      children: [],
    } as NestedPropertyMeta;
    const result = component['extractMembers'](mockNestedMeta);

    expect(result).toEqual([]);
  });
});
