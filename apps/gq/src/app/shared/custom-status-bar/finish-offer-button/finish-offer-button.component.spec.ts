import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { FinishOfferButtonComponent } from './finish-offer-button.component';

describe('FinishOfferComponent', () => {
  let component: FinishOfferButtonComponent;
  let spectator: Spectator<FinishOfferButtonComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: FinishOfferButtonComponent,
    declarations: [FinishOfferButtonComponent],
    imports: [
      MatButtonModule,
      RouterTestingModule.withRoutes([]),
      provideTranslocoTestingModule({}),
      MatIconModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
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
