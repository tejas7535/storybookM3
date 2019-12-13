import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';

import { configureTestSuite } from 'ng-bullet';

import { KpiComponent } from './kpi.component';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let fixture: ComponentFixture<KpiComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [KpiComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ]
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
