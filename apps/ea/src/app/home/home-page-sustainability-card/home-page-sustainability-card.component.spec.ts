import { NgIf } from '@angular/common';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { Card } from '@ea/core/services/home/card.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HomePageSustainabilityCardComponent } from './home-page-sustainability-card.component';

describe('HomePageSustainbilityCardComponent', () => {
  let spectator: Spectator<HomePageSustainabilityCardComponent>;

  const createComponent = createComponentFactory({
    component: HomePageSustainabilityCardComponent,
    imports: [MatIconTestingModule, provideTranslocoTestingModule({ en: {} })],
    providers: [NgIf],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have a card input', () => {
    const card: Card = {
      mainTitle: 'mainTitle',
      action: jest.fn(),
    };
    spectator.setInput('card', card);
    spectator.detectChanges();
    expect(spectator.component.card).toEqual(card);
  });

  it('should call action when button is clicked', () => {
    const card: Card = {
      mainTitle: 'mainTitle',
      action: jest.fn(),
    };
    spectator.setInput('card', card);
    spectator.detectChanges();
    spectator.click('button');
    expect(card.action).toHaveBeenCalled();
  });
});
