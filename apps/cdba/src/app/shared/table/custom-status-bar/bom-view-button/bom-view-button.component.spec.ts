import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BomViewButtonComponent } from './bom-view-button.component';

describe('BomViewButtonComponent', () => {
  let component: BomViewButtonComponent;
  let fixture: ComponentFixture<BomViewButtonComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BomViewButtonComponent],
      imports: [
        MatButtonModule,
        RouterTestingModule.withRoutes([]),
        provideTranslocoTestingModule({}),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomViewButtonComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
