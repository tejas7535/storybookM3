import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SelectionCardsComponent } from './selection-cards.component';

describe('SelectionCardsComponent', () => {
  let spectator: Spectator<SelectionCardsComponent>;
  const createComponent = createComponentFactory({
    component: SelectionCardsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should emit selectedOption when cardAction is called', () => {
    const selectionId = 'test-id';
    jest.spyOn(spectator.component.selectedOption, 'emit');

    spectator.component.cardAction(selectionId);

    expect(spectator.component.selectedOption.emit).toHaveBeenCalledWith(
      selectionId
    );
  });

  it('should have the correct inputs', () => {
    const options = [{ id: 'id value', imageUrl: 'url', text: 'text' }];

    spectator.setInput('selectedId', '123');
    spectator.setInput('options', options);

    expect(spectator.component.selectedId).toBe('123');
    expect(spectator.component.options).toEqual(options);
  });
});
