import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DimensionAndWeightComponent } from './dimension-and-weight.component';

registerLocaleData(de);

describe('DimensionAndWeightComponent', () => {
  let component: DimensionAndWeightComponent;
  let fixture: ComponentFixture<DimensionAndWeightComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({})],
      declarations: [DimensionAndWeightComponent],
      providers: [],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionAndWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
