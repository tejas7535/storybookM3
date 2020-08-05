import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { QuantitiesComponent } from './quantities.component';

registerLocaleData(de);

describe('QuantitiesComponent', () => {
  let component: QuantitiesComponent;
  let fixture: ComponentFixture<QuantitiesComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({})],
      declarations: [QuantitiesComponent],
      providers: [],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
