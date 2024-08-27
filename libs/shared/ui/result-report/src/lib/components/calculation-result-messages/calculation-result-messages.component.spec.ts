import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CalculationResultMessagesComponent } from './calculation-result-messages.component';

describe('CalculationResultMessagesComponent', () => {
  let spectator: Spectator<CalculationResultMessagesComponent>;
  let component: CalculationResultMessagesComponent;

  const createComponent = createComponentFactory({
    component: CalculationResultMessagesComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create component', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when title and messages are provided', () => {
    beforeEach(() => {
      component.title = 'some title';
      component.messages = ['message 1', 'messsage 2'];

      spectator.detectChanges();
    });

    it('should display title', () => {
      expect(spectator.queryAll('.text-h5')[0].textContent?.trim()).toBe(
        'some title'
      );
    });

    it('should display all paragraphs with text', () => {
      expect(spectator.queryAll('p').length).toEqual(2);
    });
  });

  describe('when there are no messages to display', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should not display title', () => {
      expect(spectator.queryAll('h5')).toEqual([]);
    });

    it('should not dispaly messages', () => {
      expect(spectator.queryAll('p')).toEqual([]);
    });
  });
});
