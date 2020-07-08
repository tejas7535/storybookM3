import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [OverviewComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });
});
