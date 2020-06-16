import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { tap } from 'rxjs/operators';

import { configureTestSuite } from 'ng-bullet';

import { DataService } from '../core/http/data.service';
import { ENV_CONFIG } from '../core/http/environment-config.interface';
import { IotThing } from '../core/store/reducers/models/iot-thing.model';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataService,
        {
          provide: ENV_CONFIG,
          useValue: {
            environment: {
              baseUrl: '',
            },
          },
        },
      ],
      declarations: [HomeComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockID = 123;
  const mockIotThing: IotThing = {
    '@context': ['testContext'],
    id: 'testId',
    description: 'testDescription',
    descriptions: { test: 'test' },
    securityDefinitions: {
      testDefinition1: {
        scheme: 'testSchema',
        token: 'testToken',
        scopes: ['testScope1'],
        flow: 'testFlow',
      },
    },
    security: ['testSecurity'],
    properties: { windTurbineProperties: {}, message: {} },
    events: { sensorDataStream: {}, forms: {} },
  };

  test('should create', () => {
    expect(component).toBeTruthy();

    const req = httpMock.expectOne(`/iot/things/${mockID}`);
    req.flush(mockIotThing);
  });

  describe('getIotThing', () => {
    test('should get a IotThing result', () => {
      component.getIotThing(mockID);
      component.thing$.pipe(
        tap((response) => {
          expect(response).toEqual(mockIotThing);
        })
      );

      const req = httpMock.expectOne(`/iot/things/${mockID}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockIotThing);
    });
  });
});
