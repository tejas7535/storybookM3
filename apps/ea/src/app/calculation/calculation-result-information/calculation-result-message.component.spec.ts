import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CalculationResultMessageComponent } from './calculation-result-message.component';
import { ICalculationResultMessageComponent } from './calculation-result-message.component.interface';

describe('CalculationResultMessageComponent', () => {
  let spectator: Spectator<CalculationResultMessageComponent>;
  let component: CalculationResultMessageComponent;

  const createComponent = createComponentFactory({
    component: CalculationResultMessageComponent,
    imports: [],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('when title and messages are provided', () => {
    beforeEach(() => {
      component.title = 'some title';
      component.item = {
        messages: ['message 1', 'messsage 2'],
      };

      spectator.detectComponentChanges();
    });

    it('should display title', () => {
      expect(spectator.queryAll('.text-h5')[0].textContent.trim()).toBe(
        'some title'
      );
    });

    it('should display all paragraphs with text', () => {
      expect(spectator.queryAll('p').length).toEqual(2);
    });
  });

  describe('when nested sub items are provided', () => {
    beforeEach(() => {
      const subItems: ICalculationResultMessageComponent[] = [
        {
          item: {
            messages: ['message 1', 'messsage 2'],
          },
        },
        {
          item: {
            messages: ['message 3', 'messsage 4'],
          },
        },
      ];
      component.item = {
        subItems,
      };

      spectator.detectComponentChanges();
    });

    it('should display all paragraphs with text', () => {
      expect(spectator.queryAll('p').length).toEqual(4);
    });
  });

  describe('when there are no messages to display', () => {
    beforeEach(() => {
      spectator.detectComponentChanges();
    });

    it('should not display title', () => {
      expect(spectator.queryAll('h5')).toEqual([]);
    });

    it('should not dispaly subordinates info', () => {
      expect(spectator.queryAll('p')).toEqual([]);
    });
  });
});
