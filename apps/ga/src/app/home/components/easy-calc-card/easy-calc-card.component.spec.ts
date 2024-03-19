import { By } from '@angular/platform-browser';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { EasyCalcCardComponent } from './easy-calc-card.component';

describe('EasyCalcCardComponent', () => {
  let component: EasyCalcCardComponent;
  let spectator: Spectator<EasyCalcCardComponent>;

  const createComponent = createComponentFactory({
    component: EasyCalcCardComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have an image url', () => {
    expect(component.imageUrl).toBe('assets/images/ec-icon.svg');
  });

  it('should pass easy calc url with default utm parameters', () => {
    const link = spectator.debugElement.query(By.css('a'));
    expect(link.attributes.href).toBe(
      'https://medias-easycalc.com/home?utm_source=grease-app&utm_medium=app'
    );

    expect(link.attributes.target).toBe('_blank');
  });
});
