import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { ResignationsComponent } from './resignations.component';

describe('ResignationsComponent', () => {
  let component: ResignationsComponent;
  let spectator: Spectator<ResignationsComponent>;

  const createComponent = createComponentFactory({
    component: ResignationsComponent,
    detectChanges: false,
    imports: [SharedModule, provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getRowClass', () => {
    test('should return correct css classes', () => {
      expect(component.getRowClass()).toEqual('border-2 border-veryLight');
    });
  });
});
