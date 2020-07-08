import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { REFRENCE_TYPE_MOCK } from '../../testing/mocks';
import { getReferenceType } from '../core/store/selectors/details/detail.selector';
import { SharedModule } from '../shared/shared.module';
import { DetailComponent } from './detail.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let location: Location;

  const locationStub = {
    back: jasmine.createSpy('back'),
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        MatIconModule,
        MatCardModule,
        NoopAnimationsModule,
        SharedModule,
        RouterTestingModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [DetailComponent],
      providers: [
        provideMockStore({
          initialState: {
            detail: {},
          },
          selectors: [
            {
              selector: getReferenceType,
              value: REFRENCE_TYPE_MOCK,
            },
          ],
        }),
        { provide: Location, useValue: locationStub },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    location = fixture.debugElement.injector.get(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigate back', () => {
    component.backToSearch();
    expect(location.back).toHaveBeenCalled();
  });
});
