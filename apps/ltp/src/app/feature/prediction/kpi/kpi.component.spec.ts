import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { KpiComponent } from './kpi.component';

import * as en from '../../../../assets/i18n/en.json';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let fixture: ComponentFixture<KpiComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [KpiComponent],
      imports: [provideTranslocoTestingModule({ en })]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
