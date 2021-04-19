import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

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
          params: of({ id: 123 }),
        },
      },
    ],
    declarations: [HomeComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    // httpMock = spectator.inject(HttpTestingController);
  });

  test('should create', () => {
    console.warn = jest.fn();
    console.log = jest.fn();
    expect(component).toBeTruthy();
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
  test('dynamicFormLoaded should consturct pagedMetas and call store', () => {});

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
