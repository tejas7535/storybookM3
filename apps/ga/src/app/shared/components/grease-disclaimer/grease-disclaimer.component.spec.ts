import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HomeCardsService } from '@ga/home/services/home-cards.service';

import { GreaseDisclaimerComponent } from './grease-disclaimer.component';

describe('GreaseDisclaimerComponent', () => {
  let spectator: Spectator<GreaseDisclaimerComponent>;
  let actionSpy: jest.Mock;

  const createComponent = createComponentFactory({
    component: GreaseDisclaimerComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: HomeCardsService,
        useValue: {
          contactExpertsAction: jest.fn(() => {
            actionSpy = jest.fn();

            return actionSpy;
          }),
        },
      },
    ],
    detectChanges: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should call the contactExpertsAction when onContact is called', () => {
    spectator.component.onContact();
    expect(actionSpy).toHaveBeenCalled();
  });

  it('should call the contactExpertsAction when button is clicked', () => {
    spectator.click('button');
    expect(actionSpy).toHaveBeenCalled();
  });
});
