import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridListModule } from '@angular/material';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { configureTestSuite } from 'ng-bullet';

import { HttpLoaderFactory } from '../../../app.module';

import { SignedoutComponent } from './signedout.component';

describe('SignedoutComponent', () => {
  let component: SignedoutComponent;
  let fixture: ComponentFixture<SignedoutComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SignedoutComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientModule,
        MatGridListModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
