import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ConditionMonitoringComponent } from './condition-monitoring.component';

describe('ConditionMonitoringComponent', () => {
  let component: ConditionMonitoringComponent;
  let fixture: ComponentFixture<ConditionMonitoringComponent>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, provideTranslocoTestingModule({})],
      providers: [provideMockStore()],

      declarations: [ConditionMonitoringComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
