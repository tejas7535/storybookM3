import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { FinishOfferButtonComponent } from './finish-offer-button.component';

describe('FinishOfferComponent', () => {
  let component: FinishOfferButtonComponent;
  let fixture: ComponentFixture<FinishOfferButtonComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [FinishOfferButtonComponent],
      imports: [
        MatButtonModule,
        RouterTestingModule.withRoutes([]),
        provideTranslocoTestingModule({}),
        MatIconModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishOfferButtonComponent);

    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showDetailView', () => {
    test('should navigate', () => {
      spyOn(router, 'navigate');
      component.finishOffer();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
