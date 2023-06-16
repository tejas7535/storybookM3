import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { DetailViewNavigationBarComponent } from './detail-view-navigation-bar.component';

describe('DetailViewNavigationBarComponent', () => {
  let spectator: Spectator<DetailViewNavigationBarComponent>;
  let component: DetailViewNavigationBarComponent;

  const createComponent = createComponentFactory({
    component: DetailViewNavigationBarComponent,
    imports: [ReactiveFormsModule, FormsModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateToCase', () => {
    const emitSpy = jest.fn();
    let buttons: HTMLButtonElement[];

    beforeEach(() => {
      buttons = spectator.queryAll('button');
      spectator.output('navigateToCase').subscribe((result) => emitSpy(result));
      spectator.setInput('numberOfCases', 10);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should emit 0 onFirstCaseClicked', () => {
      setSelectedCaseIndex(1);
      buttons[0].click();

      expect(emitSpy).toHaveBeenCalledWith(0);
    });

    it('should NOT emit 0 onFirstCaseClicked if first case is displayed', () => {
      setSelectedCaseIndex(0);
      buttons[0].click();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit prev index onPrevCaseClicked', () => {
      setSelectedCaseIndex(3);
      buttons[1].click();

      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('should NOT emit index onPrevCaseClicked if first case is displayed', () => {
      setSelectedCaseIndex(0);
      buttons[1].click();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit next index onNextCaseClicked', () => {
      setSelectedCaseIndex(3);
      buttons[2].click();

      expect(emitSpy).toHaveBeenCalledWith(4);
    });

    it('should NOT emit next index onNextCaseClicked if last case is displayed', () => {
      setSelectedCaseIndex(9);
      buttons[2].click();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit last index onLastCaseClicked', () => {
      setSelectedCaseIndex(1);
      buttons[3].click();

      expect(emitSpy).toHaveBeenCalledWith(9);
    });

    it('should NOT emit index onLastCaseClicked if last case is displayed', () => {
      setSelectedCaseIndex(9);
      buttons[3].click();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    const setSelectedCaseIndex = (index: number) => {
      spectator.setInput('selectedCaseIndex', index);
      spectator.detectChanges();
    };
  });

  describe('input', () => {
    const emitSpy = jest.fn();
    let input: HTMLInputElement;

    beforeEach(() => {
      input = spectator.query('input') as HTMLInputElement;
      spectator.output('navigateToCase').subscribe((result) => emitSpy(result));
      spectator.setInput('numberOfCases', 10);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should NOT emit if the user entered text', () => {
      enterValueInInputField('asd');

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should NOT emit if the user entered a negative number', () => {
      enterValueInInputField('-10');

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit if the user entered a valid index', () => {
      enterValueInInputField('5');

      expect(emitSpy).toHaveBeenCalledWith(4);
    });

    const enterValueInInputField = (value: string) => {
      spectator.typeInElement(value, input);
      spectator.blur(input);
    };
  });
});
